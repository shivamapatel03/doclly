import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { PageThumbnailGrid } from '../../components/tools/PageThumbnailGrid';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { getPdfInfo, splitPdf, splitPdfToZip, generatePdfThumbnails } from '../../lib/pdf-engine';
import { downloadBytes, downloadBlob, formatFileSize } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import { Download, ExternalLink, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';
import { ThreeDIcon } from '../../components/common/ThreeDIcon';

import { useLocation } from 'react-router-dom';
import { FileSession } from '../../lib/file-session';

export const SplitPdfPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'split-pdf')!;
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState<'selected' | 'range' | 'all'>('selected');
  const [rangeInput, setRangeInput] = useState('1-2');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set([0]));
  const [rotations, setRotations] = useState<{ [pageIndex: number]: number }>({});
  const [thumbnails, setThumbnails] = useState<{ [pageIndex: number]: string }>({});
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitResultBytes, setSplitResultBytes] = useState<Uint8Array | null>(null);
  const [splitResultZip, setSplitResultZip] = useState<Blob | null>(null);
  const [extractedPageNumbers, setExtractedPageNumbers] = useState<number[]>([]);
  const [outputType, setOutputType] = useState<'pdf' | 'zip'>('pdf');
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

    try {
      const info = await getPdfInfo(selected);
      const total = info.pageCount || 1;
      setPageCount(total);
      setSelectedPages(new Set([0]));
      setRangeInput(`1-${Math.min(2, total)}`);

      // Asynchronously render real page thumbnails progressively
      generatePdfThumbnails(selected, (pageIdx, dataUrl) => {
        setThumbnails((prev) => ({ ...prev, [pageIdx]: dataUrl }));
      });
    } catch {
      setPageCount(3);
      setSelectedPages(new Set([0]));
      setRangeInput('1-2');
    }
  };

  const handleToggleSelectPage = (index: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        if (next.size > 1) next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const all = new Set<number>();
    for (let i = 0; i < pageCount; i++) all.add(i);
    setSelectedPages(all);
  };

