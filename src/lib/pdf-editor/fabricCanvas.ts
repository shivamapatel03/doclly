import { Canvas, FabricImage, FabricText, Rect, Circle, Line, Textbox } from "fabric";

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
  });

  // Set background image (the rendered PDF page)
  FabricImage.fromURL(bgDataUrl).then((img) => {
    img.set({ selectable: false, evented: false, left: 0, top: 0 });
    img.scaleToWidth(width);
    img.scaleToHeight(height);
    canvas.backgroundImage = img;
    canvas.renderAll();
  });

  return canvas;
}

/**
 * Update the background image of an existing canvas (when changing pages or zoom).
 */
export function setCanvasBackground(canvas: Canvas, bgDataUrl: string, width: number, height: number) {
  canvas.setWidth(width);
  canvas.setHeight(height);
  FabricImage.fromURL(bgDataUrl).then((img) => {
    img.set({ selectable: false, evented: false, left: 0, top: 0 });
    img.scaleToWidth(width);
    img.scaleToHeight(height);
    canvas.backgroundImage = img;
    canvas.renderAll();
  });
}

/** Serialize canvas objects (excluding background) to JSON. */
export function serializeCanvas(canvas: Canvas): object {
  return canvas.toJSON(["selectable", "evented", "objectType"]);
}

/** Load previously serialized state onto the canvas. */
export async function loadCanvasState(canvas: Canvas, state: object): Promise<void> {
  return new Promise((resolve) => {
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      resolve();
    });
  });
}

/** Add a text box at the given position. */
export function addText(
  canvas: Canvas,
  x: number,
  y: number,
  options?: { fontSize?: number; fill?: string; fontFamily?: string }
) {
  const text = new Textbox("Type here...", {
    left: x,
    top: y,
    fontSize: options?.fontSize ?? 18,
    fill: options?.fill ?? "#111111",
    fontFamily: options?.fontFamily ?? "Helvetica",
    width: 200,
    editable: true,
    borderColor: "#FFC800",
    cornerColor: "#FFC800",
  });
  (text as any).objectType = "text";
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
  return text;
}

/** Add an image from a data URL. */
export async function addImageFromDataUrl(canvas: Canvas, dataUrl: string, x = 50, y = 50) {
  const img = await FabricImage.fromURL(dataUrl);
  img.set({ left: x, top: y, scaleX: 0.5, scaleY: 0.5 });
  (img as any).objectType = "image";
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.renderAll();
  return img;
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
    rect: { fill, stroke, opacity: 1 },
    highlight: { fill: "#FFE066", stroke: "transparent", opacity: 0.4 },
    redact: { fill: "#ffffff", stroke: "#000000", opacity: 1 },
  };
  const preset = presets[mode];
  const rect = new Rect({
    left: x,
    top: y,
    width: 150,
    height: 60,
    fill: preset.fill,
    stroke: preset.stroke,
    opacity: preset.opacity,
    strokeWidth: mode === "redact" ? 1 : 0,
    borderColor: "#FFC800",
    cornerColor: "#FFC800",
  });
  (rect as any).objectType = mode;
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.renderAll();
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
  });
  (circle as any).objectType = "circle";
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.renderAll();
  return circle;
}

/** Add a line. */
export function addLine(canvas: Canvas, x: number, y: number, stroke = "#111111") {
  const line = new Line([x, y, x + 150, y], {
    stroke,
    strokeWidth: 2,
    selectable: true,
    borderColor: "#FFC800",
    cornerColor: "#FFC800",
  });
  (line as any).objectType = "line";
  canvas.add(line);
  canvas.setActiveObject(line);
  canvas.renderAll();
  return line;
}

/** Delete the currently selected object. */
export function deleteSelected(canvas: Canvas) {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
  }
}
