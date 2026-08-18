import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

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
  x1?: number; y1?: number; x2?: number; y2?: number;
  stroke?: string;
  strokeWidth?: number;
  objects?: FabricObject[];
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = (hex || "#000000").replace("#", "");
  const bigint = parseInt(clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean, 16);
  return [(bigint >> 16 & 255) / 255, (bigint >> 8 & 255) / 255, (bigint & 255) / 255];
}

/**
 * Export the edited PDF.
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
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 0; i < pageStates.length; i++) {
    const state = pageStates[i];
    if (!state || i >= pages.length) continue;

    const page = pages[i];
    const { width: pageW, height: pageH } = page.getSize();
    const scaleX = pageW / canvasWidth;
    const scaleY = pageH / canvasHeight;

    const stateObj = state as { objects?: FabricObject[] };
    const objects: FabricObject[] = stateObj.objects || [];

    for (const obj of objects) {
      const alpha = obj.opacity ?? 1;
      // Fabric Y=0 is top; PDF Y=0 is bottom — flip Y axis
      const pdfX = (obj.left ?? 0) * scaleX;
      const pdfY = pageH - ((obj.top ?? 0) * scaleY);

      if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text") {
        const text = (obj.text || "").replace(/\r/g, "");
        const fontSize = (obj.fontSize ?? 16) * scaleY;
        const [r, g, b] = hexToRgb(typeof obj.fill === "string" ? obj.fill : "#000000");
        const lines = text.split("\n");
        for (let li = 0; li < lines.length; li++) {
          const lineText = lines[li];
          if (!lineText) continue;
          try {
            page.drawText(lineText, {
              x: pdfX,
              y: pdfY - li * fontSize * 1.2,
              size: fontSize,
              font: helvetica,
              color: rgb(r, g, b),
              opacity: alpha,
            });
          } catch {}
        }
      } else if (obj.type === "rect") {
        const w = (obj.width ?? 100) * (obj.scaleX ?? 1) * scaleX;
        const h = (obj.height ?? 60) * (obj.scaleY ?? 1) * scaleY;
        const [r, g, b] = hexToRgb(typeof obj.fill === "string" ? obj.fill : "#ff0000");
        page.drawRectangle({
          x: pdfX,
          y: pdfY - h,
          width: w,
          height: h,
          color: rgb(r, g, b),
          opacity: alpha,
        });
      } else if (obj.type === "circle") {
        const rad = (obj.radius ?? 50) * (obj.scaleX ?? 1) * scaleX;
        const [r, g, b] = hexToRgb(typeof obj.fill === "string" ? obj.fill : "#3b82f6");
        page.drawEllipse({
          x: pdfX + rad,
          y: pdfY - rad,
          xScale: rad,
          yScale: rad,
          color: rgb(r, g, b),
          opacity: alpha,
        });
      } else if (obj.type === "image") {
        try {
          const src: string = (obj as any).src || "";
          if (!src) continue;
          const res = await fetch(src);
          const imgBytes = await res.arrayBuffer();
          let embeddedImg;
          if (src.includes("image/png") || src.startsWith("data:image/png")) {
            embeddedImg = await pdfDoc.embedPng(imgBytes);
          } else {
            embeddedImg = await pdfDoc.embedJpg(imgBytes);
          }
          const w = (obj.width ?? 100) * (obj.scaleX ?? 1) * scaleX;
          const h = (obj.height ?? 100) * (obj.scaleY ?? 1) * scaleY;
          page.drawImage(embeddedImg, {
            x: pdfX,
            y: pdfY - h,
            width: w,
            height: h,
            opacity: alpha,
          });
        } catch {}
      }
    }
  }

  return pdfDoc.save();
}
