import { Canvas, FabricImage, Rect, Circle, Line, Textbox } from "fabric";
import type { DetectedTextBlock } from "./textDetector";

export type EditorTool =
  | "select"
  | "text"
  | "image"
  | "signature"
  | "rect"
  | "circle"
  | "line"
  | "highlight"
  | "redact"
  | "eraser";

export interface CanvasState {
  json: object;
}

/**
 * Initialize a Fabric canvas with a PDF page background.
 */
export function initFabricCanvas(
  canvasEl: HTMLCanvasElement,
  bgDataUrl: string,
  width: number,
  height: number
): Canvas {
  const canvas = new Canvas(canvasEl, {
    width,
    height,
    selection: true,
    preserveObjectStacking: true,
    enableRetinaScaling: false, // Ensures 1:1 pixel mapping across all DPI scaling
  });

  // Fix for HTML5 Fullscreen mode: ensure hiddenTextarea is ALWAYS inside canvas wrapper
  canvas.on("text:editing:entered" as any, (opt: any) => {
    const target = opt.target;
    if (target && target.hiddenTextarea) {
      const wrapper = canvas.wrapperEl;
      if (wrapper && target.hiddenTextarea.parentElement !== wrapper) {
        wrapper.appendChild(target.hiddenTextarea);
      }
      target.hiddenTextarea.style.position = "absolute";
      target.hiddenTextarea.style.opacity = "0.001";
      target.hiddenTextarea.style.pointerEvents = "auto";
      target.hiddenTextarea.style.zIndex = "99999";
      setTimeout(() => {
        target.hiddenTextarea?.focus();
      }, 20);
    }
  });

  if (bgDataUrl) {
    FabricImage.fromURL(bgDataUrl).then((img) => {
      const origW = img.width || width;
      const origH = img.height || height;
      img.set({
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        scaleX: width / origW,
        scaleY: height / origH,
        selectable: false,
        evented: false,
      });
      canvas.backgroundImage = img;
      canvas.requestRenderAll();
    }).catch((err) => {
      console.warn("Could not set canvas background image:", err);
    });
  }

  return canvas;
}

/**
 * Update the background image and dimensions of an existing canvas.
 */
export function setCanvasBackground(canvas: Canvas, bgDataUrl: string, width: number, height: number) {
  canvas.setDimensions({ width, height });
  if (bgDataUrl) {
    FabricImage.fromURL(bgDataUrl).then((img) => {
      const origW = img.width || width;
      const origH = img.height || height;
      img.set({
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        scaleX: width / origW,
        scaleY: height / origH,
        selectable: false,
        evented: false,
      });
      canvas.backgroundImage = img;
      canvas.requestRenderAll();
    }).catch((err) => {
      console.warn("Could not update canvas background image:", err);
    });
  }
}

/** Serialize canvas objects (excluding background) to JSON. */
export function serializeCanvas(canvas: Canvas): object {
  return canvas.toJSON();
}

/** Load previously serialized state onto the canvas. */
export async function loadCanvasState(canvas: Canvas, state: object): Promise<void> {
  if (!state) return;
  try {
    await canvas.loadFromJSON(state);
    canvas.requestRenderAll();
  } catch (err) {
    console.warn("Could not load canvas JSON state:", err);
  }
}

/** Add a text box at the given position. */
export function addText(
  canvas: Canvas,
  x: number,
  y: number,
  options?: { fontSize?: number; fill?: string; fontFamily?: string }
) {
  const text = new Textbox("Type text here", {
    left: x,
    top: y,
    fontSize: options?.fontSize ?? 20,
    fill: options?.fill ?? "#111111",
    fontFamily: options?.fontFamily ?? "Helvetica",
    width: 220,
    editable: true,
    borderColor: "#FFC800",
    cornerColor: "#FFC800",
    cornerStrokeColor: "#111111",
    transparentCorners: false,
    cornerSize: 8,
  });
  (text as any).objectType = "text";
  canvas.add(text);
  canvas.setActiveObject(text);
  
  // Auto-enter editing mode and anchor hiddenTextarea inside canvas wrapper
  setTimeout(() => {
    try {
      text.enterEditing();
      text.selectAll();
      const wrapper = canvas.wrapperEl;
      if (wrapper && text.hiddenTextarea && text.hiddenTextarea.parentElement !== wrapper) {
        wrapper.appendChild(text.hiddenTextarea);
      }
      if (text.hiddenTextarea) {
        text.hiddenTextarea.style.position = "absolute";
        text.hiddenTextarea.style.opacity = "0.001";
        text.hiddenTextarea.style.pointerEvents = "auto";
        text.hiddenTextarea.style.zIndex = "99999";
        text.hiddenTextarea.focus();
      }
      canvas.requestRenderAll();
    } catch {}
  }, 30);

  canvas.requestRenderAll();
  return text;
}

