import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

try {
  if (pdfjsWorker) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }
} catch {}

export interface DetectedTextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
}

interface RawTextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[]; // [scaleX, skewY, skewX, scaleY, transX, transY]
  fontName: string;
}

/**
 * Detects all text content on a PDF page and groups them into coherent text lines with exact canvas coordinates.
 * @param file - The PDF File object
 * @param pageNumber - 1-based page index
 * @param scale - Render scale matching the Fabric canvas (e.g. 1.5)
 */
export async function detectPageText(
  file: File,
  pageNumber: number,
  scale = 1.5
): Promise<DetectedTextBlock[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
    stopAtErrors: false,
  });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);

  const viewport = page.getViewport({ scale });
  const textContent = await page.getTextContent({ includeMarkedContent: true });

  const rawItems: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
  }[] = [];

  for (const item of textContent.items as any[]) {
    if (!item.str || !item.str.trim()) continue;

    // Transform coordinate matrix from PDF space to Canvas Viewport space
    // PDF item.transform = [scaleX, 0, 0, scaleY, tx, ty]
    const transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
    const x = transform[4];
    const y = transform[5] - (item.height * scale || Math.abs(transform[3]));
    const fontSize = Math.max(10, Math.round(Math.abs(transform[3])));
    const width = Math.max(12, item.width * scale);
    const height = Math.max(fontSize, item.height * scale || fontSize * 1.15);

    rawItems.push({
      text: item.str,
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      fontSize,
      fontFamily: item.fontName || "Helvetica",
    });
  }

  // Sort top-to-bottom, left-to-right
  rawItems.sort((a, b) => {
    const yDiff = a.y - b.y;
    if (Math.abs(yDiff) > 8) return yDiff;
    return a.x - b.x;
  });

  // Group adjacent items on roughly the same line into coherent lines
  const lines: DetectedTextBlock[] = [];
  let currentGroup: (typeof rawItems)[0][] = [];

  const flushGroup = () => {
    if (currentGroup.length === 0) return;

    const minX = Math.min(...currentGroup.map((g) => g.x));
    const minY = Math.min(...currentGroup.map((g) => g.y));
    const maxX = Math.max(...currentGroup.map((g) => g.x + g.width));
    const maxY = Math.max(...currentGroup.map((g) => g.y + g.height));
    const combinedText = currentGroup.map((g) => g.text).join(" ").trim();
    const avgFontSize = Math.round(
      currentGroup.reduce((sum, g) => sum + g.fontSize, 0) / currentGroup.length
    );

    if (combinedText) {
      lines.push({
        id: `block-${lines.length}-${Date.now()}`,
        text: combinedText,
        x: Math.max(0, minX - 2),
        y: Math.max(0, minY - 1),
        width: Math.max(20, maxX - minX + 4),
        height: Math.max(14, maxY - minY + 2),
        fontSize: avgFontSize,
        fontFamily: currentGroup[0].fontFamily,
      });
    }
    currentGroup = [];
  };

  for (const item of rawItems) {
    if (currentGroup.length === 0) {
      currentGroup.push(item);
      continue;
    }

    const prev = currentGroup[currentGroup.length - 1];
    const isSameLine = Math.abs(item.y - prev.y) <= Math.max(6, prev.fontSize * 0.45);
    const isAdjacent = item.x - (prev.x + prev.width) <= Math.max(35, prev.fontSize * 2.5);

    if (isSameLine && isAdjacent) {
      currentGroup.push(item);
    } else {
      flushGroup();
      currentGroup.push(item);
    }
  }
  flushGroup();

  return lines;
}
