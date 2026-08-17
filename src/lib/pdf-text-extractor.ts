import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { readFileAsArrayBuffer } from './utils';

// Register local Vite-bundled worker
try {
  if (pdfjsWorker) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }
} catch {
  // Worker fallback
}

export interface ExtractedTableData {
  headers: string[];
  rows: (string | number)[][];
  rawText: string;
  pageCount: number;
}

interface TextItemWithPos {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Clean strings of mojibake and illegal characters
 */
function cleanCellText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u2014\u2015\u2013\u2212]/g, '-')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219\u00B7]/g, '-')
    .replace(/[\u2026]/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Converts numeric strings to actual numbers where applicable
 */
function parseCellValue(val: string): string | number {
  const cleaned = cleanCellText(val);
  if (!cleaned) return '';
  // Check if purely numeric or currency number
  const numCheck = cleaned.replace(/^[₹$€£¥]\s*/, '').replace(/,/g, '');
  if (/^-?\d+(\.\d+)?$/.test(numCheck) && !isNaN(Number(numCheck))) {
    return Number(numCheck);
  }
  return cleaned;
}

/**
 * Fallback stream parser to extract raw strings if PDF.js has worker/cors limitations
 */
function extractRawStringsFromPdfBuffer(buffer: ArrayBuffer): string[] {
  const uint8 = new Uint8Array(buffer);
  const textDecoder = new TextDecoder('utf-8', { fatal: false });
  const rawString = textDecoder.decode(uint8);

  const lines: string[] = [];
  // Match text in PDF TJ / Tj operators
  const regex = /\(([^)]+)\)\s*Tj/g;
  let match;
  while ((match = regex.exec(rawString)) !== null) {
    const s = cleanCellText(match[1]);
    if (s && s.length > 0) {
      lines.push(s);
    }
  }
  return lines;
}

/**
 * Extracts readable plain text and structured tables from any PDF file
 */
export async function extractTextAndTablesFromPdf(file: File): Promise<ExtractedTableData> {
  const buffer = await readFileAsArrayBuffer(file);

  let pageCount = 1;
  const pageTexts: string[] = [];
  const extractedLinesWithCells: { page: number; cells: string[]; rawLine: string }[] = [];

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      stopAtErrors: false,
    });

    const pdf = await loadingTask.promise;
    pageCount = pdf.numPages;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items = textContent.items as any[];

      if (!items || items.length === 0) continue;

      // Collect all valid text items with geometry coordinates
      const textItems: TextItemWithPos[] = [];
      for (const item of items) {
        if (!item.str || !item.str.trim()) continue;
        textItems.push({
          str: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width || (item.str.length * 6),
          height: item.height || 10,
        });
      }

      // Group items into horizontal lines (with vertical tolerance of 4px)
      const lineMap: { y: number; items: TextItemWithPos[] }[] = [];
      for (const item of textItems) {
        let line = lineMap.find((l) => Math.abs(l.y - item.y) <= 4);
        if (!line) {
          line = { y: item.y, items: [] };
          lineMap.push(line);
        }
        line.items.push(item);
      }

      // Sort lines top to bottom (descending Y in PDF coordinates)
      lineMap.sort((a, b) => b.y - a.y);

      const pageLines: string[] = [];

      for (const line of lineMap) {
        // Sort items on this line from left to right (ascending X)
        line.items.sort((a, b) => a.x - b.x);

        const lineStr = line.items.map((i) => i.str.trim()).join(' ');
        if (lineStr) pageLines.push(lineStr);

        // Form table cells by clustering adjacent words and splitting across gaps
        const cells: string[] = [];
        let currentCellWords: string[] = [];
        let lastRightEdge = -1;

        for (const item of line.items) {
          const word = item.str.trim();
          if (!word) continue;

          const leftEdge = item.x;
          // If there is a horizontal gap (> 16px), start a new cell/column
          if (lastRightEdge !== -1 && (leftEdge - lastRightEdge) > 16) {
            if (currentCellWords.length > 0) {
              cells.push(currentCellWords.join(' '));
              currentCellWords = [];
            }
          }

          currentCellWords.push(word);
          lastRightEdge = item.x + item.width;
        }

        if (currentCellWords.length > 0) {
          cells.push(currentCellWords.join(' '));
        }

        // Check if line contains standard delimiters
        if (cells.length === 1) {
          const text = cells[0];
          if (text.includes('\t')) {
            const parts = text.split('\t').map((p) => p.trim()).filter(Boolean);
            if (parts.length > 1) {
              extractedLinesWithCells.push({ page: pageNum, cells: parts, rawLine: lineStr });
              continue;
            }
          }
          if (text.includes('|')) {
            const parts = text.split('|').map((p) => p.trim()).filter(Boolean);
            if (parts.length > 1) {
              extractedLinesWithCells.push({ page: pageNum, cells: parts, rawLine: lineStr });
              continue;
            }
          }
          if (text.includes(':') && !text.startsWith('http')) {
            const colonIdx = text.indexOf(':');
            const key = text.slice(0, colonIdx).trim();
            const val = text.slice(colonIdx + 1).trim();
            if (key && val && key.length < 35) {
              extractedLinesWithCells.push({ page: pageNum, cells: [key, val], rawLine: lineStr });
              continue;
            }
          }
        }

        extractedLinesWithCells.push({ page: pageNum, cells, rawLine: lineStr });
      }

      pageTexts.push(pageLines.join('\n'));
    }
  } catch {
    // If PDF.js encounters any issues, use raw stream fallback
    const rawMatches = extractRawStringsFromPdfBuffer(buffer);
    for (let i = 0; i < rawMatches.length; i++) {
      const line = rawMatches[i];
      extractedLinesWithCells.push({ page: 1, cells: [line], rawLine: line });
      pageTexts.push(line);
    }
  }

  const allExtractedText = pageTexts.join('\n\n');

  // Determine the structure of the extracted data
  const multiCellLines = extractedLinesWithCells.filter((l) => l.cells.length >= 2);

  let headers: string[] = [];
  let tableRows: (string | number)[][] = [];

  if (multiCellLines.length >= 2) {
    // True multi-column table detected
    const maxCols = Math.max(...multiCellLines.map((l) => l.cells.length));
    
    // Normalize multi-column rows
    const normalized = multiCellLines.map((l) => {
      const row = l.cells.map(parseCellValue);
      while (row.length < maxCols) {
        row.push('');
      }
      return row;
    });

    headers = normalized[0].map((h, i) => String(h || `Column ${i + 1}`));
    tableRows = normalized.slice(1);
  } else if (extractedLinesWithCells.length > 0) {
    // Document / text PDF (e.g. Word-to-PDF, split PDF, merged PDF)
    // Structure cleanly into Excel columns: [Line #, Page, Content]
    headers = ['Item #', 'Page', 'Extracted Document Content'];
    tableRows = extractedLinesWithCells
      .filter((l) => l.rawLine && l.rawLine.trim().length > 0)
      .map((l, idx) => [
        idx + 1,
        `Page ${l.page}`,
        cleanCellText(l.rawLine)
      ]);
  }

  // If still empty (e.g. completely empty blank PDF), provide clear empty placeholder
  if (tableRows.length === 0) {
    headers = ['Item #', 'Page', 'Extracted Document Content'];
    tableRows = [
      [1, 'Page 1', `Content from ${file.name}`]
    ];
  }

  return {
    headers,
    rows: tableRows,
    rawText: allExtractedText || `Document content for ${file.name}`,
    pageCount,
  };
}
