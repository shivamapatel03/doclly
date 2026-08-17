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

export async function cleanSpreadsheetData(
  file: File,
  options: {
    deduplicate?: boolean;
    trimWhitespace?: boolean;
    removeEmptyRows?: boolean;
  } = { deduplicate: true, trimWhitespace: true, removeEmptyRows: true }
): Promise<{
  data: Uint8Array;
  originalRowCount: number;
  cleanedRowCount: number;
  duplicatesRemoved: number;
}> {
  const buffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const originalRowCount = rawRows.length;

  if (rawRows.length === 0) {
    const emptyWb = XLSX.utils.book_new();
    const emptyBuf = XLSX.write(emptyWb, { bookType: 'xlsx', type: 'array' });
    return { data: new Uint8Array(emptyBuf), originalRowCount: 0, cleanedRowCount: 0, duplicatesRemoved: 0 };
  }

  const headerRow = rawRows[0];
  let dataRows = rawRows.slice(1);

  // 1. Trim whitespace
  if (options.trimWhitespace) {
    dataRows = dataRows.map((row) =>
      row.map((cell) => (typeof cell === 'string' ? cell.trim() : cell))
    );
  }

  // 2. Remove completely empty rows
  if (options.removeEmptyRows) {
    dataRows = dataRows.filter((row) =>
      row.some((cell) => cell !== '' && cell !== null && cell !== undefined)
    );
  }

  // 3. Deduplicate
  let duplicatesRemoved = 0;
  if (options.deduplicate) {
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
  return {
    data: new Uint8Array(outBuffer),
    originalRowCount: Math.max(0, originalRowCount - 1),
    cleanedRowCount: dataRows.length,
    duplicatesRemoved,
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
