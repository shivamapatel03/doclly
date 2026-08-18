import * as XLSX from 'xlsx';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import { readFileAsArrayBuffer, readFileAsText } from './utils';

export interface SpreadsheetPreview {
  headers: string[];
  rows: (string | number)[][];
  totalRows: number;
}

export async function parseSpreadsheet(file: File): Promise<SpreadsheetPreview> {
  const buffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  
  const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  if (rawData.length === 0) {
    return { headers: [], rows: [], totalRows: 0 };
  }

  const headers = rawData[0].map((h) => String(h || 'Column'));
  const rows = rawData.slice(1, 51); // First 50 rows for preview

  return {
    headers,
    rows,
    totalRows: rawData.length - 1,
  };
}

export async function csvToExcel(file: File): Promise<Uint8Array> {
  const text = await readFileAsText(file);
  const workbook = XLSX.read(text, { type: 'string' });
  const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(xlsxBuffer);
}

export async function excelToCsv(file: File): Promise<string> {
  const buffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_csv(sheet);
}

export interface CleanSpreadsheetOptions {
  deduplicate?: boolean;
  trimWhitespace?: boolean;
  removeEmptyRows?: boolean;
  textCase?: 'none' | 'upper' | 'lower' | 'title';
  findText?: string;
  replaceText?: string;
  outputFormat?: 'xlsx' | 'csv';
}

export interface CleanSpreadsheetResult {
  data: Uint8Array;
  csvText: string;
  originalRowCount: number;
  cleanedRowCount: number;
  duplicatesRemoved: number;
  emptyRowsRemoved: number;
  headers: string[];
  previewRows: (string | number)[][];
}

export async function cleanSpreadsheetData(
  file: File,
  options: CleanSpreadsheetOptions = {
    deduplicate: true,
    trimWhitespace: true,
    removeEmptyRows: true,
    textCase: 'none',
    outputFormat: 'xlsx',
  }
): Promise<CleanSpreadsheetResult> {
  const buffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0] || 'Sheet1';
  const sheet = workbook.Sheets[sheetName];

  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const originalRowCount = Math.max(0, rawRows.length - 1);

  if (rawRows.length === 0) {
    const emptyWb = XLSX.utils.book_new();
    const emptyBuf = XLSX.write(emptyWb, { bookType: 'xlsx', type: 'array' });
    return {
      data: new Uint8Array(emptyBuf),
      csvText: '',
      originalRowCount: 0,
      cleanedRowCount: 0,
      duplicatesRemoved: 0,
      emptyRowsRemoved: 0,
      headers: [],
      previewRows: [],
    };
  }

  const headerRow = rawRows[0].map((h) => String(h ?? '').trim() || 'Column');
  let dataRows = rawRows.slice(1);

  // 1. Trim whitespace
  if (options.trimWhitespace !== false) {
    dataRows = dataRows.map((row) =>
      row.map((cell) => (typeof cell === 'string' ? cell.trim() : cell))
    );
  }

  // 2. Remove completely empty rows
  let emptyRowsRemoved = 0;
  if (options.removeEmptyRows !== false) {
    const initialCount = dataRows.length;
    dataRows = dataRows.filter((row) =>
      row.some((cell) => cell !== '' && cell !== null && cell !== undefined)
    );
    emptyRowsRemoved = initialCount - dataRows.length;
  }

  // 3. Find and Replace
  if (options.findText) {
    const search = options.findText;
    const rep = options.replaceText ?? '';
    dataRows = dataRows.map((row) =>
      row.map((cell) => {
        if (typeof cell === 'string' && search) {
          return cell.replaceAll(search, rep);
        }
        return cell;
      })
    );
  }

  // 4. Text Case Transformation
  if (options.textCase && options.textCase !== 'none') {
    dataRows = dataRows.map((row) =>
      row.map((cell) => {
        if (typeof cell !== 'string') return cell;
        if (options.textCase === 'upper') return cell.toUpperCase();
        if (options.textCase === 'lower') return cell.toLowerCase();
        if (options.textCase === 'title') {
          return cell.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
        }
        return cell;
      })
    );
  }

  // 5. Deduplicate
  let duplicatesRemoved = 0;
  if (options.deduplicate !== false) {
    const seen = new Set<string>();
    const uniqueRows: any[][] = [];
    for (const row of dataRows) {
      const key = JSON.stringify(row);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRows.push(row);
      } else {
        duplicatesRemoved++;
      }
    }
    dataRows = uniqueRows;
  }

  const newRows = [headerRow, ...dataRows];
  const newSheet = XLSX.utils.aoa_to_sheet(newRows);
  const newWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWb, newSheet, 'Cleaned Data');

  const outBuffer = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
  const csvOutput = XLSX.utils.sheet_to_csv(newSheet);

  return {
    data: new Uint8Array(outBuffer),
    csvText: csvOutput,
    originalRowCount,
    cleanedRowCount: dataRows.length,
    duplicatesRemoved,
    emptyRowsRemoved,
    headers: headerRow,
    previewRows: dataRows.slice(0, 50),
  };
}

export async function convertTextOrRowsToExcel(
  headers: string[],
  rows: (string | number)[][],
  sheetName = 'Extracted Data'
): Promise<Uint8Array> {
  const wb = XLSX.utils.book_new();

  // Convert numbers where possible
  const sanitizedRows = rows.map((r) =>
    r.map((cell) => {
      if (typeof cell === 'number') return cell;
      if (typeof cell === 'string') {
        const trimmed = cell.trim();
        if (/^-?\d+(\.\d+)?$/.test(trimmed) && !isNaN(Number(trimmed))) {
          return Number(trimmed);
        }
        return trimmed;
      }
      return cell;
    })
  );

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sanitizedRows]);

  // Compute auto column widths
  const colWidths = headers.map((header, colIdx) => {
    let maxLen = header.length;
    for (const row of sanitizedRows) {
      const cellVal = String(row[colIdx] ?? '');
      if (cellVal.length > maxLen) {
        maxLen = cellVal.length;
      }
    }
    return { wch: Math.min(60, Math.max(12, maxLen + 3)) };
  });

  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(buffer);
}

export async function createDocxFromText(
  title: string,
  paragraphs: string[]
): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          ...paragraphs.map(
            (p) =>
              new Paragraph({
                children: [new TextRun({ text: p, size: 24 })],
                spacing: { after: 150 },
              })
          ),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
