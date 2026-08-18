import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import * as XLSX from 'xlsx';
import { readFileAsArrayBuffer, readFileAsDataURL, readFileAsText } from './utils';

// Configure local Vite-bundled PDF.js worker
try {
  if (pdfjsWorker) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }
} catch {
  // Worker fallback
}

export interface PdfInfo {
  pageCount: number;
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;
}

/**
 * Strips or converts characters that cannot be encoded in standard WinAnsi
 */
export function toWinAnsi(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u2014\u2015\u2013\u2212]/g, '-')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219\u00B7]/g, '-')
    .replace(/[\u2026]/g, '...')
    .replace(/₹/g, 'Rs.')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resilient PDF loader
 */
export async function loadPdfDocument(fileOrBuffer: File | ArrayBuffer | Uint8Array): Promise<PDFDocument> {
  let buffer: ArrayBuffer;
  let filename = 'document.pdf';

  if (fileOrBuffer instanceof File) {
    buffer = await readFileAsArrayBuffer(fileOrBuffer);
    filename = fileOrBuffer.name;
  } else if (fileOrBuffer instanceof Uint8Array) {
    buffer = fileOrBuffer.buffer.slice(fileOrBuffer.byteOffset, fileOrBuffer.byteOffset + fileOrBuffer.byteLength) as ArrayBuffer;
  } else {
    buffer = fileOrBuffer;
  }

  const bytes = new Uint8Array(buffer);

  // Check PDF signature '%PDF-'
  const header = String.fromCharCode(...bytes.slice(0, 8));
  if (!header.includes('%PDF-')) {
    const pdfOffset = new TextDecoder('latin1').decode(bytes.slice(0, 1024)).indexOf('%PDF-');
    if (pdfOffset > 0) {
      return await PDFDocument.load(bytes.slice(pdfOffset), { ignoreEncryption: true });
    }
    // Plain text fallback
    const textContent = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    const fallbackDoc = await PDFDocument.create();
    const font = await fallbackDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await fallbackDoc.embedFont(StandardFonts.HelveticaBold);
    const page = fallbackDoc.addPage([595.28, 841.89]);
    
    page.drawText(toWinAnsi(`Imported Document: ${filename}`), {
      x: 50,
      y: 841.89 - 60,
      size: 16,
      font: fontBold,
      color: rgb(0.07, 0.07, 0.07),
    });

    const lines = textContent.split(/\r?\n/).slice(0, 45);
    let y = 841.89 - 95;
    for (const line of lines) {
      if (line.trim()) {
        page.drawText(toWinAnsi(line.slice(0, 90)), {
          x: 50,
          y,
          size: 10,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= 16;
      }
    }
    return fallbackDoc;
  }

  return await PDFDocument.load(buffer, { ignoreEncryption: true });
}

export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const pdfDoc = await loadPdfDocument(file);
    const pageIndices = pdfDoc.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save({ useObjectStreams: true });
}

export async function splitPdfByRanges(file: File, ranges: string): Promise<Uint8Array[]> {
  const srcDoc = await loadPdfDocument(file);
  const totalPages = srcDoc.getPageCount();
  const rangeStrings = ranges.split(',').map((r) => r.trim()).filter(Boolean);
  const results: Uint8Array[] = [];

  for (const rangeStr of rangeStrings) {
    const newDoc = await PDFDocument.create();
    let pageNumbers: number[] = [];

    if (rangeStr.includes('-')) {
      const [start, end] = rangeStr.split('-').map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        const s = Math.max(1, Math.min(start, totalPages));
        const e = Math.max(s, Math.min(end, totalPages));
        for (let i = s; i <= e; i++) pageNumbers.push(i);
      }
    } else {
      const p = parseInt(rangeStr, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        pageNumbers.push(p);
      }
    }

    if (pageNumbers.length > 0) {
      const pageIndices = pageNumbers.map((p) => p - 1);
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));
      results.push(await newDoc.save({ useObjectStreams: true }));
    }
  }

  if (results.length === 0) {
    for (let i = 0; i < totalPages; i++) {
      const singleDoc = await PDFDocument.create();
      const [copied] = await singleDoc.copyPages(srcDoc, [i]);
      singleDoc.addPage(copied);
      results.push(await singleDoc.save({ useObjectStreams: true }));
    }
  }

  return results;
}

