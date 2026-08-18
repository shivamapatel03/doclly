import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { ALL_TOOLS } from '../../lib/constants';
import { getPdfInfo, pdfToImages, generatePdfThumbnails } from '../../lib/pdf-engine';
import { downloadBlob } from '../../lib/utils';
import { DocumentStorage } from '../../lib/storage';
import JSZip from 'jszip';
import {
  Download,
  Check,
  Image as ImageIcon,
  CheckSquare,
  Square,
  ZoomIn,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';

import { useLocation } from 'react-router-dom';
import { FileSession } from '../../lib/file-session';

interface ExtractedImage {
  pageIndex: number;
  dataUrl: string;
}

export const PdfToJpgPage: React.FC = () => {
  const location = useLocation();
  const tool = ALL_TOOLS.find((t) => t.id === 'pdf-to-jpg') || {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert PDF pages into high-quality JPG or PNG images with individual or batch page selection.',
    seo: {
      title: 'PDF to JPG Converter — Convert PDF Pages to Images Online Free',
      description: 'Extract and convert PDF pages into high-resolution JPG or PNG images. Preview thumbnails and select specific pages to download.',
      keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpeg', 'extract images from pdf'],
    },
  };

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [thumbnails, setThumbnails] = useState<{ [pageIndex: number]: string }>({});
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImages, setConvertedImages] = useState<ExtractedImage[]>([]);
  const [resultZipBlob, setResultZipBlob] = useState<Blob | null>(null);
  const [singleImageBlob, setSingleImageBlob] = useState<Blob | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<{ src: string; pageNum: number } | null>(null);

  const toast = useToast();

  useEffect(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    if (f && f.name.toLowerCase().endsWith('.pdf') && !file) {
      handleFileSelected([f]);
    }
  }, []);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setThumbnails({});
    setSelectedPages(new Set());
    setConvertedImages([]);
    setResultZipBlob(null);
    setSingleImageBlob(null);
    setProgress(0);

    try {
      const info = await getPdfInfo(selected);
      const total = info.pageCount || 1;
      setPageCount(total);

      // Default to selecting all pages
      const allSet = new Set<number>();
      for (let i = 0; i < total; i++) allSet.add(i);
      setSelectedPages(allSet);

      generatePdfThumbnails(selected, (pageIdx, dataUrl) => {
        setThumbnails((prev) => ({ ...prev, [pageIdx]: dataUrl }));
      });
    } catch (err: any) {
      toast.error('Failed to load PDF metadata. ' + (err?.message || ''));
      setPageCount(1);
    }
  };

  const togglePage = (index: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const selectAll = () => {
    const next = new Set<number>();
    for (let i = 0; i < pageCount; i++) next.add(i);
    setSelectedPages(next);
  };

  const clearAll = () => {
    setSelectedPages(new Set());
  };

  const handleConvert = async () => {
    if (!file) return;
    if (selectedPages.size === 0) {
      toast.error('Please select at least 1 page to convert.');
      return;
    }

    setIsProcessing(true);
    setProgress(15);

    try {
      // Extract all page images
      setProgress(40);
      const allExtracted = await pdfToImages(file, format);
      setProgress(75);

      // Filter only selected pages
      const selectedExtracted = allExtracted.filter((img) =>
        selectedPages.has(img.pageIndex - 1)
      );

      if (selectedExtracted.length === 0) {
        throw new Error('No selected pages could be converted.');
      }

      setConvertedImages(selectedExtracted);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const ext = format === 'png' ? 'png' : 'jpg';

      if (selectedExtracted.length === 1) {
        // Single page output
        const res = await fetch(selectedExtracted[0].dataUrl);
        const blob = await res.blob();
        setSingleImageBlob(blob);
        setResultZipBlob(null);

        DocumentStorage.saveDocument({
          name: `${baseName}_page_${selectedExtracted[0].pageIndex}.${ext}`,
          size: blob.size,
          type: format === 'png' ? 'image/png' : 'image/jpeg',
          data: blob,
        });
      } else {
        // Multi-page output -> package into ZIP
        const zip = new JSZip();
        for (const item of selectedExtracted) {
          const base64Data = item.dataUrl.split(',')[1];
          zip.file(`${baseName}_page_${item.pageIndex}.${ext}`, base64Data, { base64: true });
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setResultZipBlob(zipBlob);
        setSingleImageBlob(null);

        DocumentStorage.saveDocument({
          name: `${baseName}_${selectedExtracted.length}_pages.zip`,
          size: zipBlob.size,
          type: 'application/zip',
          data: zipBlob,
        });
      }

      setProgress(100);
      toast.success(`Successfully converted ${selectedExtracted.length} page(s) to ${format.toUpperCase()}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to convert PDF to images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    if (!file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const ext = format === 'png' ? 'png' : 'jpg';

    if (resultZipBlob) {
      downloadBlob(resultZipBlob, `${baseName}_${convertedImages.length}_pages.zip`);
    } else if (singleImageBlob) {
      const pageNum = convertedImages[0]?.pageIndex || 1;
      downloadBlob(singleImageBlob, `${baseName}_page_${pageNum}.${ext}`);
    }
  };

  const handleDownloadSinglePage = async (item: ExtractedImage) => {
    if (!file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const ext = format === 'png' ? 'png' : 'jpg';
    const res = await fetch(item.dataUrl);
    const blob = await res.blob();
    downloadBlob(blob, `${baseName}_page_${item.pageIndex}.${ext}`);
  };

  const handleStartOver = () => {
    setFile(null);
    setPageCount(0);
    setThumbnails({});
    setSelectedPages(new Set());
    setConvertedImages([]);
    setResultZipBlob(null);
    setSingleImageBlob(null);
    setProgress(0);
  };

  const isDone = convertedImages.length > 0 && (resultZipBlob !== null || singleImageBlob !== null);
  const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'document';
  const outFilename =
    convertedImages.length > 1
      ? `${baseName}_${convertedImages.length}_pages.zip`
      : `${baseName}_page_${convertedImages[0]?.pageIndex || 1}.${format === 'png' ? 'png' : 'jpg'}`;
  const outFileSize = resultZipBlob ? resultZipBlob.size : singleImageBlob?.size || undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SeoHead
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'PDF to JPG' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          PDF to JPG Converter
        </h1>
        <p className="text-sm text-[#6B7280]">
          Convert PDF pages into high-resolution JPG or PNG images. View thumbnails and select specific pages to download.
        </p>
      </div>

      {!file ? (
        <UploadZone
          onFilesSelected={handleFileSelected}
          accepts={['.pdf', 'application/pdf']}
          acceptsDescription="PDF document"
          maxFiles={1}
        />
      ) : isDone ? (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-2xs relative z-10">
            <ResultDownloadCard
              filename={outFilename}
              fileSize={outFileSize}
              title={
                convertedImages.length > 1
                  ? `${convertedImages.length} Pages Converted to ${format.toUpperCase()}!`
                  : 'Page Converted to Image!'
              }
              description={
                convertedImages.length > 1
                  ? `Your selected pages are ready. Download the complete ZIP archive or individual images below.`
                  : `Your page has been converted to a high-resolution ${format.toUpperCase()} image.`
              }
              onDownload={handleDownloadAll}
              onStartOver={handleStartOver}
            />
          </div>

          {/* Extracted Images Gallery */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-[#111111]">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>Extracted Page Images ({convertedImages.length} pages)</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={handleDownloadAll}
                className="text-xs font-bold"
              >
                Download All ({convertedImages.length})
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[32rem] overflow-y-auto p-1">
              {convertedImages.map((img) => (
                <div
                  key={img.pageIndex}
                  className="group border border-[#E5E5E5] hover:border-[#111111] rounded-xl overflow-hidden shadow-2xs bg-[#F5F5F5] flex flex-col transition-all"
                >
                  <div className="relative aspect-[3/4] bg-white flex items-center justify-center p-2 overflow-hidden">
                    <img
                      src={img.dataUrl}
                      alt={`Page ${img.pageIndex}`}
                      className="max-h-full max-w-full object-contain drop-shadow-xs group-hover:scale-102 transition-transform duration-200"
                    />
                    <button
                      onClick={() => setPreviewModalImg({ src: img.dataUrl, pageNum: img.pageIndex })}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer gap-1 text-xs font-semibold"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-white border-t border-[#E5E5E5] flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#111111]">Page {img.pageIndex}</span>
                    <button
                      onClick={() => handleDownloadSinglePage(img)}
                      title={`Download Page ${img.pageIndex} ${format.toUpperCase()}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#F5F5F5] hover:bg-[#111111] text-[#111111] hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>{format.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Page Selection & Conversion Controls */
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-6 shadow-2xs">
          {/* File Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111111] truncate">{file.name}</p>
                <p className="text-xs text-[#6B7280]">
                  {pageCount} {pageCount === 1 ? 'page' : 'pages'} found in PDF
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Output Format Selector */}
              <div className="flex items-center bg-white rounded-lg border border-[#E5E5E5] p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFormat('jpg')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    format === 'jpg' ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:text-[#111111]'
                  }`}
                >
                  JPG
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('png')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    format === 'png' ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:text-[#111111]'
                  }`}
                >
                  PNG
                </button>
              </div>

              <button
                onClick={handleStartOver}
                className="text-xs text-[#6B7280] hover:text-[#111111] hover:underline px-2 cursor-pointer"
              >
                Change PDF
              </button>
            </div>
          </div>

          {/* Selection Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E5E5] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#111111]">
                {selectedPages.size} of {pageCount} Pages Selected
              </span>
              {selectedPages.size === pageCount && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                  All Selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] hover:underline cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Select All</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] hover:text-[#111111] hover:underline cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Deselect All</span>
              </button>
            </div>
          </div>

          {/* Page Grid Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[30rem] overflow-y-auto p-1">
            {Array.from({ length: pageCount }).map((_, idx) => {
              const isSelected = selectedPages.has(idx);
              const thumb = thumbnails[idx];

              return (
                <div
                  key={idx}
                  onClick={() => togglePage(idx)}
                  className={`group relative flex flex-col rounded-xl border-2 transition-all cursor-pointer select-none overflow-hidden ${
                    isSelected
                      ? 'border-[#111111] bg-white shadow-sm ring-2 ring-[#111111]/10'
                      : 'border-[#E5E5E5] bg-[#F5F5F5]/60 hover:border-gray-400 opacity-60 hover:opacity-90'
                  }`}
                >
                  {/* Selection Indicator Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isSelected ? 'bg-[#111111] text-white' : 'bg-white/90 border border-gray-300 text-transparent'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                    </div>
                  </div>

                  {/* Thumbnail Image View */}
                  <div className="relative aspect-[3/4] p-3 flex items-center justify-center bg-white">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={`Page ${idx + 1}`}
                        className="max-h-full max-w-full object-contain drop-shadow-xs group-hover:scale-102 transition-transform duration-150"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 space-y-1">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-[#111111] rounded-full animate-spin" />
                        <span className="text-[10px]">Loading...</span>
                      </div>
                    )}
                  </div>

                  {/* Page Footer Label */}
                  <div
                    className={`p-2 text-center text-xs font-bold border-t transition-colors ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#6B7280] border-[#E5E5E5]'
                    }`}
                  >
                    Page {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Processing Bar */}
          {isProcessing && (
            <div className="space-y-2 pt-2">
              <ProgressBar progress={progress} />
              <p className="text-xs text-center text-[#6B7280]">
                Rendering & packaging {selectedPages.size} high-resolution {format.toUpperCase()} images...
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
            <Button
              size="lg"
              variant="primary"
              onClick={handleConvert}
              disabled={isProcessing || selectedPages.size === 0}
              className="bg-[#FFC800] text-[#111111] hover:bg-[#E6B400] font-bold cursor-pointer"
            >
              {isProcessing
                ? 'Converting Pages...'
                : `Convert ${selectedPages.size} ${selectedPages.size === 1 ? 'Page' : 'Pages'} to ${format.toUpperCase()}`}
            </Button>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Preview Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl p-4 max-w-2xl w-full max-h-[90vh] flex flex-col items-center space-y-3">
            <div className="flex items-center justify-between w-full border-b border-[#E5E5E5] pb-2">
              <span className="text-sm font-bold text-[#111111]">
                Page {previewModalImg.pageNum} Preview
              </span>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="p-1 text-gray-400 hover:text-[#111111] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 flex items-center justify-center">
              <img
                src={previewModalImg.src}
                alt={`Page ${previewModalImg.pageNum}`}
                className="max-h-[70vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
