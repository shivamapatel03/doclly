import React, { useEffect, useRef, useCallback } from "react";
import { Canvas } from "fabric";
import type { EditorTool } from "../../lib/pdf-editor/fabricCanvas";
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
  savedState: object | null;
  onStateChange: (state: object) => void;
  onObjectSelected: (type: string | null) => void;
  onCanvasReady: (canvas: Canvas) => void;
  textColor: string;
  fontSize: number;
  shapeColor: string;
  shapeOpacity: number;
  onRequestSignature: (x: number, y: number) => void;
  onRequestImage: (x: number, y: number) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  bgDataUrl,
  canvasWidth,
  canvasHeight,
  zoom,
  activeTool,
  savedState,
  onStateChange,
  onObjectSelected,
  onCanvasReady,
  textColor,
  fontSize,
  shapeColor,
  shapeOpacity,
  onRequestSignature,
  onRequestImage,
}) => {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  // Store the live Fabric canvas instance
  const fabricRef = useRef<Canvas | null>(null);
  // Stable callback refs so effects don't re-run when closures change
  const onStateChangeRef = useRef(onStateChange);
  const onObjectSelectedRef = useRef(onObjectSelected);
  const onCanvasReadyRef = useRef(onCanvasReady);
  useEffect(() => { onStateChangeRef.current = onStateChange; }, [onStateChange]);
  useEffect(() => { onObjectSelectedRef.current = onObjectSelected; }, [onObjectSelected]);
  useEffect(() => { onCanvasReadyRef.current = onCanvasReady; }, [onCanvasReady]);

  // --- Initialize / re-initialize whenever the background changes ---
  useEffect(() => {
    const el = canvasElRef.current;
    if (!el || !bgDataUrl || canvasWidth === 0 || canvasHeight === 0) return;

    // Dispose any previous canvas (safe to call on an already-disposed canvas)
    if (fabricRef.current) {
      try { fabricRef.current.dispose(); } catch {}
      fabricRef.current = null;
    }

    // Clear the canvas element so Fabric gets a fresh one
    const ctx = el.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, el.width, el.height);

    const fc = initFabricCanvas(el, bgDataUrl, canvasWidth, canvasHeight);
    fabricRef.current = fc;
    onCanvasReadyRef.current(fc);

    // Restore saved annotations if any
    if (savedState) {
      loadCanvasState(fc, savedState);
    }

    // --- Event listeners ---
    const handleSelectionCreated = (e: any) => {
      onObjectSelectedRef.current(e.selected?.[0]?.type ?? null);
    };
    const handleSelectionUpdated = (e: any) => {
      onObjectSelectedRef.current(e.selected?.[0]?.type ?? null);
    };
    const handleSelectionCleared = () => onObjectSelectedRef.current(null);
    const saveState = () => onStateChangeRef.current(serializeCanvas(fc));

    fc.on("selection:created", handleSelectionCreated);
    fc.on("selection:updated", handleSelectionUpdated);
    fc.on("selection:cleared", handleSelectionCleared);
    fc.on("object:modified", saveState);
    fc.on("object:added", saveState);
    fc.on("object:removed", saveState);
    fc.on("text:changed", saveState);

    return () => {
      try { fc.dispose(); } catch {}
      fabricRef.current = null;
    };
  }, [bgDataUrl, canvasWidth, canvasHeight]); // re-init when page changes

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

  // --- Canvas click: placement tools ---
  const handleWrapperClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const fc = fabricRef.current;
      if (!fc || activeTool === "select") return;

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      switch (activeTool) {
        case "text":
          addText(fc, x, y, { fontSize, fill: textColor });
          break;
        case "rect":
          addRect(fc, x, y, "rect", shapeColor, shapeColor);
          break;
        case "highlight":
          addRect(fc, x, y, "highlight");
          break;
        case "redact":
          addRect(fc, x, y, "redact");
          break;
        case "circle":
          addCircle(fc, x, y, shapeColor, shapeColor);
          break;
        case "line":
          addLine(fc, x, y, shapeColor);
          break;
        case "eraser":
          deleteSelected(fc);
          break;
        case "signature":
          onRequestSignature(x, y);
          break;
        case "image":
          onRequestImage(x, y);
          break;
      }
    },
    [activeTool, zoom, fontSize, textColor, shapeColor, onRequestSignature, onRequestImage]
  );

  return (
    <div
      className="relative overflow-auto flex-1 bg-[#CBCBCB] flex items-start justify-center p-6"
      style={{ cursor: activeTool !== "select" ? "crosshair" : "default" }}
      onClick={handleWrapperClick}
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
        }}
      >
        <canvas ref={canvasElRef} />
      </div>
    </div>
  );
};