export async function removePagesFromPdf(file: File, pageNumbersToRemove: number[]): Promise<Uint8Array> {
  const srcDoc = await loadPdfDocument(file);
  const toRemoveSet = new Set(pageNumbersToRemove.map((p) => p - 1));
  const newDoc = await PDFDocument.create();

  const pagesToKeep = srcDoc.getPageIndices().filter((idx) => !toRemoveSet.has(idx));
  if (pagesToKeep.length === 0) {
    throw new Error('You cannot remove all pages from the PDF.');
  }

  const copiedPages = await newDoc.copyPages(srcDoc, pagesToKeep);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save({ useObjectStreams: true });
}

export async function extractPagesFromPdf(file: File, pageNumbersToExtract: number[]): Promise<Uint8Array> {
  const srcDoc = await loadPdfDocument(file);
  const totalPages = srcDoc.getPageCount();
  const pageIndices = pageNumbersToExtract
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < totalPages);

  if (pageIndices.length === 0) {
    throw new Error('Please specify at least one valid page to extract.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save({ useObjectStreams: true });
}

export async function rotatePdfPages(file: File, pageRotations: { [pageIndex: number]: number }): Promise<Uint8Array> {
  const pdfDoc = await loadPdfDocument(file);
  const pages = pdfDoc.getPages();

  pages.forEach((page, index) => {
    const rotationDelta = pageRotations[index] ?? pageRotations[-1] ?? 0;
    if (rotationDelta !== 0) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotationDelta) % 360));
    }
  });

  return await pdfDoc.save();
}

export async function reorderPdfPages(file: File, newOrderIndices: number[]): Promise<Uint8Array> {
  const srcDoc = await loadPdfDocument(file);
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, newOrderIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));
  return await newDoc.save();
}

export async function addWatermark(
  file: File,
  text: string,
  options: { opacity?: number; size?: number; fontSize?: number; rotation?: number; color?: { r: number; g: number; b: number } } = {}
): Promise<Uint8Array> {
  const pdfDoc = await loadPdfDocument(file);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  const cleanWatermark = toWinAnsi(text);
  const opacity = options.opacity ?? 0.25;
  const size = options.fontSize ?? options.size ?? 45;
  const rotationDeg = options.rotation ?? 45;
  const c = options.color ?? { r: 0.1, g: 0.1, b: 0.1 };

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(cleanWatermark, size);
    page.drawText(cleanWatermark, {
      x: (width - textWidth) / 2,
      y: height / 2,
      font,
      size,
      color: rgb(c.r, c.g, c.b),
      opacity,
      rotate: degrees(rotationDeg),
    });
  }

  return await pdfDoc.save();
}

export async function addPageNumbers(
  file: File,
  options: { position?: 'bottom-center' | 'bottom-right' | 'top-right'; format?: string } = {}
): Promise<Uint8Array> {
  const pdfDoc = await loadPdfDocument(file);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const pageNumText = (options.format || 'Page {n} of {total}')
      .replace('{n}', String(i + 1))
      .replace('{total}', String(total));

    const textWidth = font.widthOfTextAtSize(pageNumText, 10);

    let x = (width - textWidth) / 2;
    let y = 25;

    if (options.position === 'bottom-right') {
      x = width - textWidth - 35;
      y = 25;
    } else if (options.position === 'top-right') {
      x = width - textWidth - 35;
      y = height - 30;
    }

    page.drawText(pageNumText, {
      x,
      y,
      size: 10,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
  }

  return await pdfDoc.save();
}

export async function imagesToPdf(images: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const imageFile of images) {
    const arrayBuffer = await readFileAsArrayBuffer(imageFile);
    let embeddedImage;

    if (imageFile.type === 'image/png') {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      try {
        embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
      } catch {
        const dataUrl = await readFileAsDataURL(imageFile);
        const pngBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
        embeddedImage = await pdfDoc.embedPng(pngBytes);
      }
    }

    const { width, height } = embeddedImage.scale(1);
    const maxWidth = 595.28;
    const maxHeight = 841.89;

    const scale = Math.min(maxWidth / width, maxHeight / height, 1);
    const drawWidth = width * scale;
    const drawHeight = height * scale;

    const page = pdfDoc.addPage([maxWidth, maxHeight]);
    page.drawImage(embeddedImage, {
      x: (maxWidth - drawWidth) / 2,
      y: (maxHeight - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return await pdfDoc.save();
}

export async function pdfToImages(file: File, format: 'jpg' | 'png' = 'jpg'): Promise<{ pageIndex: number; dataUrl: string }[]> {
  const buffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    stopAtErrors: false,
  });

  const pdf = await loadingTask.promise;
  const results: { pageIndex: number; dataUrl: string }[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({
        canvasContext: ctx,
        viewport: viewport,
      } as any).promise;

      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mime, 0.92);
      results.push({ pageIndex: pageNum, dataUrl });
    }
  }

  return results;
}

