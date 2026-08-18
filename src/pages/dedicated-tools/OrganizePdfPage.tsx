import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { PageThumbnailGrid } from '../../components/tools/PageThumbnailGrid';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { getPdfInfo, organizePdf, generatePdfThumbnails } from '../../lib/pdf-engine';
import { downloadBytes } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import { RotateCw, Check, Sparkles } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

import { useLocation } from 'react-router-dom';
import { FileSession } from '../../lib/file-session';

export const OrganizePdfPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'organize-pdf')!;
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  
  // Page state: array of page items representing ordered pages
  const [pagesOrder, setPagesOrder] = useState<number[]>([]);
  const [deletedIndices, setDeletedIndices] = useState<Set<number>>(new Set());
  const [rotations, setRotations] = useState<{ [pageIndex: number]: number }>({});
  const [thumbnails, setThumbnails] = useState<{ [pageIndex: number]: string }>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [organizedBytes, setOrganizedBytes] = useState<Uint8Array | null>(null);
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
      const total = info.pageCount || 4;
      setPageCount(total);
      setPagesOrder(Array.from({ length: total }, (_, i) => i));
      setDeletedIndices(new Set());
      setRotations({});

      // Asynchronously render real page thumbnails progressively
      generatePdfThumbnails(selected, (pageIdx, dataUrl) => {
        setThumbnails((prev) => ({ ...prev, [pageIdx]: dataUrl }));
      });
    } catch {
      setPageCount(4);
      setPagesOrder([0, 1, 2, 3]);
    }
  };

const handleRotatePage = (index: number) => {
    setRotations((prev) => ({
      ...prev,
      [index]: ((prev[index] || 0) + 90) % 360,
    }));
  };

  const handleDeletePage = (index: number) => {
    setDeletedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    toast.info('Page removed. Click Save to finalize.');
  };

  const handleMovePage = (fromIndex: number, toIndex: number) => {
    const visiblePages = pagesOrder.filter((idx) => !deletedIndices.has(idx));
    if (
      fromIndex < 0 ||
      fromIndex >= visiblePages.length ||
      toIndex < 0 ||
      toIndex >= visiblePages.length
    ) {
      return;
    }
    const nextVisible = [...visiblePages];
    const [moved] = nextVisible.splice(fromIndex, 1);
    nextVisible.splice(toIndex, 0, moved);
    setPagesOrder(nextVisible);
  };

  const handleRotateAll = () => {
    const nextRotations: { [idx: number]: number } = {};
    pagesOrder.forEach((idx) => {
      nextRotations[idx] = ((rotations[idx] || 0) + 90) % 360;
    });
    setRotations(nextRotations);
    toast.success('Rotated all pages 90° clockwise');
  };

  const handleOrganize = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const result = await organizePdf(
        file,
        pagesOrder,
        Array.from(deletedIndices),
        rotations
      );
      setProgress(95);
      await new Promise((r) => setTimeout(r, 300));
      setProgress(100);

      setOrganizedBytes(result);
      DocumentStorage.saveDocument({
        name: `Organized_${file.name}`,
        size: result.byteLength,
        type: 'application/pdf',
        data: result,
      });
      toast.success('PDF organized successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to organize PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (organizedBytes && file) {
      const base = file.name.replace(/\.[^/.]+$/, '');
      downloadBytes(organizedBytes, `organized_${base}.pdf`, 'application/pdf');
    }
  };

  const activePages = pagesOrder
    .filter((pageIdx) => !deletedIndices.has(pageIdx))
    .map((pageIdx) => ({
      index: pageIdx,
      pageNumber: pageIdx + 1,
      rotation: rotations[pageIdx] || 0,
      isDeleted: false,
      thumbnail: thumbnails[pageIdx],
    }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask" />
      <SeoHead
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Organize PDF' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Organize PDF pages
        </h1>
        <p className="text-sm text-[#6B7280]">
          Drag to reorder pages, rotate sideways sheets, or delete unwanted pages in seconds.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs relative z-10">
        {organizedBytes ? (
          <ResultDownloadCard
            filename={`organized_${file?.name.replace(/\.[^/.]+$/, '') || 'document'}.pdf`}
            fileSize={organizedBytes.byteLength}
            onDownload={handleDownload}
            onStartOver={() => {
              setFile(null);
              setOrganizedBytes(null);
              setProgress(0);
            }}
          />
        ) : (
          <>
            {!file ? (
              <div className="space-y-4">
                <UploadZone
                  onFilesSelected={handleFileSelected}
                  accepts={['.pdf', 'application/pdf']}
                  acceptsDescription="PDF document"
                  maxFiles={1}
                />
                
              </div>
            ) : (
              <div className="space-y-6">
                {/* Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                    <p className="text-xs text-[#6B7280]">
                      {activePages.filter((p) => !p.isDeleted).length} active pages ({deletedIndices.size} deleted)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRotateAll}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-white border border-[#E5E5E5] hover:bg-[#EAEAEA] rounded-lg text-[#111111] shadow-2xs"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Rotate All
                    </button>
                    {deletedIndices.size > 0 && (
                      <button
                        type="button"
                        onClick={() => setDeletedIndices(new Set())}
                        className="text-xs font-bold text-[#111111] hover:underline px-2"
                      >
                        Reset Deleted
                      </button>
                    )}
                  </div>
                </div>

                {/* Page Grid */}
                <PageThumbnailGrid
                  totalPages={pageCount}
                  pages={activePages}
                  onRotatePage={handleRotatePage}
                  onDeletePage={handleDeletePage}
                  onMovePage={handleMovePage}
                />

                {/* Bottom Action Bar */}
                <div className="flex justify-between items-center pt-4 border-t border-[#E5E5E5]">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setOrganizedBytes(null);
                    }}
                  >
                    Change File
                  </Button>

                  <Button
                    size="lg"
                    variant="primary"
                    disabled={isProcessing || activePages.every((p) => p.isDeleted)}
                    isLoading={isProcessing}
                    onClick={handleOrganize}
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    Save & Download PDF
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Applying page reorder and rotation rules..." />
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

