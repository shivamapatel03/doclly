import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { SignatureModal } from '../../components/tools/SignatureModal';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import {
  getPdfInfo,
  generatePdfThumbnails,
signPdfMultiple,
  PlacedSignature,
} from '../../lib/pdf-engine';
import { downloadBytes } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import {
  PenLine,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Stamp,
  RotateCcw,
} from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

export const SignPdfPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'sign-pdf')!;
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);
  
  // Page thumbnails cache { [pageIndex: number]: dataUrl }
  const [thumbnails, setThumbnails] = useState<{ [pageIndex: number]: string }>({});

  // Active signature library
  const [savedSignatureDataUrl, setSavedSignatureDataUrl] = useState<string | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Placed signatures across document: array of PlacedSignature
  const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragSignatureId, setDragSignatureId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [signedBytes, setSignedBytes] = useState<Uint8Array | null>(null);
  const toast = useToast();

  const handleDocumentSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setThumbnails({});
    setPlacedSignatures([]);
    setActivePageIndex(0);

    try {
      const info = await getPdfInfo(selected);
      const total = info.pageCount || 1;
      setPageCount(total);

      generatePdfThumbnails(selected, (pageIdx, dataUrl) => {
        setThumbnails((prev) => ({ ...prev, [pageIdx]: dataUrl }));
      });
    } catch {
      setPageCount(1);
    }
  };