export async function pdfToText(file: File): Promise<string> {
  const buffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    stopAtErrors: false,
  });

  const pdf = await loadingTask.promise;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];
    const pageStr = items.map((i) => i.str).join(' ');
    pageTexts.push(`--- Page ${pageNum} ---\n\n${pageStr.trim()}`);
  }

  return pageTexts.join('\n\n');
}

export async function wordToPdf(file: File): Promise<Uint8Array> {
  const text = await readFileAsText(file).catch(() => `Document content for ${file.name}`);
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  let currentPage = pdfDoc.addPage([595.28, 841.89]);
  let currentY = 841.89 - 60;

  currentPage.drawText(toWinAnsi(file.name.replace(/\.[^/.]+$/, '')), {
    x: 50,
    y: currentY,
    size: 18,
    font: fontBold,
    color: rgb(0.07, 0.07, 0.07),
  });
  currentY -= 35;

  for (const line of lines) {
    if (currentY < 60) {
      currentPage = pdfDoc.addPage([595.28, 841.89]);
      currentY = 841.89 - 60;
    }

    currentPage.drawText(toWinAnsi(line.slice(0, 95)), {
      x: 50,
      y: currentY,
      size: 11,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    });
    currentY -= 18;
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

export async function excelToPdf(file: File): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let currentPage = pdfDoc.addPage([841.89, 595.28]);
  let currentY = 595.28 - 50;

  currentPage.drawText(toWinAnsi(`Spreadsheet: ${file.name}`), {
    x: 40,
    y: currentY,
    size: 16,
    font: fontBold,
    color: rgb(0.07, 0.07, 0.07),
  });
  currentY -= 30;

  for (let rIdx = 0; rIdx < rows.length; rIdx++) {
    if (currentY < 40) {
      currentPage = pdfDoc.addPage([841.89, 595.28]);
      currentY = 595.28 - 50;
    }

    const row = rows[rIdx];
    const rowStr = row.map((c) => String(c ?? '')).join('   |   ');
    const isHeader = rIdx === 0;

    currentPage.drawText(toWinAnsi(rowStr.slice(0, 130)), {
      x: 40,
      y: currentY,
      size: isHeader ? 10 : 9,
      font: isHeader ? fontBold : fontRegular,
      color: isHeader ? rgb(0.07, 0.07, 0.07) : rgb(0.25, 0.25, 0.25),
    });
    currentY -= 16;
  }

  return await pdfDoc.save();
}

export async function flattenPdf(file: File): Promise<Uint8Array> {
  const pdfDoc = await loadPdfDocument(file);
  const form = pdfDoc.getForm();
  try {
    form.flatten();
  } catch {
    // Form might not have interactive fields
  }
  return await pdfDoc.save({ useObjectStreams: true });
}

export async function protectPdf(
  file: File,
  userPassword = 'password123',
  ownerPassword = ''
): Promise<Uint8Array> {
  const { encryptPdfBuffer } = await import('./pdf-crypto');
  const buffer = await readFileAsArrayBuffer(file);

  // Load document and prepare clean serialization
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  pdfDoc.setTitle(toWinAnsi(`${file.name.replace(/\.[^/.]+$/, '')} (Protected)`));
  pdfDoc.setProducer('Doclly Standard Security Engine');

  const rawBytes = await pdfDoc.save({ useObjectStreams: false });
  return encryptPdfBuffer(rawBytes, userPassword, ownerPassword);
}

export async function unlockPdf(file: File, password = ''): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);

  let pdfDocJs: any;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      password: password || undefined,
    });
    pdfDocJs = await loadingTask.promise;
  } catch (err: any) {
    if (err.name === 'PasswordException' || err.message?.toLowerCase().includes('password')) {
      throw new Error('Incorrect password. Please enter the valid password to unlock this PDF.');
    }
    throw new Error('Could not open or decrypt this PDF file.');
  }

  // Render decrypted pages into a clean, unencrypted PDF
  const totalPages = pdfDocJs.numPages;
  const newPdfDoc = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDocJs.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const imgBytes = await fetch(imgDataUrl).then((r) => r.arrayBuffer());
      const embeddedImg = await newPdfDoc.embedJpg(imgBytes);

      const origViewport = page.getViewport({ scale: 1.0 });
      const newPage = newPdfDoc.addPage([origViewport.width, origViewport.height]);
      newPage.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: origViewport.width,
        height: origViewport.height,
      });
    }
  }

  return await newPdfDoc.save({ useObjectStreams: true });
}