const handleSplit = async (format: 'pdf' | 'zip' = 'pdf') => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(25);
    setOutputType(format);

    try {
      let pageIndicesToExtract: number[] = [];

      if (splitMode === 'selected') {
        pageIndicesToExtract = Array.from(selectedPages).sort((a, b) => a - b);
      } else if (splitMode === 'all') {
        pageIndicesToExtract = Array.from({ length: pageCount }, (_, i) => i);
      } else if (splitMode === 'range') {
        const parts = rangeInput.split(',');
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
              for (let p = Math.min(start, end); p <= Math.max(start, end); p++) {
                if (p >= 1 && p <= pageCount) pageIndicesToExtract.push(p - 1);
              }
            }
          } else {
            const num = parseInt(trimmed, 10);
            if (!isNaN(num) && num >= 1 && num <= pageCount) {
              pageIndicesToExtract.push(num - 1);
            }
          }
        }
      }

      if (pageIndicesToExtract.length === 0) {
        throw new Error('Please select at least one valid page to extract.');
      }

      setExtractedPageNumbers(pageIndicesToExtract.map((idx) => idx + 1));
      setProgress(60);

      if (format === 'zip') {
        const zipBlob = await splitPdfToZip(file, pageIndicesToExtract);
        setProgress(100);
        setSplitResultZip(zipBlob);
        setSplitResultBytes(null);
        toast.success(`Split ${pageIndicesToExtract.length} pages into ZIP archive!`);
      } else {
        const result = await splitPdf(file, pageIndicesToExtract);
        setProgress(100);
        setSplitResultBytes(result);
        setSplitResultZip(null);
        DocumentStorage.saveDocument({
          name: `Split_${file.name}`,
          size: result.byteLength,
          type: 'application/pdf',
        });
        toast.success(`Extracted ${pageIndicesToExtract.length} pages into new PDF!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    if (outputType === 'zip' && splitResultZip) {
      downloadBlob(splitResultZip, `split_${base}.zip`);
    } else if (splitResultBytes) {
      downloadBytes(splitResultBytes, `split_${base}.pdf`, 'application/pdf');
    }
  };

  const handlePreviewPdf = () => {
    if (splitResultBytes) {
      const blob = new Blob([splitResultBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const pagesList = Array.from({ length: pageCount }, (_, i) => ({
    index: i,
    pageNumber: i + 1,
    rotation: rotations[i] || 0,
    isDeleted: false,
    isSelected: selectedPages.has(i),
    thumbnail: thumbnails[i],
  }));

  const selectedPagesSummary = Array.from(selectedPages)
    .sort((a, b) => a - b)
    .map((i) => `Page ${i + 1}`)
    .join(', ');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask" />
      <SeoHead
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Split PDF' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Split PDF files
        </h1>
        <p className="text-sm text-[#6B7280]">
          Extract specific pages, page ranges, or separate all pages into standalone documents.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs relative z-10">
        {splitResultBytes || splitResultZip ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-[#FFC800]/20 text-[#111111] rounded-2xl flex items-center justify-center mx-auto ring-8 ring-[#FFC800]/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#111111]">
                {outputType === 'zip' ? 'ZIP Archive Ready!' : 'Extracted PDF is Ready!'}
              </h2>
              <p className="text-xs text-[#6B7280]">
                {outputType === 'zip'
                  ? `Successfully split ${extractedPageNumbers.length} pages into separate PDF documents.`
                  : `Successfully combined selected ${extractedPageNumbers.length} pages into a standalone PDF.`}
              </p>
            </div>

            {/* Document Details Card */}
            <div className="p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] max-w-md mx-auto flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <ThreeDIcon name={outputType === 'zip' ? 'compress' : 'pdf'} className="w-10 h-10" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-[#111111] truncate max-w-[220px]">
                    {outputType === 'zip'
                      ? `split_${file?.name.replace(/\.[^/.]+$/, '') || 'document'}.zip`
                      : `split_${file?.name.replace(/\.[^/.]+$/, '') || 'document'}.pdf`}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <span>
                      {formatFileSize(
                        outputType === 'zip'
                          ? splitResultZip?.size || 0
                          : splitResultBytes?.byteLength || 0
                      )}
                    </span>
                    <span>â€¢</span>
                    <span className="text-emerald-700 font-semibold">
                      Pages: {extractedPageNumbers.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {outputType === 'pdf' && splitResultBytes && (
                <button
                  type="button"
                  onClick={handlePreviewPdf}
                  className="text-xs text-[#111111] font-bold hover:underline flex items-center gap-1 shrink-0 px-2 py-1 bg-white rounded-lg border border-[#E5E5E5]"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={handleDownload}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download {outputType === 'zip' ? 'ZIP Archive' : 'PDF Document'}
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  setFile(null);
                  setSplitResultBytes(null);
                  setSplitResultZip(null);
                  setProgress(0);
                }}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Split Another Document
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!file ? (
              <div className="space-y-4">
                <UploadZone
                  onFilesSelected={handleFileSelected}
                  accepts={['.pdf', 'application/pdf']}
                  acceptsDescription="PDF file"
                  maxFiles={1}
                />
                
              </div>
            ) : (
              <div className="space-y-6">
                {/* Mode Selector Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSplitMode('selected')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        splitMode === 'selected'
                          ? 'bg-[#FFC800] text-[#111111] shadow-2xs border border-[#E5E5E5]'
                          : 'text-[#6B7280] hover:text-[#111111]'
                      }`}
                    >
                      Select Pages Visually
                    </button>
                    <button
                      onClick={() => setSplitMode('range')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        splitMode === 'range'
                          ? 'bg-[#FFC800] text-[#111111] shadow-2xs border border-[#E5E5E5]'
                          : 'text-[#6B7280] hover:text-[#111111]'
                      }`}
                    >
                      Custom Range
                    </button>
                    <button
                      onClick={() => {
                        setSplitMode('all');
                        handleSelectAll();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        splitMode === 'all'
                          ? 'bg-[#FFC800] text-[#111111] shadow-2xs border border-[#E5E5E5]'
                          : 'text-[#6B7280] hover:text-[#111111]'
                      }`}
                    >
                      All Pages
                    </button>
                  </div>

                  {splitMode === 'range' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B7280]">Range:</span>
                      <input
                        type="text"
                        value={rangeInput}
                        onChange={(e) => setRangeInput(e.target.value)}
                        placeholder="e.g. 1-3, 5"
                        className="px-3 py-1 text-xs border border-[#E5E5E5] rounded-lg w-28 bg-white focus:outline-none focus:border-[#111111] font-mono"
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-[#6B7280]">
                      <span className="font-bold text-[#111111]">{selectedPages.size}</span> of {pageCount} pages selected ({selectedPagesSummary})
                    </div>
                  )}
                </div>

                {/* Visual Thumbnail Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                      Click thumbnails to select/deselect
                    </span>
                    <button
                      onClick={handleSelectAll}
                      className="text-xs font-bold text-[#111111] hover:underline"
                    >
                      Select All
                    </button>
                  </div>

                  <PageThumbnailGrid
                    totalPages={pageCount}
                    pages={pagesList}
                    allowSelection={true}
                    onToggleSelect={handleToggleSelectPage}
                    onRotatePage={(idx) =>
                      setRotations((prev) => ({ ...prev, [idx]: ((prev[idx] || 0) + 90) % 360 }))
                    }
                    onDeletePage={() => {}}
                  />
                </div>

                {/* Action Bar with PDF or ZIP split options */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E5E5E5]">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setSplitResultBytes(null);
                      setSplitResultZip(null);
                    }}
                  >
                    Change File
                  </Button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="md"
                      variant="secondary"
                      disabled={isProcessing}
                      isLoading={isProcessing && outputType === 'zip'}
                      onClick={() => handleSplit('zip')}
                      leftIcon={<ThreeDIcon name="compress" className="w-4 h-4" />}
                    >
                      Extract to ZIP
                    </Button>

                    <Button
                      size="md"
                      variant="primary"
                      disabled={isProcessing}
                      isLoading={isProcessing && outputType === 'pdf'}
                      onClick={() => handleSplit('pdf')}
                      leftIcon={<ThreeDIcon name="split" className="w-4 h-4" />}
                    >
                      Extract Selected PDF ({selectedPages.size} {selectedPages.size === 1 ? 'page' : 'pages'})
                    </Button>
                  </div>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Extracting selected pages..." />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

