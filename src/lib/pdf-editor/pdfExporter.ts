import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface FabricObject {
  type: string;
  objectType?: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  fill?: string;
  opacity?: number;
  scaleX?: number;
  scaleY?: number;
  radius?: number;
  src?: string;
  angle?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  stroke?: string;
  strokeWidth?: number;
  objects?: FabricObject[];
}

function hexToRgb(hex: string): [number, number, number] {
  if (!hex || typeof hex !== "string") return [0, 0, 0];
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
  }
  return [0, 0, 0];
}

/**
 * Convert any image source (data URL, blob URL, web URL) to clean PNG bytes for pdf-lib.
 */
async function imageSourceToPngBytes(src: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth || img.width || 200;
      const h = img.naturalHeight || img.height || 200;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not create canvas context for image"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to convert image to PNG blob"));
          return;
        }
        blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
      }, "image/png");
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Export the edited PDF with burned-in annotations, text, images, and shapes.
 * @param originalFile - The original PDF File
 * @param pageStates   - Array of Fabric JSON per page (index 0 = page 1). Null means no edits.
 * @param canvasWidth  - Width of the Fabric canvas in pixels
 * @param canvasHeight - Height of the Fabric canvas in pixels
 */
export async function exportToPdf(
  originalFile: File,
  pageStates: (object | null)[],
  canvasWidth: number,
  canvasHeight: number
): Promise<Uint8Array> {
  const arrayBuffer = await originalFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 0; i < pageStates.length; i++) {
    const state = pageStates[i];
    if (!state || i >= pages.length) continue;

    const page = pages[i];
    const { width: pageW, height: pageH } = page.getSize();
    const scaleX = pageW / (canvasWidth || pageW);
    const scaleY = pageH / (canvasHeight || pageH);

    const stateObj = state as { objects?: FabricObject[] };
    const objects: FabricObject[] = stateObj.objects || [];

    for (const obj of objects) {
      const type = (obj.type || "").toLowerCase();
      const alpha = typeof obj.opacity === "number" ? Math.max(0, Math.min(1, obj.opacity)) : 1;

      // Coordinate mapping: Fabric (0,0) is top-left, PDF (0,0) is bottom-left
      const pdfX = (obj.left ?? 0) * scaleX;
      const pdfY = pageH - ((obj.top ?? 0) * scaleY);

      if (type === "textbox" || type === "i-text" || type === "text") {
        const text = (obj.text || "").replace(/\r/g, "");
        if (!text) continue;

        const fontSize = Math.max(6, (obj.fontSize ?? 18) * scaleY);
        const [r, g, b] = hexToRgb(typeof obj.fill === "string" ? obj.fill : "#111111");
        const lines = text.split("\n");

        for (let li = 0; li < lines.length; li++) {
          const lineText = lines[li];
          if (!lineText) continue;
          try {
            page.drawText(lineText, {
              x: pdfX,
              y: pdfY - (fontSize * 0.82) - (li * fontSize * 1.16),
              size: fontSize,
              font: helvetica,
              color: rgb(r, g, b),
              opacity: alpha,
            });
          } catch (err) {
            console.warn("Could not draw text line on PDF:", err);
          }
        }
      } else if (type === "rect") {
        const w = Math.max(1, (obj.width ?? 100) * (obj.scaleX ?? 1) * scaleX);
        const h = Math.max(1, (obj.height ?? 60) * (obj.scaleY ?? 1) * scaleY);
        const [r, g, b] = hexToRgb(typeof obj.fill === "string" ? obj.fill : "#FF0000");

        page.drawRectangle({
          x: pdfX,
          y: pdfY - h,
          width: w,
          height: h,
          color: rgb(r, g, b),
          opacity: alpha,
        });
      } else if (type === "circle") {
        const rad = Math.max(1, (obj.radius ?? 50) * (obj.scaleX ?? 1) * scaleX);
        const [r, g, b] = hexToRgb(typeof obj.fill === "string" ? obj.fill : "#3B82F6");

        page.drawEllipse({
          x: pdfX + rad,
          y: pdfY - rad,
          xScale: rad,
          yScale: rad,
          color: rgb(r, g, b),
          opacity: alpha,
        });
      } else if (type === "line") {
        const [r, g, b] = hexToRgb(typeof obj.stroke === "string" ? obj.stroke : "#111111");
        const lineW = Math.max(1, (obj.width ?? 160) * (obj.scaleX ?? 1) * scaleX);
        const thickness = Math.max(1, (obj.strokeWidth ?? 2) * scaleY);

        page.drawLine({
          start: { x: pdfX, y: pdfY },
          end: { x: pdfX + lineW, y: pdfY },
          thickness,
          color: rgb(r, g, b),
          opacity: alpha,
        });
      } else if (type === "image") {
        try {
          const src: string = (obj as any).src || (obj as any)._element?.src || "";
          if (!src) continue;

          const pngBytes = await imageSourceToPngBytes(src);
          const embeddedImg = await pdfDoc.embedPng(pngBytes);
          const w = Math.max(1, (obj.width ?? 100) * (obj.scaleX ?? 1) * scaleX);
          const h = Math.max(1, (obj.height ?? 100) * (obj.scaleY ?? 1) * scaleY);

          page.drawImage(embeddedImg, {
            x: pdfX,
            y: pdfY - h,
            width: w,
            height: h,
            opacity: alpha,
          });
        } catch (imgErr) {
          console.warn("Could not embed image object into PDF:", imgErr);
        }
      }
    }
  }

  return pdfDoc.save();
}
