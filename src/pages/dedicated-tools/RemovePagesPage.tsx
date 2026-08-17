import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { getPdfInfo, removePagesFromPdf, generatePdfThumbnails } from '../../lib/pdf-engine';
import { downloadBytes } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import { Trash2, Check, Sparkles } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

export const RemovePagesPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'remove-pages')!;
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  
  // Set of 0-based page indices marked for removal
  const [selectedForRemoval, setSelectedForRemoval] = useState<Set<number>>(new Set());
  const [thumbnails, setThumbnails] = useState<{ [pageIndex: number]: string }>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [removedBytes, setRemovedBytes] = useState<Uint8Array | null>(null);
  const [rangeInput, setRangeInput] = useState('');
  const toast = useToast();

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setThumbnails({});
    setSelectedForRemoval(new Set());
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
    setSelectedForRemoval((prev) => {
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
    setSelectedForRemoval(newSet);
  };

  const selectEven = () => {
    const next = new Set<number>();
    for (let i = 1; i < pageCount; i += 2) next.add(i);
    setSelectedForRemoval(next);
    setRangeInput(Array.from(next).map((i) => i + 1).join(', '));
  };

  const selectOdd = () => {
    const next = new Set<number>();
    for (let i = 0; i < pageCount; i += 2) next.add(i);
    setSelectedForRemoval(next);
    setRangeInput(Array.from(next).map((i) => i + 1).join(', '));
  };

  const clearAll = () => {
    setSelectedForRemoval(new Set());
    setRangeInput('');
  };

  const handleRemovePages = async () => {
    if (!file) return;
    if (selectedForRemoval.size === 0) {
      toast.error('Please click on at least one page to remove.');
      return;
    }
    if (selectedForRemoval.size >= pageCount) {
      toast.error('You cannot remove all pages. At least 1 page must remain.');
      return;
    }

    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const pageNumbersToRemove = Array.from(selectedForRemoval).map((i) => i + 1);
      const result = await removePagesFromPdf(file, pageNumbersToRemove);
      setProgress(100);

      setRemovedBytes(result);
      const outName = `trimmed_${file.name}`;
      downloadBytes(result, outName, 'application/pdf');

      DocumentStorage.saveDocument({
        name: outName,
        size: result.byteLength,
        type: 'application/pdf',
      });
      toast.success(`Removed ${selectedForRemoval.size} pages successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const remainingCount = pageCount - selectedForRemoval.size;

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 transition-all ${file ? 'max-w-7xl' : 'max-w-4xl'}`}>
      <SeoHead
        title="Remove Pages from PDF Online — Doclly"
        description="Selectively delete unwanted pages from PDF files online for free. Visual page picker with client-side zero-retention privacy."
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Remove Pages' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] tracking-tight">
          Remove Pages from PDF
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Click on any page you want to delete from your document.
        </p>
      </div>

      {!removedBytes ? (
        <div className="space-y-6">
          {!file ? (
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <UploadZone
                onFilesSelected={handleFileSelected}
                accepts={['.pdf']}
                acceptsDescription="Select the PDF document to remove pages from"
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
                    {selectedForRemoval.size === 0 ? (
                      'Click pages below to mark them for removal'
                    ) : (
                      <span className="text-red-600 font-semibold">
                        {selectedForRemoval.size} {selectedForRemoval.size === 1 ? 'page' : 'pages'} marked for removal ({remainingCount} will remain)
                      </span>
                    )}
                  </p>
                </div>

                {/* Quick Selection Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={selectOdd}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#F5F5F5] hover:bg-[#EAEAEA] rounded-lg transition-colors cursor-pointer"
                  >
                    Select Odd
                  </button>
                  <button
                    type="button"
                    onClick={selectEven}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#F5F5F5] hover:bg-[#EAEAEA] rounded-lg transition-colors cursor-pointer"
                  >
                    Select Even
                  </button>
                  {selectedForRemoval.size > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
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
                      setSelectedForRemoval(new Set());
                    }}
                    className="text-xs"
                  >
                    Choose Another File
                  </Button>
                </div>
              </div>

              {/* Range Input Shortcut */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-[#111111]">Pages to delete:</span>
                </div>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => handleRangeInputChange(e.target.value)}
                  placeholder="e.g. 1, 3-5, 8"
                  className="w-full sm:w-64 h-9 px-3 text-xs bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-1 focus:ring-red-400 font-mono"
                />
              </div>

              {/* Interactive Page Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: pageCount }, (_, pageIdx) => {
                  const isMarked = selectedForRemoval.has(pageIdx);
                  const thumb = thumbnails[pageIdx];

                  return (
                    <div
                      key={pageIdx}
                      onClick={() => togglePage(pageIdx)}
                      className={`group relative flex flex-col items-center bg-white rounded-2xl border transition-all p-3 select-none cursor-pointer ${
                        isMarked
                          ? 'border-red-500 ring-2 ring-red-400/40 bg-red-50/30 shadow-xs'
                          : 'border-[#E5E5E5] hover:border-[#111111] hover:shadow-xs'
                      }`}
                    >
                      {/* Top Marker Badge */}
                      <div
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border transition-all z-20 ${
                          isMarked
                            ? 'bg-red-600 border-red-600 text-white shadow-xs scale-110'
                            : 'bg-white/90 border-[#E5E5E5] text-gray-300 group-hover:text-gray-600 group-hover:border-gray-400'
                        }`}
                      >
                        {isMarked ? <Trash2 className="w-3 h-3 stroke-[2.5]" /> : <Check className="w-3 h-3" />}
                      </div>

                      {/* Thumbnail Container */}
                      <div className={`w-full aspect-[3/4] bg-[#F5F5F5] border rounded-xl relative overflow-hidden my-1 flex items-center justify-center transition-all ${
                        isMarked ? 'border-red-200 opacity-60 grayscale' : 'border-[#E5E5E5]'
                      }`}>
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

                        {isMarked && (
                          <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center pointer-events-none">
                            <span className="px-2 py-1 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded shadow-xs transform -rotate-12">
                              Remove
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Page Label */}
                      <div className="w-full mt-2 flex items-center justify-between text-xs">
                        <span className={`font-bold ${isMarked ? 'text-red-600 line-through' : 'text-[#111111]'}`}>
                          Page {pageIdx + 1}
                        </span>
                        {isMarked && (
                          <span className="text-[10px] font-bold text-red-600">Delete</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="sticky bottom-4 z-30 bg-white border border-[#E5E5E5] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#111111]">
                      {selectedForRemoval.size === 0
                        ? 'Select pages to remove'
                        : `Ready to remove ${selectedForRemoval.size} ${selectedForRemoval.size === 1 ? 'page' : 'pages'}`}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {remainingCount} pages will remain in the new document.
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleRemovePages}
                  disabled={isProcessing || selectedForRemoval.size === 0 || selectedForRemoval.size >= pageCount}
                  size="lg"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                >
                  {isProcessing ? 'Removing Pages...' : `Remove ${selectedForRemoval.size} Pages & Download`}
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <ProgressBar progress={progress} />
                  <p className="text-xs text-center text-[#6B7280]">
                    Creating new trimmed PDF...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <ResultDownloadCard
            filename={`trimmed_${file?.name || 'document.pdf'}`}
            fileSize={removedBytes.byteLength}
            onDownload={() => {
              if (removedBytes && file) {
                downloadBytes(removedBytes, `trimmed_${file.name}`, 'application/pdf');
              }
            }}
            onStartOver={() => {
              setFile(null);
              setRemovedBytes(null);
              setThumbnails({});
              setSelectedForRemoval(new Set());
              setRangeInput('');
            }}
          />
        </div>
      )}
    </div>
  );
};

