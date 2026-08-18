import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { PDFDocument } from "pdf-lib";

export type CodeType = "qr" | "barcode";

export type QrPresetType = "url" | "upi" | "text" | "invoice" | "phone" | "wifi";

export type BarcodeFormat = "CODE128" | "EAN13" | "UPC" | "CODE39" | "ITF14" | "MSI";

export interface QrOptions {
  content: string;
  preset: QrPresetType;
  upiId?: string;
  upiName?: string;
  upiAmount?: string;
  upiNote?: string;
  fgColor: string;
  bgColor: string;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  margin: number;
}

export interface BarcodeOptions {
  content: string;
  format: BarcodeFormat;
  fgColor: string;
  bgColor: string;
  showText: boolean;
  text?: string;
  fontSize: number;
  height: number;
  width: number;
  margin: number;
}

export interface StampPosition {
  preset: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center" | "custom";
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  widthPt: number; // in PDF points (72 pt = 1 inch)
  heightPt: number;
  pageTarget: "first" | "last" | "all" | "custom";
  customPages?: string; // e.g. "1, 3-5"
}

/**
 * Builds standard UPI Payment Link URI.
 */
export function buildUpiUri(upiId: string, name = "", amount = "", note = ""): string {
  const cleanId = upiId.trim();
  if (!cleanId) return "";
  const params = new URLSearchParams();
  params.set("pa", cleanId);
  if (name.trim()) params.set("pn", name.trim());
  if (amount.trim()) params.set("am", amount.trim());
  if (note.trim()) params.set("tn", note.trim());
  params.set("cu", "INR");
  return `upi://pay?${params.toString()}`;
}

/**
 * Generate a high-resolution QR code data URL.
 */
export async function generateQrDataUrl(options: QrOptions): Promise<string> {
  let textToEncode = options.content;
  if (options.preset === "upi") {
    textToEncode = buildUpiUri(
      options.upiId || "",
      options.upiName || "",
      options.upiAmount || "",
      options.upiNote || ""
    ) || options.content || "upi://pay?pa=example@upi";
  }

  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, textToEncode || "Doclly Invoice", {
    width: 600,
    margin: options.margin ?? 2,
    color: {
      dark: options.fgColor || "#000000",
      light: options.bgColor === "transparent" ? "#00000000" : options.bgColor || "#FFFFFF",
    },
    errorCorrectionLevel: options.errorCorrectionLevel || "M",
  });

  return canvas.toDataURL("image/png");
}

/**
 * Generate a high-resolution Barcode data URL.
 */
export function generateBarcodeDataUrl(options: BarcodeOptions): string {
  const canvas = document.createElement("canvas");
  try {
    JsBarcode(canvas, options.content || "INV-2026-001", {
      format: options.format || "CODE128",
      lineColor: options.fgColor || "#000000",
      background: options.bgColor === "transparent" ? undefined : options.bgColor || "#FFFFFF",
      displayValue: options.showText,
      text: options.text || undefined,
      fontSize: options.fontSize || 16,
      height: options.height || 70,
      width: options.width || 2.5,
      margin: options.margin ?? 10,
    });
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.warn("Barcode generation fallback:", err);
    // Fallback to CODE128 if format-specific validation fails
    JsBarcode(canvas, options.content || "12345678", {
      format: "CODE128",
      lineColor: options.fgColor || "#000000",
      displayValue: true,
      height: 60,
      width: 2,
    });
    return canvas.toDataURL("image/png");
  }
}

/**
 * Convert data URL to PNG Uint8Array.
 */
async function dataUrlToBytes(dataUrl: string): Promise<Uint8Array> {
  const res = await fetch(dataUrl);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

/**
 * Parses custom page string (e.g. "1, 3-5") into 0-indexed page numbers.
 */
export function parsePageTarget(target: string, totalPages: number): number[] {
  const clean = target.trim();
  if (!clean) return [0];

  const result = new Set<number>();
  const parts = clean.split(",");

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let p = start; p <= end; p++) {
          result.add(p - 1);
        }
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        result.add(num - 1);
      }
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

/**
 * Stamp a generated QR Code or Barcode directly onto a PDF file.
 */
export async function stampCodeOnPdf(
  pdfFile: File,
  stampDataUrl: string,
  pos: StampPosition
): Promise<Uint8Array> {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  if (totalPages === 0) {
    throw new Error("The PDF document contains no pages.");
  }

  const pngBytes = await dataUrlToBytes(stampDataUrl);
  const embeddedImg = await pdfDoc.embedPng(pngBytes);

  // Determine target pages
  let targetIndices: number[] = [];
  switch (pos.pageTarget) {
    case "first":
      targetIndices = [0];
      break;
    case "last":
      targetIndices = [totalPages - 1];
      break;
    case "all":
      targetIndices = pages.map((_, i) => i);
      break;
    case "custom":
      targetIndices = parsePageTarget(pos.customPages || "1", totalPages);
      break;
  }

  for (const pageIdx of targetIndices) {
    if (pageIdx < 0 || pageIdx >= totalPages) continue;
    const page = pages[pageIdx];
    const { width: pageW, height: pageH } = page.getSize();

    const stampW = Math.min(pageW - 20, Math.max(20, pos.widthPt));
    const stampH = Math.min(pageH - 20, Math.max(20, pos.heightPt));

    let x = (pos.xPercent / 100) * (pageW - stampW);
    // In PDF coordinates, Y=0 is bottom:
    let y = pageH - ((pos.yPercent / 100) * (pageH - stampH)) - stampH;

    // Apply preset overrides if not custom
    const margin = 24; // 24 points = 0.33 inch margin from edges
    if (pos.preset === "top-right") {
      x = pageW - stampW - margin;
      y = pageH - stampH - margin;
    } else if (pos.preset === "top-left") {
      x = margin;
      y = pageH - stampH - margin;
    } else if (pos.preset === "bottom-right") {
      x = pageW - stampW - margin;
      y = margin;
    } else if (pos.preset === "bottom-left") {
      x = margin;
      y = margin;
    } else if (pos.preset === "center") {
      x = (pageW - stampW) / 2;
      y = (pageH - stampH) / 2;
    }

    page.drawImage(embeddedImg, {
      x: Math.max(0, Math.min(pageW - stampW, x)),
      y: Math.max(0, Math.min(pageH - stampH, y)),
      width: stampW,
      height: stampH,
    });
  }

  return pdfDoc.save();
}
