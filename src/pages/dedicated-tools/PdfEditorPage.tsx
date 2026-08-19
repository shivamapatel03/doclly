import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Canvas } from "fabric";
import { UploadZone } from "../../components/tools/UploadZone";
import { SeoHead } from "../../components/layout/SeoHead";
import { EditorToolbar } from "../../components/pdf-editor/EditorToolbar";
import { EditorCanvas } from "../../components/pdf-editor/EditorCanvas";
import { EditorPropertiesPanel } from "../../components/pdf-editor/EditorPropertiesPanel";
import { EditorPageStrip } from "../../components/pdf-editor/EditorPageStrip";
import { EditorTopbar } from "../../components/pdf-editor/EditorTopbar";
import { SignatureModal } from "../../components/tools/SignatureModal";
import { useToast } from "../../components/common/Toast";
import type { EditorTool } from "../../lib/pdf-editor/fabricCanvas";
import {
  addImageFromDataUrl,
  deleteSelected,
  serializeCanvas,
  convertDetectedTextToEditable,
  convertAllDetectedText,
} from "../../lib/pdf-editor/fabricCanvas";
import { detectPageText, type DetectedTextBlock } from "../../lib/pdf-editor/textDetector";
import { renderPageToDataUrl, getPdfPageCount } from "../../lib/pdf-editor/pdfRenderer";
import { exportToPdf } from "../../lib/pdf-editor/pdfExporter";
import { FileSession } from "../../lib/file-session";
import { downloadBytes } from "../../lib/utils";
import { DocumentStorage } from "../../lib/storage";
import { ThreeDIcon } from "../../components/common/ThreeDIcon";
import { FileText, Loader2, AlertCircle, X, Sparkles } from "lucide-react";

const RENDER_SCALE = 1.5;

