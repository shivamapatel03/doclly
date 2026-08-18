import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { getPdfInfo, extractPagesFromPdf, generatePdfThumbnails } from '../../lib/pdf-engine';
import { downloadBytes } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import { Copy, Check, Sparkles } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

import { useLocation } from 'react-router-dom';
import { FileSession } from '../../lib/file-session';

export const ExtractPagesPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'extract-pages')!;
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  
  // Set of 0-based page indices selected to extract
  const [selectedToExtract, setSelectedToExtract] = useState<Set<number>>(new Set());
  const [thumbnails, setThumbnails] = useState<{ [pageIndex: number]: string }>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedBytes, setExtractedBytes] = useState<Uint8Array | null>(null);
  const [rangeInput, setRangeInput] = useState('');
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
    setSelectedToExtract(new Set());
    setRangeInput('');

    try {
      const info = await getPdfInfo(selected);
      const total = info.pageCount || 4;
      setPageCount(total);

      generatePdfThumbnails(selected, (pageIdx, dataUrl) => {
        setThumbnails((prev) => ({ ...prev, [pageIdx]: dataUrl }));
      });
    } catch {
      setPageCount(4);
    }
  };

const togglePage = (index: number) => {
    setSelectedToExtract((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      const sorted = Array.from(next).map((i) => i + 1).sort((a, b) => a - b);
      setRangeInput(sorted.join(', '));
      return next;
    });
  };

  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    const newSet = new Set<number>();
    const parts = val.split(',').map((s) => s.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, pageCount));
          const e = Math.max(s, Math.min(end, pageCount));
          for (let i = s; i <= e; i++) newSet.add(i - 1);
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= pageCount) {
          newSet.add(num - 1);
        }
      }
    }
    setSelectedToExtract(newSet);
  };

  const selectAll = () => {
    const next = new Set<number>();
    for (let i = 0; i < pageCount; i++) next.add(i);
    setSelectedToExtract(next);
    setRangeInput(`1-${pageCount}`);
  };

  const clearAll = () => {
    setSelectedToExtract(new Set());
    setRangeInput('');
  };

  const handleExtractPages = async () => {
    if (!file) return;
    if (selectedToExtract.size === 0) {
      toast.error('Please click on at least one page to extract.');
      return;
    }

    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const pageNumbersToExtract = Array.from(selectedToExtract).map((i) => i + 1);
      const result = await extractPagesFromPdf(file, pageNumbersToExtract);
      setProgress(100);

      setExtractedBytes(result);
      const outName = `extracted_${file.name}`;

      DocumentStorage.saveDocument({
        name: outName,
        size: result.byteLength,
        type: 'application/pdf',
      });
      toast.success(`Extracted ${selectedToExtract.size} pages successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to extract pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 transition-all ${file ? 'max-w-7xl' : 'max-w-4xl'}`}>
      <SeoHead
        title="Extract Pages from PDF Online — Doclly"
        description="Select and save specific pages from any PDF file into a new standalone PDF document. Free, fast, and 100% in-browser private."
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Extract Pages' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] tracking-tight">
          Extract Pages from PDF
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Click on the pages you want to extract and save into a new PDF document.
        </p>
      </div>

      {!extractedBytes ? (
        <div className="space-y-6">
          {!file ? (
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <UploadZone
                onFilesSelected={handleFileSelected}
                accepts={['.pdf']}
                acceptsDescription="Select the PDF document to extract pages from"
                maxFiles={1}
              />
              
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Controls Bar */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111111] truncate max-w-xs">{file.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#6B7280] font-semibold">
                      {pageCount} Pages
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {selectedToExtract.size === 0 ? (
                      'Click pages below to select which pages to extract'
                    ) : (
                      <span className="text-sky-600 font-semibold">
                        {selectedToExtract.size} {selectedToExtract.size === 1 ? 'page' : 'pages'} selected for extraction
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#F5F5F5] hover:bg-[#EAEAEA] rounded-lg transition-colors cursor-pointer"
                  >
                    Select All
                  </button>
                  {selectedToExtract.size > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setThumbnails({});
                      setSelectedToExtract(new Set());
                    }}
                    className="text-xs"
                  >
                    Choose Another File
                  </Button>
                </div>
              </div>

              {/* Range Input */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold text-[#111111]">Pages to extract:</span>
                </div>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => handleRangeInputChange(e.target.value)}
                  placeholder="e.g. 1-3, 5"
                  className="w-full sm:w-64 h-9 px-3 text-xs bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono"
                />
              </div>

              {/* Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: pageCount }, (_, pageIdx) => {
                  const isSelected = selectedToExtract.has(pageIdx);
                  const thumb = thumbnails[pageIdx];

                  return (
                    <div
                      key={pageIdx}
                      onClick={() => togglePage(pageIdx)}
                      className={`group relative flex flex-col items-center bg-white rounded-2xl border transition-all p-3 select-none cursor-pointer ${
                        isSelected
                          ? 'border-sky-500 ring-2 ring-sky-400/40 bg-sky-50/20 shadow-xs'
                          : 'border-[#E5E5E5] hover:border-[#111111] hover:shadow-xs'
                      }`}
                    >
                      {/* Checkbox Badge */}
                      <div
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border transition-all z-20 ${
                          isSelected
                            ? 'bg-sky-500 border-sky-500 text-white shadow-xs scale-110'
                            : 'bg-white/90 border-[#E5E5E5] text-gray-300 group-hover:text-gray-600 group-hover:border-gray-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>

                      {/* Thumbnail Container */}
                      <div className="w-full aspect-[3/4] bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl relative overflow-hidden my-1 flex items-center justify-center">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`Page ${pageIdx + 1}`}
                            className="w-full h-full object-contain rounded bg-white pointer-events-none"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#111111] rounded-full animate-spin" />
                            <span className="text-[10px] text-gray-400">Loading...</span>
                          </div>
                        )}
                      </div>

                      {/* Page Label */}
                      <div className="w-full mt-2 flex items-center justify-between text-xs">
                        <span className={`font-bold ${isSelected ? 'text-sky-600' : 'text-[#111111]'}`}>
                          Page {pageIdx + 1}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-sky-600">Selected</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="sticky bottom-4 z-30 bg-white border border-[#E5E5E5] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Copy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#111111]">
                      {selectedToExtract.size === 0
                        ? 'Select pages to extract'
                        : `Ready to extract ${selectedToExtract.size} ${selectedToExtract.size === 1 ? 'page' : 'pages'}`}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      A new PDF containing only these pages will be created.
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleExtractPages}
                  disabled={isProcessing || selectedToExtract.size === 0}
                  size="lg"
                  className="w-full sm:w-auto bg-[#111111] hover:bg-black text-white font-bold cursor-pointer"
                >
                  {isProcessing ? 'Extracting Pages...' : `Extract ${selectedToExtract.size} Pages & Download`}
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <ProgressBar progress={progress} />
                  <p className="text-xs text-center text-[#6B7280]">
                    Creating new extracted PDF...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <ResultDownloadCard
            filename={`extracted_${file?.name || 'document.pdf'}`}
            fileSize={extractedBytes.byteLength}
            onDownload={() => {
              if (extractedBytes && file) {
                downloadBytes(extractedBytes, `extracted_${file.name}`, 'application/pdf');
              }
            }}
            onStartOver={() => {
              setFile(null);
              setExtractedBytes(null);
              setThumbnails({});
              setSelectedToExtract(new Set());
              setRangeInput('');
            }}
          />
        </div>
      )}
    </div>
  );
};