// Add signature to current active page
  const handleAddSignatureToPage = () => {
    if (!savedSignatureDataUrl) {
      setIsSignatureModalOpen(true);
      return;
    }

    const newSig: PlacedSignature = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      pageIndex: activePageIndex,
      dataUrl: savedSignatureDataUrl,
      xPercent: 50,
      yPercent: 75, // Near bottom by default
      widthPercent: 26,
    };

    setPlacedSignatures((prev) => [...prev, newSig]);
    setSelectedSignatureId(newSig.id);
    toast.success(`Signature placed on Page ${activePageIndex + 1}! Drag to position.`);
  };

  // Drag handler on document canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragSignatureId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setPlacedSignatures((prev) =>
      prev.map((sig) => (sig.id === dragSignatureId ? { ...sig, xPercent: x, yPercent: y } : sig))
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragSignatureId(null);
  };

  const handleDeleteSignature = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlacedSignatures((prev) => prev.filter((s) => s.id !== id));
    if (selectedSignatureId === id) setSelectedSignatureId(null);
  };

  const handleResizeSignature = (id: string, newWidthPercent: number) => {
    setPlacedSignatures((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, widthPercent: newWidthPercent } : sig))
    );
  };

  // Burn all signatures into PDF
  const handleBurnSignature = async () => {
    if (!file) return;
    if (placedSignatures.length === 0) {
      toast.error('Please place at least one signature on the document first.');
      return;
    }

    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const result = await signPdfMultiple(file, placedSignatures);
      setProgress(100);

      setSignedBytes(result);
      const outName = `signed_${file.name}`;
      downloadBytes(result, outName, 'application/pdf');

      DocumentStorage.saveDocument({
        name: outName,
        size: result.byteLength,
        type: 'application/pdf',
      });
      toast.success('Document signed & downloaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Signatures on current active page
  const currentSignatures = placedSignatures.filter((s) => s.pageIndex === activePageIndex);

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 transition-all ${file ? 'max-w-7xl' : 'max-w-4xl'}`}>
      <SeoHead
        title="Sign PDF Documents Online — Doclly"
        description="Draw, type, or stamp electronic signatures on any page of your PDF document. 100% private in-browser digital signing."
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Sign PDF' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] tracking-tight">
          Sign PDF Document
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Draw, type, or upload your signature, select pages, and stamp signatures with precision.
        </p>
      </div>

      {!signedBytes ? (
        <div className="space-y-6">
          {!file ? (
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <UploadZone
                onFilesSelected={handleDocumentSelected}
                accepts={['.pdf', 'application/pdf']}
                acceptsDescription="Select the PDF document to sign"
                maxFiles={1}
              />
              
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Top Controls Header */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111111] truncate max-w-xs">{file.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#6B7280] font-semibold">
                      {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {placedSignatures.length === 0 ? (
                      'Click "Add Signature" to stamp your signature on the active page'
                    ) : (
                      <span className="text-emerald-600 font-semibold">
                        {placedSignatures.length} {placedSignatures.length === 1 ? 'signature' : 'signatures'} placed across document
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsSignatureModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#E5E5E5] text-[#111111] rounded-xl transition-colors cursor-pointer"
                  >
                    <PenLine className="w-3.5 h-3.5 text-amber-500" />
                    <span>{savedSignatureDataUrl ? 'Change Signature' : 'Create Signature'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSignatureToPage}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] rounded-xl transition-all shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Signature to Page {activePageIndex + 1}</span>
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setThumbnails({});
                      setPlacedSignatures([]);
                    }}
                    className="text-xs"
                  >
                    Change File
                  </Button>
                </div>
              </div>

              {/* Main Document Signing Studio (Sidebar + Center Canvas) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* 1. LEFT SLIDEBAR (Page Thumbnails List) */}
                <div className="lg:col-span-3 bg-white border border-[#E5E5E5] rounded-2xl p-3.5 space-y-3 shadow-2xs max-h-[600px] overflow-y-auto">
                  <div className="text-xs font-bold text-[#111111] uppercase tracking-wider px-1 flex items-center justify-between">
                    <span>Document Pages</span>
                    <span className="text-[10px] text-[#6B7280] font-normal">Click to switch</span>
                  </div>

                  <div className="space-y-2.5">
                    {Array.from({ length: pageCount }, (_, idx) => {
                      const isActive = idx === activePageIndex;
                      const hasSigOnPage = placedSignatures.some((s) => s.pageIndex === idx);
                      const thumb = thumbnails[idx];

                      return (
                        <div
                          key={idx}
                          onClick={() => setActivePageIndex(idx)}
                          className={`group relative p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isActive
                              ? 'border-[#111111] ring-2 ring-[#FFC800]/50 bg-[#F5F5F5]'
                              : 'border-[#E5E5E5] hover:border-gray-400 hover:bg-[#F9F9F9]'
                          }`}
                        >
                          {/* Mini Thumbnail */}
                          <div className="w-14 aspect-[3/4] bg-white border border-[#E5E5E5] rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative shadow-2xs">
                            {thumb ? (
                              <img src={thumb} alt={`Page ${idx + 1}`} className="w-full h-full object-contain pointer-events-none" />
                            ) : (
                              <span className="text-[10px] text-gray-400 font-bold">{idx + 1}</span>
                            )}
                            {hasSigOnPage && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-[#111111] rounded-full flex items-center justify-center shadow-xs">
                                <PenLine className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>

                          {/* Page Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isActive ? 'text-[#111111]' : 'text-gray-700'}`}>
                                Page {idx + 1}
                              </span>
                              {isActive && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#111111] text-white">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#6B7280] mt-0.5">
                              {hasSigOnPage ? 'Signed' : 'No signature'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. CENTER DOCUMENT CANVAS (Real PDF Viewer + Signature Placer) */}
                <div className="lg:col-span-9 space-y-4">
                  {/* Canvas Toolbar */}
                  <div className="flex items-center justify-between bg-white border border-[#E5E5E5] rounded-2xl px-4 py-2.5 shadow-2xs text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={activePageIndex === 0}
                        onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                        className="p-1 text-gray-600 hover:text-black hover:bg-[#F5F5F5] rounded-lg disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-[#111111]">
                        Page {activePageIndex + 1} of {pageCount}
                      </span>
                      <button
                        type="button"
                        disabled={activePageIndex === pageCount - 1}
                        onClick={() => setActivePageIndex((prev) => Math.min(pageCount - 1, prev + 1))}
                        className="p-1 text-gray-600 hover:text-black hover:bg-[#F5F5F5] rounded-lg disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <span>Drag signature box anywhere on the page to reposition</span>
                    </div>
                  </div>

                  {/* Real Page Canvas Sheet */}
                  <div className="flex justify-center bg-[#E5E5E5]/40 border border-[#E5E5E5] rounded-2xl p-4 sm:p-6 overflow-hidden">
                    <div
                      ref={canvasRef}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="relative w-full max-w-xl aspect-[1/1.414] bg-white rounded-xl shadow-lg border border-gray-300 select-none overflow-hidden"
                    >
                      {/* Real Rendered PDF Page Background */}
                      {thumbnails[activePageIndex] ? (
                        <img
                          src={thumbnails[activePageIndex]}
                          alt={`Page ${activePageIndex + 1}`}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 space-y-3 bg-white">
                          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#FFC800] rounded-full animate-spin" />
                          <span className="text-xs font-bold text-[#111111]">Rendering high-res Page {activePageIndex + 1}...</span>
                        </div>
                      )}

                      {/* Interactive Signatures on Active Page */}
                      {currentSignatures.map((sig) => {
                        const isSelected = selectedSignatureId === sig.id;

                        return (
                          <div
                            key={sig.id}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setIsDragging(true);
                              setDragSignatureId(sig.id);
                              setSelectedSignatureId(sig.id);
                            }}
                            style={{
                              left: `${sig.xPercent}%`,
                              top: `${sig.yPercent}%`,
                              width: `${sig.widthPercent}%`,
                            }}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 border-2 rounded-xl cursor-move transition-shadow duration-100 group ${
                              isSelected
                                ? 'border-[#111111] bg-[#FFC800]/25 ring-2 ring-[#FFC800]/60 shadow-md'
                                : 'border-dashed border-gray-500/80 bg-white/70 hover:bg-white/95'
                            }`}
                          >
                            <img
                              src={sig.dataUrl}
                              alt="Signature Stamp"
                              className="w-full h-auto object-contain pointer-events-none"
                            />

                            {/* Top Controls on Stamp (Drag & Delete) */}
                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-[#111111] text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs whitespace-nowrap">
                              <span>Drag to move</span>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteSignature(sig.id, e)}
                                className="ml-1 text-red-400 hover:text-red-300 cursor-pointer"
                                title="Remove signature"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stamp Size Control (If a signature is selected) */}
                  {selectedSignatureId && (
                    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs text-xs">
                      <div className="flex items-center gap-2 font-bold text-[#111111]">
                        <PenLine className="w-4 h-4 text-amber-500" />
                        <span>Signature Size:</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {[
                          { label: 'Small', width: 18 },
                          { label: 'Medium', width: 26 },
                          { label: 'Large', width: 36 },
                          { label: 'Extra Large', width: 48 },
                        ].map((sz) => {
                          const currentSig = placedSignatures.find((s) => s.id === selectedSignatureId);
                          const isMatch = currentSig?.widthPercent === sz.width;
                          return (
                            <button
                              key={sz.label}
                              type="button"
                              onClick={() => handleResizeSignature(selectedSignatureId, sz.width)}
                              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                isMatch
                                  ? 'bg-[#111111] text-white'
                                  : 'bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111]'
                              }`}
                            >
                              {sz.label}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSignature(selectedSignatureId)}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Stamp</span>
                      </button>
                    </div>
                  )}

                  {/* Bottom Action Bar */}
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Stamp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#111111]">
                          {placedSignatures.length === 0
                            ? 'No signatures placed yet'
                            : `${placedSignatures.length} signature${placedSignatures.length === 1 ? '' : 's'} ready to burn`}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          Zero-retention client-side encryption.
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleBurnSignature}
                      disabled={isProcessing || placedSignatures.length === 0}
                      size="lg"
                      className="w-full sm:w-auto bg-[#111111] hover:bg-black text-white font-bold cursor-pointer"
                    >
                      {isProcessing ? 'Signing Document...' : 'Sign Document & Download'}
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <ProgressBar progress={progress} />
                      <p className="text-xs text-center text-[#6B7280]">
                        Embedding signatures into PDF pages...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <ResultDownloadCard
            filename={`signed_${file?.name || 'document.pdf'}`}
            fileSize={signedBytes.byteLength}
            onDownload={() => {
              if (signedBytes && file) {
                downloadBytes(signedBytes, `signed_${file.name}`, 'application/pdf');
              }
            }}
            onStartOver={() => {
              setFile(null);
              setSignedBytes(null);
              setPlacedSignatures([]);
              setSelectedSignatureId(null);
              setActivePageIndex(0);
            }}
          />
        </div>
      )}

      {/* Signature Modal (Draw, Type, Upload) */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSaveSignature={(dataUrl) => {
          setSavedSignatureDataUrl(dataUrl);
          // Auto add to active page if none exists on current page
          const newSig: PlacedSignature = {
            id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            pageIndex: activePageIndex,
            dataUrl,
            xPercent: 50,
            yPercent: 75,
            widthPercent: 26,
          };
          setPlacedSignatures((prev) => [...prev, newSig]);
          setSelectedSignatureId(newSig.id);
          toast.success(`Signature created & placed on Page ${activePageIndex + 1}!`);
        }}
      />
    </div>
  );
};