export const PdfEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // PDF state
  const [pageCount, setPageCount] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // Text Detection / OCR state
  const [detectedBlocks, setDetectedBlocks] = useState<DetectedTextBlock[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isDetectionActive, setIsDetectionActive] = useState(false);

  // Canvas state
  const [bgDataUrl, setBgDataUrl] = useState<string>("");
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [pageStates, setPageStates] = useState<Record<number, object>>({});
  const fabricRef = useRef<Canvas | null>(null);

  // Editor state
  const [activeTool, setActiveTool] = useState<EditorTool>("select");
  const [zoom, setZoom] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#111111");
  const [fontSize, setFontSize] = useState(18);
  const [shapeColor, setShapeColor] = useState("#ef4444");
  const [shapeOpacity, setShapeOpacity] = useState(1);

  // History for undo/redo
  const [history, setHistory] = useState<object[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Signature / image insertion
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [pendingInsertPos, setPendingInsertPos] = useState<{ x: number; y: number } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [pendingImagePos, setPendingImagePos] = useState<{ x: number; y: number } | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      editorContainerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Auto-load from FileSession or Router State
  useEffect(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    if (f && f.name.toLowerCase().endsWith(".pdf") && !file) {
      handleFileSelected([f]);
    }
  }, []); // eslint-disable-line

  // Smart fit zoom calculation for any document aspect ratio
  const fitPageToScreen = useCallback((w: number, h: number) => {
    if (!w || !h) return 0.75;
    const availW = Math.max(300, window.innerWidth - (selectedType ? 280 : 80) - 64);
    const availH = Math.max(300, window.innerHeight - 220);

    const scaleW = availW / w;
    const scaleH = availH / h;

    return Math.min(1.0, Math.max(0.2, Number(Math.min(scaleW, scaleH).toFixed(2))));
  }, [selectedType]);

  const handleFileSelected = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    FileSession.setFile(f);
    setIsLoading(true);
    setLoadError(null);
    setActivePage(0);
    setPageStates({});
    setHistory([]);
    setHistoryIndex(-1);

    try {
      const count = await getPdfPageCount(f);
      setPageCount(count);

      // Render page 1 immediately
      const { dataUrl, width, height } = await renderPageToDataUrl(f, 1, RENDER_SCALE);
      setBgDataUrl(dataUrl);
      setCanvasWidth(width);
      setCanvasHeight(height);

      // Set initial fit zoom
      setZoom(fitPageToScreen(width, height));

      // Render thumbnails in background
      const thumbs: string[] = [];
      for (let i = 1; i <= Math.min(count, 30); i++) {
        try {
          const { dataUrl: td } = await renderPageToDataUrl(f, i, 0.35);
          thumbs.push(td);
          setThumbnails([...thumbs]);
        } catch {}
      }
    } catch (err: any) {
      console.error("Error loading PDF:", err);
      setLoadError(err?.message || "Could not render this PDF document.");
      toast.error("Could not render this PDF document. Please try another file.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchPage = useCallback(
    async (newPage: number) => {
      if (!file || newPage === activePage) return;
      const fc = fabricRef.current;

      // Save current page state
      if (fc) {
        setPageStates((prev) => ({ ...prev, [activePage]: serializeCanvas(fc) }));
      }

      setActivePage(newPage);
      setDetectedBlocks([]);
      setIsDetectionActive(false);
      setIsLoading(true);
      try {
        const { dataUrl, width, height } = await renderPageToDataUrl(file, newPage + 1, RENDER_SCALE);
        setBgDataUrl(dataUrl);
        setCanvasWidth(width);
        setCanvasHeight(height);
      } catch (err: any) {
        toast.error(`Could not load page ${newPage + 1}`);
      } finally {
        setIsLoading(false);
      }
    },
    [file, activePage, toast]
  );

  // Auto-Detect & Edit Text (OCR) handlers
  const handleDetectText = async () => {
    if (!file) return;
    if (isDetectionActive) {
      setIsDetectionActive(false);
      return;
    }
    setIsDetecting(true);
    try {
      const blocks = await detectPageText(file, activePage + 1, RENDER_SCALE);
      if (blocks.length === 0) {
        toast.info("No text layer detected on this page. You can add new text using the Add Text tool.");
      } else {
        setDetectedBlocks(blocks);
        setIsDetectionActive(true);
        toast.success(`Found ${blocks.length} text lines! Click any box to edit in-place.`);
      }
    } catch (err: any) {
      console.error("Text detection error:", err);
      toast.error("Could not scan text on this page.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectDetectedBlock = (block: DetectedTextBlock) => {
    const fc = fabricRef.current;
    if (!fc) return;
    convertDetectedTextToEditable(fc, block);
    setDetectedBlocks((prev) => prev.filter((b) => b.id !== block.id));
    handleStateChange(serializeCanvas(fc));
    setActiveTool("select");
    toast.success("Text unlocked for editing!");
  };

  const handleConvertAllText = () => {
    const fc = fabricRef.current;
    if (!fc || detectedBlocks.length === 0) return;
    convertAllDetectedText(fc, detectedBlocks);
    setDetectedBlocks([]);
    setIsDetectionActive(false);
    handleStateChange(serializeCanvas(fc));
    setActiveTool("select");
    toast.success("All page text converted to editable text boxes!");
  };

  const handleStateChange = useCallback(
    (state: object) => {
      setPageStates((prev) => ({ ...prev, [activePage]: state }));
      setHistory((h) => {
        const newH = h.slice(0, historyIndex + 1);
        newH.push(state);
        return newH;
      });
      setHistoryIndex((i) => i + 1);
    },
    [activePage, historyIndex]
  );

  const handleApplyProperties = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    const obj = fc.getActiveObject() as any;
    if (!obj) return;
    if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text") {
      obj.set({ fill: textColor, fontSize });
    } else {
      obj.set({ fill: shapeColor, opacity: shapeOpacity });
    }
    fc.requestRenderAll();
    handleStateChange(serializeCanvas(fc));
  }, [textColor, fontSize, shapeColor, shapeOpacity, handleStateChange]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const state = history[newIndex];
    if (state && fabricRef.current) {
      fabricRef.current.loadFromJSON(state).then(() => {
        fabricRef.current?.requestRenderAll();
      });
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const state = history[newIndex];
    if (state && fabricRef.current) {
      fabricRef.current.loadFromJSON(state).then(() => {
        fabricRef.current?.requestRenderAll();
      });
    }
  }, [historyIndex, history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo]);

  const handleApplyChanges = useCallback(() => {
    const fc = fabricRef.current;
    if (fc) {
      const state = serializeCanvas(fc);
      setPageStates((prev) => ({ ...prev, [activePage]: state }));
      toast.success("Changes applied & saved!");
    }
  }, [activePage, toast]);

  const handleDownload = async () => {
    if (!file) return;
    const fc = fabricRef.current;
    // Save active page before export
    const currentState = fc ? serializeCanvas(fc) : (pageStates[activePage] ?? null);
    const allStates = { ...pageStates, [activePage]: currentState };
    setPageStates(allStates);

    setIsExporting(true);
    try {
      const statesArray = Array.from({ length: pageCount }, (_, i) => allStates[i] ?? null);
      const bytes = await exportToPdf(file, statesArray, canvasWidth, canvasHeight);
      const baseName = file.name.replace(/\.pdf$/i, "");
      const outName = `${baseName}_edited.pdf`;
      downloadBytes(bytes, outName);

      // Save to document storage
      DocumentStorage.saveDocument({
        name: outName,
        size: bytes.byteLength,
        type: "application/pdf",
        data: bytes,
      });

      toast.success("PDF exported and downloaded successfully!");
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error(err.message || "Failed to export the edited PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  // Signature placement
  const handleRequestSignature = (x: number, y: number) => {
    setPendingInsertPos({ x, y });
    setShowSignatureModal(true);
  };

  const handleSignatureSave = (dataUrl: string) => {
    const fc = fabricRef.current;
    if (!fc || !pendingInsertPos) return;
    addImageFromDataUrl(fc, dataUrl, pendingInsertPos.x, pendingInsertPos.y);
    setShowSignatureModal(false);
    setPendingInsertPos(null);
    setActiveTool("select");
    toast.success("Signature placed on canvas!");
  };

  // Image placement
  const handleRequestImage = (x: number, y: number) => {
    setPendingImagePos({ x, y });
    imageInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile || !pendingImagePos) return;
    const reader = new FileReader();
    reader.onload = () => {
      const fc = fabricRef.current;
      if (!fc) return;
      addImageFromDataUrl(fc, reader.result as string, pendingImagePos.x, pendingImagePos.y);
      setActiveTool("select");
      setPendingImagePos(null);
      toast.success("Image placed on canvas!");
    };
    reader.readAsDataURL(imgFile);
    e.target.value = "";
  };

  // Upload screen
  if (!file) {
    return (
      <div className="min-h-[85vh] bg-[#F9F9F9] flex flex-col items-center justify-center p-8 gap-6">
        <SeoHead
          title="Edit PDF Online — Add Text, Images & Signatures — Doclly"
          description="Free in-browser PDF editor. Add text, images, signatures, shapes, highlights and redactions to any PDF."
          keywords={["edit pdf", "pdf editor", "add text to pdf", "pdf annotate"]}
        />
        <div className="text-center space-y-2 mb-2">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-2 drop-shadow-md">
            <ThreeDIcon name="pdf" className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#111111]">Edit PDF Document</h1>
          <p className="text-sm text-[#6B7280] max-w-md mx-auto">
            Add text, images, legal signatures, shapes, highlights and whiteout redactions — 100% in your browser.
          </p>
        </div>
        <div className="w-full max-w-lg">
          <UploadZone
            onFilesSelected={handleFileSelected}
            accepts={[".pdf"]}
            acceptsDescription="PDF files only"
            maxFiles={1}
            multiple={false}
          />
        </div>
      </div>
    );
  }

  // Load error screen
  if (loadError) {
    return (
      <div className="min-h-[85vh] bg-[#F9F9F9] flex flex-col items-center justify-center p-8 gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-[#111111]">Failed to load PDF</h2>
        <p className="text-sm text-[#6B7280] max-w-md">{loadError}</p>
        <button
          onClick={() => { setFile(null); setLoadError(null); }}
          className="mt-4 bg-[#FFC800] text-[#111111] font-bold px-6 py-2 rounded-xl text-sm hover:bg-[#f0b800] cursor-pointer"
        >
          Choose another PDF
        </button>
      </div>
    );
  }

  return (
    <div
      ref={editorContainerRef}
      className={`flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen bg-[#F0F0F0]" : "h-[calc(100vh-64px)] bg-[#F0F0F0]"
      } overflow-hidden`}
    >
      <SeoHead
        title="Edit PDF Online — Add Text, Images & Signatures — Doclly"
        description="Free in-browser PDF editor. Add text, images, signatures, shapes, highlights and redactions to any PDF."
        keywords={["edit pdf", "pdf editor"]}
      />

      {/* Top bar */}
      <EditorTopbar
        fileName={file.name}
        activePage={activePage}
        totalPages={pageCount}
        zoom={zoom}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isExporting={isExporting}
        isFullscreen={isFullscreen}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={() => setZoom((z) => Math.min(Number((z + 0.1).toFixed(2)), 2.5))}
        onZoomOut={() => setZoom((z) => Math.max(Number((z - 0.1).toFixed(2)), 0.2))}
        onFitScreen={() => setZoom(fitPageToScreen(canvasWidth, canvasHeight))}
        onToggleFullscreen={toggleFullscreen}
        onDetectText={handleDetectText}
        isDetecting={isDetecting}
        isDetectionActive={isDetectionActive}
        onApplyChanges={handleApplyChanges}
        onDownload={handleDownload}
        onBack={() => setFile(null)}
      />

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left tool panel */}
        <EditorToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />

        {/* Canvas area */}
        <div className="flex flex-col flex-1 overflow-hidden relative">
          {/* Text Detection Notification Banner */}
          {isDetectionActive && detectedBlocks.length > 0 && (
            <div className="bg-amber-500 text-[#111111] px-4 py-1.5 flex items-center justify-between text-xs font-semibold shrink-0 select-none shadow-sm z-30 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <span>Text Detection Active: Click any highlighted text block to edit in-place.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConvertAllText}
                  className="bg-[#111111] bg-gradient-to-b from-white/10 to-transparent text-[#FFC800] hover:bg-black active:bg-neutral-900 border border-black px-3.5 py-1 rounded-full text-xs font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.2)] transition-all cursor-pointer select-none"
                >
                  Convert All Text ({detectedBlocks.length})
                </button>
                <button
                  onClick={() => setIsDetectionActive(false)}
                  className="p-1 hover:bg-black/10 rounded cursor-pointer text-[#111111]"
                  title="Close Text Mode"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#E5E5E5]">
              <Loader2 className="w-8 h-8 animate-spin text-[#111111]" />
              <span className="text-sm font-semibold text-[#111111]">Rendering page {activePage + 1}…</span>
            </div>
          ) : bgDataUrl ? (
            <EditorCanvas
              bgDataUrl={bgDataUrl}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              zoom={zoom}
              activeTool={activeTool}
              onToolChange={setActiveTool}
              savedState={pageStates[activePage] ?? null}
              onStateChange={handleStateChange}
              onObjectSelected={setSelectedType}
              onCanvasReady={(fc) => { fabricRef.current = fc; }}
              onZoomChange={setZoom}
              textColor={textColor}
              fontSize={fontSize}
              shapeColor={shapeColor}
              shapeOpacity={shapeOpacity}
              onRequestSignature={handleRequestSignature}
              onRequestImage={handleRequestImage}
              detectedBlocks={detectedBlocks}
              isDetectionActive={isDetectionActive}
              onSelectDetectedBlock={handleSelectDetectedBlock}
            />
          ) : null}

          {/* Page thumbnail strip */}
          <EditorPageStrip
            thumbnails={thumbnails}
            activePage={activePage}
            onPageSelect={switchPage}
          />
        </div>

        {/* Right properties panel */}
        <EditorPropertiesPanel
          selectedType={selectedType}
          textColor={textColor}
          fontSize={fontSize}
          shapeColor={shapeColor}
          shapeOpacity={shapeOpacity}
          onTextColorChange={(c) => { setTextColor(c); handleApplyProperties(); }}
          onFontSizeChange={(s) => { setFontSize(s); handleApplyProperties(); }}
          onShapeColorChange={(c) => { setShapeColor(c); handleApplyProperties(); }}
          onShapeOpacityChange={(o) => { setShapeOpacity(o); handleApplyProperties(); }}
          onApplyProperties={handleApplyProperties}
          onClose={() => setSelectedType(null)}
        />
      </div>

      {/* Hidden image file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Signature modal */}
      <SignatureModal
        isOpen={showSignatureModal}
        onSaveSignature={handleSignatureSave}
        onClose={() => { setShowSignatureModal(false); setPendingInsertPos(null); }}
      />
    </div>
  );
};
