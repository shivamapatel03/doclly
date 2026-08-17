import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import saveAs from 'file-saver';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk as any);
  }
  return btoa(binary);
}

/**
 * Downloads binary bytes guaranteeing that Chromium and Windows NEVER save as a raw UUID
 */
export function downloadBytes(bytes: Uint8Array, filename: string, mimeType = 'application/pdf') {
  let safeName = filename.trim().replace(/[<>:"/\\|?*]/g, '_');
  if (mimeType === 'application/pdf' && !safeName.toLowerCase().endsWith('.pdf')) {
    safeName += '.pdf';
  } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
    if (!safeName.toLowerCase().endsWith('.xlsx')) safeName += '.xlsx';
  } else if (mimeType.includes('word') || mimeType.includes('docx')) {
    if (!safeName.toLowerCase().endsWith('.docx')) safeName += '.docx';
  } else if (mimeType.includes('zip') && !safeName.toLowerCase().endsWith('.zip')) {
    safeName += '.zip';
  }

  try {
    // Under 35MB: Data URL guarantees Chrome/Edge NEVER defaults to a Blob UUID
    if (bytes.byteLength < 35 * 1024 * 1024) {
      const base64 = uint8ArrayToBase64(bytes);
      const dataUrl = `data:${mimeType};base64,${base64}`;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.setAttribute('download', safeName);
      link.download = safeName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 1000);
      return;
    }
  } catch (err) {
    console.warn('Data URL download fallback to File object', err);
  }

  // Large file fallback
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const file = new File([arrayBuffer], safeName, { type: mimeType });
  saveAs(file, safeName);
}

/**
 * Downloads a Blob guaranteeing the filename and extension on Windows and Chrome
 */
export function downloadBlob(blob: Blob, filename: string) {
  let cleanName = filename.trim().replace(/[<>:"/\\|?*]/g, '_');
  if (!cleanName.includes('.')) {
    if (blob.type.includes('pdf')) cleanName += '.pdf';
    else if (blob.type.includes('zip')) cleanName += '.zip';
    else if (blob.type.includes('sheet') || blob.type.includes('excel')) cleanName += '.xlsx';
    else if (blob.type.includes('word') || blob.type.includes('docx')) cleanName += '.docx';
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      const link = document.createElement('a');
      link.href = reader.result;
      link.setAttribute('download', cleanName);
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 1000);
    } else {
      saveAs(blob, cleanName);
    }
  };
  reader.onerror = () => {
    saveAs(blob, cleanName);
  };
  reader.readAsDataURL(blob);
}

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
