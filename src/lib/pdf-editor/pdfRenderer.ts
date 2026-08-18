import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Configure local Vite-bundled PDF.js worker
try {
  if (pdfjsWorker) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }
} catch {
  // Worker fallback
}

/**
 * Renders a single PDF page to a high-quality data URL string without cropping.
 * @param file  - The PDF File object
 * @param pageNumber - 1-based page number
 * @param scale - Render scale (1.5 = 150% quality)
 */
export async function renderPageToDataUrl(
  file: File,
  pageNumber: number,
  scale = 1.5
): Promise<{ dataUrl: string; width: number; height: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
    stopAtErrors: false,
  });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);

  const viewport = page.getViewport({ scale });
  const width = Math.ceil(viewport.width);
  const height = Math.ceil(viewport.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    await (page.render({ canvasContext: ctx, viewport } as any).promise);
  }

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width,
    height,
  };
}

export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
    stopAtErrors: false,
  });
  const pdf = await loadingTask.promise;
  return pdf.numPages;
}