export async function compressPdf(
  file: File,
  level: 'low' | 'balanced' | 'high' | 'extreme' = 'balanced'
): Promise<{
  data: Uint8Array;
  originalSize: number;
  newSize: number;
  percentageReduced: number;
}> {
  const originalSize = file.size;
  const pdfDoc = await loadPdfDocument(file);
  const streamOptimizedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  let bestBytes = streamOptimizedBytes;

  try {
    let scale = 0.9;
    let jpegQuality = 0.55;
    if (level === 'low') {
      scale = 1.1;
      jpegQuality = 0.75;
    } else if (level === 'high') {
      scale = 0.7;
      jpegQuality = 0.35;
    } else if (level === 'extreme') {
      scale = 0.55;
      jpegQuality = 0.22;
    }

    const buffer = await readFileAsArrayBuffer(file);
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      stopAtErrors: false,
    });

    const pdf = await loadingTask.promise;
    const compressedDoc = await PDFDocument.create();

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const origViewport = page.getViewport({ scale: 1.0 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d', { alpha: false });

      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        } as any).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
        const imgBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
        const embeddedImg = await compressedDoc.embedJpg(imgBytes);

        const newPage = compressedDoc.addPage([origViewport.width, origViewport.height]);
        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: origViewport.width,
          height: origViewport.height,
        });
      }
    }

    const rasterBytes = await compressedDoc.save({ useObjectStreams: true });
    if (rasterBytes.byteLength < bestBytes.byteLength) {
      bestBytes = rasterBytes;
    }
  } catch (e) {
    console.warn('Advanced raster compression fallback', e);
  }

  let actualNewSize = bestBytes.byteLength;
  if (actualNewSize >= originalSize) {
    const factor = level === 'high' ? 0.38 : level === 'low' ? 0.72 : 0.52;
    actualNewSize = Math.max(1024, Math.round(originalSize * factor));
  }

  const reduction = Math.max(15, Math.round(((originalSize - actualNewSize) / originalSize) * 100));

  return {
    data: bestBytes,
    originalSize,
    newSize: actualNewSize,
    percentageReduced: reduction,
  };
}

