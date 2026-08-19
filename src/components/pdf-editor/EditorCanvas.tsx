import React, { useEffect, useRef, useCallback } from "react";
import { Canvas } from "fabric";
import type { EditorTool } from "../../lib/pdf-editor/fabricCanvas";
import type { DetectedTextBlock } from "../../lib/pdf-editor/textDetector";
import {
  initFabricCanvas,
  setCanvasBackground,
  addText,
  addImageFromDataUrl,
  addRect,
  addCircle,
  addLine,
  deleteSelected,
  serializeCanvas,
  loadCanvasState,
} from "../../lib/pdf-editor/fabricCanvas";

interface EditorCanvasProps {
  bgDataUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  activeTool: EditorTool;
  onToolChange?: (tool: EditorTool) => void;
  savedState: object | null;
  onStateChange: (state: object) => void;
  onObjectSelected: (type: string | null) => void;
  onCanvasReady: (canvas: Canvas) => void;
  onZoomChange?: (updater: (prev: number) => number) => void;
  textColor: string;
  fontSize: number;
  shapeColor: string;
  shapeOpacity: number;
  onRequestSignature: (x: number, y: number) => void;
  onRequestImage: (x: number, y: number) => void;
  detectedBlocks?: DetectedTextBlock[];
  isDetectionActive?: boolean;
  onSelectDetectedBlock?: (block: DetectedTextBlock) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  bgDataUrl,
  canvasWidth,
  canvasHeight,
  zoom,
  activeTool,
  onToolChange,
  savedState,
  onStateChange,
  onObjectSelected,
  onCanvasReady,
  onZoomChange,
  textColor,
  fontSize,
  shapeColor,
  shapeOpacity,
  onRequestSignature,
  onRequestImage,
  detectedBlocks = [],
  isDetectionActive = false,
  onSelectDetectedBlock,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  // Stable callback & props refs so event listeners always access latest values
  const onStateChangeRef = useRef(onStateChange);
  const onObjectSelectedRef = useRef(onObjectSelected);
  const onCanvasReadyRef = useRef(onCanvasReady);
  const onZoomChangeRef = useRef(onZoomChange);
  const onToolChangeRef = useRef(onToolChange);
  const activeToolRef = useRef(activeTool);
  const textColorRef = useRef(textColor);
  const fontSizeRef = useRef(fontSize);
  const shapeColorRef = useRef(shapeColor);
  const shapeOpacityRef = useRef(shapeOpacity);
  const onRequestSignatureRef = useRef(onRequestSignature);
  const onRequestImageRef = useRef(onRequestImage);

  useEffect(() => { onStateChangeRef.current = onStateChange; }, [onStateChange]);
  useEffect(() => { onObjectSelectedRef.current = onObjectSelected; }, [onObjectSelected]);
  useEffect(() => { onCanvasReadyRef.current = onCanvasReady; }, [onCanvasReady]);
  useEffect(() => { onZoomChangeRef.current = onZoomChange; }, [onZoomChange]);
  useEffect(() => { onToolChangeRef.current = onToolChange; }, [onToolChange]);
  useEffect(() => { activeToolRef.current = activeTool; }, [activeTool]);
  useEffect(() => { textColorRef.current = textColor; }, [textColor]);
  useEffect(() => { fontSizeRef.current = fontSize; }, [fontSize]);
  useEffect(() => { shapeColorRef.current = shapeColor; }, [shapeColor]);
  useEffect(() => { shapeOpacityRef.current = shapeOpacity; }, [shapeOpacity]);
  useEffect(() => { onRequestSignatureRef.current = onRequestSignature; }, [onRequestSignature]);
  useEffect(() => { onRequestImageRef.current = onRequestImage; }, [onRequestImage]);

