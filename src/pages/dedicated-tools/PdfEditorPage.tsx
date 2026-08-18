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
import { addImageFromDataUrl, deleteSelected, serializeCanvas } from "../../lib/pdf-editor/fabricCanvas";
import { renderPageToDataUrl, getPdfPageCount } from "../../lib/pdf-editor/pdfRenderer";
import { exportToPdf } from "../../lib/pdf-editor/pdfExporter";
import { FileSession } from "../../lib/file-session";
import { downloadBytes } from "../../lib/utils";
import { FileText, Loader2 } from "lucide-react";

const RENDER_SCALE = 1.5;

export const PdfEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // PDF state
  const [pageCount, setPageCount] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

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

  // Auto-load from FileSession
  useEffect(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    if (f && f.name.toLowerCase().endsWith(".pdf") && !file) {
      handleFileSelected([f]);
    }
  }, []); // eslint-disable-line

  const handleFileSelected = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setIsLoading(true);
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

      // Render thumbnails (low res)
      const thumbs: string[] = [];
      for (let i = 1; i <= count; i++) {
        const { dataUrl: td } = await renderPageToDataUrl(f, i, 0.3);
        thumbs.push(td);
        setThumbnails([...thumbs]);
      }
    } catch (err) {
      toast({ title: "Error loading PDF", description: "Could not render this PDF.", variant: "error" });
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
      setIsLoading(true);
      try {
        const { dataUrl, width, height } = await renderPageToDataUrl(file, newPage + 1, RENDER_SCALE);
        setBgDataUrl(dataUrl);
        setCanvasWidth(width);
        setCanvasHeight(height);
      } finally {
        setIsLoading(false);
      }
    },
    [file, activePage]
  );

  const handleStateChange = useCallback(
    (state: object) => {
      setPageStates((prev) => ({ ...prev, [activePage]: state }));
      // Push to undo history
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
    fc.renderAll();
    handleStateChange(serializeCanvas(fc));
  }, [textColor, fontSize, shapeColor, shapeOpacity, handleStateChange]);

  const handleUndo = useCallback(() => {
    // TODO: proper per-canvas undo via Fabric history
    const fc = fabricRef.current;
    if (!fc) return;
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
  }, [historyIndex, history.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo]);

  const handleDownload = async () => {
    if (!file) return;
    const fc = fabricRef.current;
    // Save active page before export
    const allStates = fc
      ? { ...pageStates, [activePage]: serializeCanvas(fc) }
      : pageStates;

    setIsExporting(true);
    try {
      const statesArray = Array.from({ length: pageCount }, (_, i) => allStates[i] ?? null);
      const bytes = await exportToPdf(file, statesArray, canvasWidth, canvasHeight);
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBytes(bytes, `${baseName}_edited.pdf`);
      toast({ title: "PDF downloaded successfully!", variant: "success" });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "error" });
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
    };
    reader.readAsDataURL(imgFile);
    e.target.value = "";
  };

  // Upload screen
  if (!file) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-8 gap-6">
        <SeoHead
          title="Edit PDF Online — Add Text, Images & Signatures — Doclly"
          description="Free in-browser PDF editor. Add text, images, signatures, shapes, highlights and redactions to any PDF."
          keywords={["edit pdf", "pdf editor", "add text to pdf", "pdf annotate"]}
        />
        <div className="text-center space-y-2 mb-2">
          <div className="w-16 h-16 bg-[#FFF8D6] rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-[#FFC800]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#111111]">Edit PDF</h1>
          <p className="text-sm text-[#6B7280] max-w-sm">
            Add text, images, signatures, shapes, highlights and redactions — all in your browser. No uploads.
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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F0F0F0]">
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
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2.5))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
        onDownload={handleDownload}
        onBack={() => setFile(null)}
      />

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left tool panel */}
        <EditorToolbar activeTool={activeTool} onToolChange={setActiveTool} />

        {/* Canvas area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#FFC800]" />
              <span className="text-sm text-[#6B7280]">Rendering page…</span>
            </div>
          ) : bgDataUrl ? (
            <EditorCanvas
              bgDataUrl={bgDataUrl}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              zoom={zoom}
              activeTool={activeTool}
              savedState={pageStates[activePage] ?? null}
              onStateChange={handleStateChange}
              onObjectSelected={setSelectedType}
              onCanvasReady={(fc) => { fabricRef.current = fc; }}
              textColor={textColor}
              fontSize={fontSize}
              shapeColor={shapeColor}
              shapeOpacity={shapeOpacity}
              onRequestSignature={handleRequestSignature}
              onRequestImage={handleRequestImage}
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
          onTextColorChange={setTextColor}
          onFontSizeChange={setFontSize}
          onShapeColorChange={setShapeColor}
          onShapeOpacityChange={setShapeOpacity}
          onApplyProperties={handleApplyProperties}
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
      {showSignatureModal && (
        <SignatureModal
          onSave={handleSignatureSave}
          onClose={() => { setShowSignatureModal(false); setPendingInsertPos(null); }}
        />
      )}
    </div>
  );
};