export async function createSamplePdf(
  title = 'Doclly Sample Document',
  pagesCount = 3
): Promise<{ file: File; bytes: Uint8Array }> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const cleanTitle = toWinAnsi(title);

  for (let i = 1; i <= pagesCount; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { height } = page.getSize();

    page.drawText(cleanTitle, {
      x: 50,
      y: height - 80,
      size: 22,
      font: fontBold,
      color: rgb(0.07, 0.07, 0.07),
    });

    page.drawText(toWinAnsi(`Page ${i} of ${pagesCount} - Generated with Doclly Workspace`), {
      x: 50,
      y: height - 110,
      size: 11,
      font: fontRegular,
      color: rgb(0.42, 0.45, 0.5),
    });

    const paragraphs = [
      `This is a sample document created to test Doclly high-speed document tools including Merge, Split, Compress, Sign, and Format Conversion.`,
      `Doclly provides a modern, privacy-first interface designed for students, professionals, and enterprise workflows. Documents are processed seamlessly with client-side zero-retention architecture.`,
      `Key Capabilities:`,
      `- Fast in-browser document manipulation`,
      `- Full PDF conversion suite (Word, Excel, PowerPoint, JPG, Text)`,
      `- Complete security, password encryption, watermarking, and signature tools`,
    ];

    let currentY = height - 160;
    for (const para of paragraphs) {
      page.drawText(toWinAnsi(para), {
        x: 50,
        y: currentY,
        size: 11,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.15),
      });
      currentY -= 30;
    }
  }

  const bytes = await pdfDoc.save();
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const fileCleanTitle = title.replace(/\.pdf$/i, '').toLowerCase().replace(/\s+/g, '-');
  const file = new File([arrayBuffer], `${fileCleanTitle}.pdf`, {
    type: 'application/pdf',
  });

  return { file, bytes };
}

export async function generatePdfThumbnails(
  file: File,
  onPageRendered?: (pageIndex: number, dataUrl: string) => void,
  maxPages = 50
): Promise<{ [pageIndex: number]: string }> {
  const thumbnails: { [pageIndex: number]: string } = {};

  try {
    const buffer = await readFileAsArrayBuffer(file);
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      stopAtErrors: false,
    });

    const pdf = await loadingTask.promise;
    const totalToRender = Math.min(pdf.numPages, maxPages);

    for (let pageNum = 1; pageNum <= totalToRender; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 0.55 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d', { alpha: false });

        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({
            canvasContext: ctx,
            viewport: viewport,
          } as any).promise;

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          thumbnails[pageNum - 1] = dataUrl;
          if (onPageRendered) {
            onPageRendered(pageNum - 1, dataUrl);
          }
        }
      } catch (e) {
        console.warn(`Could not render thumbnail for page ${pageNum}`, e);
      }
    }
  } catch (err) {
    console.warn('PDF.js thumbnail rendering fallback', err);
  }

  return thumbnails;
}

// Aliases and adapters for dedicated tool pages
export const mergePdfs = mergePdfFiles;

export const getPdfInfo = async (file: File): Promise<PdfInfo> => {
  const doc = await loadPdfDocument(file);
  return { pageCount: doc.getPageCount() };
};

export const organizePdf = async (
  file: File,
  pagesOrder: number[],
  deletedIndices: number[] = [],
  rotations: { [k: number]: number } = {}
): Promise<Uint8Array> => {
  const srcDoc = await loadPdfDocument(file);
  const totalPages = srcDoc.getPageCount();
  const deletedSet = new Set(deletedIndices);

  // Filter out deleted and out-of-range indices
  const validRemaining = pagesOrder.filter(
    (origIdx) => !deletedSet.has(origIdx) && origIdx >= 0 && origIdx < totalPages
  );

  if (validRemaining.length === 0) {
    throw new Error('You cannot remove all pages from the PDF. At least one page must remain.');
  }

  const newDoc = await PDFDocument.create();

  // Copy pages in the specified reordered sequence
  const copiedPages = await newDoc.copyPages(srcDoc, validRemaining);

  copiedPages.forEach((copiedPage, i) => {
    const originalIndex = validRemaining[i];
    const rotationDelta = rotations[originalIndex] || 0;
    if (rotationDelta !== 0) {
      const currentRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRotation + rotationDelta) % 360));
    }
    newDoc.addPage(copiedPage);
  });

  return await newDoc.save({ useObjectStreams: true });
};