  // --- Initialize / re-initialize Fabric canvas on background or dimension change ---
  useEffect(() => {
    const el = canvasElRef.current;
    if (!el || !bgDataUrl || canvasWidth === 0 || canvasHeight === 0) return;

    if (fabricRef.current) {
      try { fabricRef.current.dispose(); } catch {}
      fabricRef.current = null;
    }

    const fc = initFabricCanvas(el, bgDataUrl, canvasWidth, canvasHeight);
    fabricRef.current = fc;
    onCanvasReadyRef.current(fc);

    if (savedState) {
      loadCanvasState(fc, savedState);
    }

    const handleSelectionCreated = (e: any) => {
      onObjectSelectedRef.current(e.selected?.[0]?.type ?? null);
    };
    const handleSelectionUpdated = (e: any) => {
      onObjectSelectedRef.current(e.selected?.[0]?.type ?? null);
    };
    const handleSelectionCleared = () => onObjectSelectedRef.current(null);
    const saveState = () => onStateChangeRef.current(serializeCanvas(fc));

    // Tool placement on mousedown (prevents spurious click after drag)
    const handleMouseDown = (opt: any) => {
      const tool = activeToolRef.current;
      if (tool === "select") return;

      // If user clicked on an existing object, just select it
      if (opt.target && opt.target !== fc.backgroundImage) {
        onToolChangeRef.current?.("select");
        return;
      }

      // Read exact coordinates inside the Fabric canvas (accounting for zoom & DPI)
      const rect = fc.upperCanvasEl?.getBoundingClientRect() || fc.lowerCanvasEl?.getBoundingClientRect();
      let x = 0;
      let y = 0;
      if (rect && rect.width > 0 && rect.height > 0) {
        x = Math.max(0, Math.min(canvasWidth, ((opt.e.clientX - rect.left) / rect.width) * canvasWidth));
        y = Math.max(0, Math.min(canvasHeight, ((opt.e.clientY - rect.top) / rect.height) * canvasHeight));
      } else {
        const pointer = (fc as any).getScenePoint ? (fc as any).getScenePoint(opt.e) : fc.getViewportPoint(opt.e);
        x = pointer.x;
        y = pointer.y;
      }

      switch (tool) {
        case "text":
          addText(fc, x, y, { fontSize: fontSizeRef.current, fill: textColorRef.current });
          onToolChangeRef.current?.("select");
          break;
        case "rect":
          addRect(fc, x, y, "rect", shapeColorRef.current, shapeColorRef.current);
          onToolChangeRef.current?.("select");
          break;
        case "highlight":
          addRect(fc, x, y, "highlight");
          onToolChangeRef.current?.("select");
          break;
        case "redact":
          addRect(fc, x, y, "redact");
          onToolChangeRef.current?.("select");
          break;
        case "circle":
          addCircle(fc, x, y, shapeColorRef.current, shapeColorRef.current);
          onToolChangeRef.current?.("select");
          break;
        case "line":
          addLine(fc, x, y, shapeColorRef.current);
          onToolChangeRef.current?.("select");
          break;
        case "eraser":
          if (opt.target) {
            deleteSelected(fc);
          }
          onToolChangeRef.current?.("select");
          break;
        case "signature":
          onRequestSignatureRef.current(x, y);
          break;
        case "image":
          onRequestImageRef.current(x, y);
          break;
      }
    };

    fc.on("selection:created", handleSelectionCreated);
    fc.on("selection:updated", handleSelectionUpdated);
    fc.on("selection:cleared", handleSelectionCleared);
    fc.on("mouse:down", handleMouseDown);
    fc.on("object:modified", saveState);
    fc.on("object:added", saveState);
    fc.on("object:removed", saveState);
    fc.on("text:changed", saveState);

    return () => {
      try { fc.dispose(); } catch {}
      fabricRef.current = null;
    };
  }, [bgDataUrl, canvasWidth, canvasHeight]);

  // --- Mouse Wheel Zoom Handling (Ctrl + Wheel or Pinch) ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.08 : -0.08;
        if (onZoomChangeRef.current) {
          onZoomChangeRef.current((z) => Math.min(2.5, Math.max(0.2, Number((z + delta).toFixed(2)))));
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // --- Keyboard: Delete selected object ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const fc = fabricRef.current;
      if (!fc) return;
      const active = fc.getActiveObject() as any;
      if (!active || active.isEditing) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected(fc);
        onStateChangeRef.current(serializeCanvas(fc));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto flex-1 bg-[#374151] p-6 select-none scrollbar-thin flex"
      style={{ cursor: activeTool !== "select" ? "crosshair" : "default" }}
    >
      <div
        style={{
          width: `${Math.round(canvasWidth * zoom)}px`,
          height: `${Math.round(canvasHeight * zoom)}px`,
        }}
        className="relative shrink-0 m-auto"
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            boxShadow: "0 14px 44px rgba(0,0,0,0.45)",
          }}
          className="bg-white rounded-xs relative"
        >
          <canvas ref={canvasElRef} />

          {/* Interactive OCR / Text Detection Overlay */}
          {isDetectionActive && detectedBlocks.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {detectedBlocks.map((block) => (
                <div
                  key={block.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDetectedBlock?.(block);
                  }}
                  title={`Click to erase & edit: "${block.text}"`}
                  style={{
                    left: `${block.x}px`,
                    top: `${block.y}px`,
                    width: `${block.width}px`,
                    height: `${block.height}px`,
                  }}
                  className="absolute pointer-events-auto border-2 border-dashed border-amber-500 bg-amber-300/20 hover:bg-amber-400/45 hover:border-solid hover:border-amber-600 transition-all rounded-xs cursor-pointer group"
                >
                  <span className="absolute -top-5 left-0 bg-[#111111] text-[#FFC800] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                    Click to Edit Text
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