/** Convert a detected text block into an active editable Textbox over a whiteout mask. */
export function convertDetectedTextToEditable(
  canvas: Canvas,
  block: DetectedTextBlock,
  bgColor = "#FFFFFF"
): Textbox {
  // 1. Add whiteout cover rectangle to mask the original flattened text
  const mask = new Rect({
    left: Math.max(0, block.x - 2),
    top: Math.max(0, block.y - 1),
    width: block.width + 4,
    height: block.height + 2,
    fill: bgColor,
    stroke: "transparent",
    selectable: false,
    evented: false,
  });
  (mask as any).objectType = "redact";
  canvas.add(mask);

  // 2. Add editable Textbox with matching original text and font size
  const textbox = new Textbox(block.text, {
    left: block.x,
    top: block.y,
    width: Math.max(80, block.width + 12),
    fontSize: block.fontSize,
    fontFamily: block.fontFamily || "Helvetica",
    fill: "#111111",
    editable: true,
    borderColor: "#FFC800",
    cornerColor: "#FFC800",
    cornerStrokeColor: "#111111",
    transparentCorners: false,
    cornerSize: 8,
  });
  (textbox as any).objectType = "text";
  canvas.add(textbox);
  canvas.setActiveObject(textbox);

  // Auto-enter editing mode and anchor hiddenTextarea inside canvas wrapper
  setTimeout(() => {
    try {
      textbox.enterEditing();
      textbox.selectAll();
      const wrapper = canvas.wrapperEl;
      if (wrapper && textbox.hiddenTextarea && textbox.hiddenTextarea.parentElement !== wrapper) {
        wrapper.appendChild(textbox.hiddenTextarea);
      }
      if (textbox.hiddenTextarea) {
        textbox.hiddenTextarea.style.position = "absolute";
        textbox.hiddenTextarea.style.opacity = "0.001";
        textbox.hiddenTextarea.style.pointerEvents = "auto";
        textbox.hiddenTextarea.style.zIndex = "99999";
        textbox.hiddenTextarea.focus();
      }
      canvas.requestRenderAll();
    } catch {}
  }, 30);

  canvas.requestRenderAll();
  return textbox;
}

/** Convert all detected text blocks across the active page. */
export function convertAllDetectedText(
  canvas: Canvas,
  blocks: DetectedTextBlock[],
  bgColor = "#FFFFFF"
): void {
  for (const block of blocks) {
    const mask = new Rect({
      left: Math.max(0, block.x - 2),
      top: Math.max(0, block.y - 1),
      width: block.width + 4,
      height: block.height + 2,
      fill: bgColor,
      stroke: "transparent",
      selectable: false,
      evented: false,
    });
    (mask as any).objectType = "redact";
    canvas.add(mask);

    const textbox = new Textbox(block.text, {
      left: block.x,
      top: block.y,
      width: Math.max(80, block.width + 12),
      fontSize: block.fontSize,
      fontFamily: block.fontFamily || "Helvetica",
      fill: "#111111",
      editable: true,
      borderColor: "#FFC800",
      cornerColor: "#FFC800",
      cornerStrokeColor: "#111111",
      transparentCorners: false,
      cornerSize: 8,
    });
    (textbox as any).objectType = "text";
    canvas.add(textbox);
  }
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

/** Add an image from a data URL. */
export async function addImageFromDataUrl(canvas: Canvas, dataUrl: string, x = 50, y = 50) {
  try {
    const img = await FabricImage.fromURL(dataUrl);
    const scale = Math.min(0.5, 300 / (img.width || 300));
    img.set({
      left: x,
      top: y,
      scaleX: scale,
      scaleY: scale,
      borderColor: "#FFC800",
      cornerColor: "#FFC800",
      cornerStrokeColor: "#111111",
      transparentCorners: false,
      cornerSize: 8,
    });
    (img as any).objectType = "image";
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
    return img;
  } catch (err) {
    console.error("Could not load image into canvas:", err);
    return null;
  }
}

/** Add a rectangle (shape, highlight, or redact). */
export function addRect(
  canvas: Canvas,
  x: number,
  y: number,
  mode: "rect" | "highlight" | "redact" = "rect",
  fill = "#FF0000",
  stroke = "#CC0000"
) {
  const presets = {
    rect: { fill, stroke, opacity: 1, strokeWidth: 2 },
    highlight: { fill: "#FFE066", stroke: "transparent", opacity: 0.45, strokeWidth: 0 },
    redact: { fill: "#FFFFFF", stroke: "#000000", opacity: 1, strokeWidth: 1 },
  };
  const preset = presets[mode];
  const rect = new Rect({
    left: x,
    top: y,
    width: 160,
    height: 60,
    fill: preset.fill,
    stroke: preset.stroke,
    opacity: preset.opacity,
    strokeWidth: preset.strokeWidth,
    borderColor: "#FFC800",
    cornerColor: "#FFC800",
    cornerStrokeColor: "#111111",
    transparentCorners: false,
    cornerSize: 8,
  });
  (rect as any).objectType = mode;
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
  return rect;
}

/** Add a circle. */
export function addCircle(canvas: Canvas, x: number, y: number, fill = "#3B82F6", stroke = "#1D4ED8") {
  const circle = new Circle({
    left: x,
    top: y,
    radius: 50,
    fill,
    stroke,
    strokeWidth: 2,
    borderColor: "#FFC800",
    cornerColor: "#FFC800",
    cornerStrokeColor: "#111111",
    transparentCorners: false,
    cornerSize: 8,
  });
  (circle as any).objectType = "circle";
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
  return circle;
}

/** Add a line. */
export function addLine(canvas: Canvas, x: number, y: number, stroke = "#111111") {
  const line = new Line([x, y, x + 160, y], {
    stroke,
    strokeWidth: 2.5,
    selectable: true,
    borderColor: "#FFC800",
    cornerColor: "#FFC800",
    cornerStrokeColor: "#111111",
    transparentCorners: false,
    cornerSize: 8,
  });
  (line as any).objectType = "line";
  canvas.add(line);
  canvas.setActiveObject(line);
  canvas.requestRenderAll();
  return line;
}

/** Delete the currently selected object. */
export function deleteSelected(canvas: Canvas) {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}