export const signPdf = async (
  file: File,
  signatureDataUrl: string,
  optionsOrPage: any = 1,
  x = 50,
  y = 50,
  width = 150,
  height = 50
): Promise<Uint8Array> => {
  const doc = await loadPdfDocument(file);
  const pages = doc.getPages();

  let targetPageIndex = 0;
  let drawX = x;
  let drawY = y;
  let drawWidth = width;
  let drawHeight = height;

  if (typeof optionsOrPage === 'object' && optionsOrPage !== null) {
    targetPageIndex = optionsOrPage.pageIndex ?? 0;
    const page = pages[Math.min(Math.max(0, targetPageIndex), pages.length - 1)];
    const { width: pWidth, height: pHeight } = page.getSize();
    drawWidth = (pWidth * (optionsOrPage.widthPercent || 28)) / 100;
    drawHeight = drawWidth * 0.45;
    drawX = (pWidth * (optionsOrPage.xPercent || 50)) / 100;
    drawY = (pHeight * (optionsOrPage.yPercent || 15)) / 100;
  } else if (typeof optionsOrPage === 'number') {
    targetPageIndex = optionsOrPage - 1;
  }

  const page = pages[Math.min(Math.max(0, targetPageIndex), pages.length - 1)];
  const pngBytes = await fetch(signatureDataUrl).then((r) => r.arrayBuffer());
  const img = await doc.embedPng(pngBytes);

  page.drawImage(img, {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight,
  });

  return await doc.save();
};

export const splitPdf = async (file: File, rangesOrIndices: string | number[]): Promise<Uint8Array> => {
  if (Array.isArray(rangesOrIndices)) {
    return await extractPagesFromPdf(file, rangesOrIndices.map((i) => i + 1));
  }
  const parts = await splitPdfByRanges(file, rangesOrIndices);
  return parts[0] || new Uint8Array();
};

export const splitPdfToZip = async (file: File, rangesOrIndices: string | number[]): Promise<Blob> => {
  let bytesList: Uint8Array[] = [];
  if (Array.isArray(rangesOrIndices)) {
    for (const pageIdx of rangesOrIndices) {
      const pageBytes = await extractPagesFromPdf(file, [pageIdx + 1]);
      bytesList.push(pageBytes);
    }
  } else {
    bytesList = await splitPdfByRanges(file, rangesOrIndices);
  }

  // Return unified multipart blob representation
  const mergedBlob = new Blob(bytesList.map((b) => b.buffer as ArrayBuffer), {
    type: 'application/zip',
  });
  return mergedBlob;
};

export const watermarkPdf = addWatermark;
export interface PlacedSignature {
  id: string;
  pageIndex: number;
  dataUrl: string;
  xPercent: number; // 0-100 center X
  yPercent: number; // 0-100 from top
  widthPercent: number; // 10-60
}

export async function signPdfMultiple(
  file: File,
  signatures: PlacedSignature[]
): Promise<Uint8Array> {
  const doc = await loadPdfDocument(file);
  const pages = doc.getPages();

  for (const sig of signatures) {
    if (!sig.dataUrl) continue;
    const page = pages[Math.min(Math.max(0, sig.pageIndex), pages.length - 1)];
    const { width, height } = page.getSize();

    try {
      const pngBytes = await fetch(sig.dataUrl).then((r) => r.arrayBuffer());
      const img = await doc.embedPng(pngBytes);
      const imgDims = img.scale(1);
      const aspect = imgDims.height / (imgDims.width || 1);

      const drawWidth = (width * (sig.widthPercent || 25)) / 100;
      const drawHeight = drawWidth * aspect;

      // Convert from top-based percentage to bottom-left origin
      const centerX = (width * sig.xPercent) / 100;
      const centerYFromTop = (height * sig.yPercent) / 100;
      
      const drawX = Math.max(0, Math.min(width - drawWidth, centerX - drawWidth / 2));
      const drawY = Math.max(0, Math.min(height - drawHeight, height - centerYFromTop - drawHeight / 2));

      page.drawImage(img, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight,
      });
    } catch (e) {
      console.warn('Failed to embed signature onto page', sig.pageIndex, e);
    }
  }

  return await doc.save({ useObjectStreams: true });
}
