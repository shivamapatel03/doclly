import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import {
  getPdfInfo,
  generatePdfThumbnails,
watermarkPdf,
} from '../../lib/pdf-engine';
import { downloadBytes } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import {
  Stamp,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCw,
  Palette,
  Sliders,
  Type,
} from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';
import { useLocation } from 'react-router-dom';
import { FileSession } from '../../lib/file-session';

const WATERMARK_PRESETS = [
  'CONFIDENTIAL',
  'DRAFT',
  'DO NOT COPY',
  'SAMPLE',
  'TOP SECRET',
  'APPROVED',
  'PRIVATE',
];

const COLOR_OPTIONS = [
  { name: 'Dark Gray', hex: '#111111', rgb: { r: 0.1, g: 0.1, b: 0.1 } },
  { name: 'Crimson Red', hex: '#DC2626', rgb: { r: 0.86, g: 0.15, b: 0.15 } },
  { name: 'Navy Blue', hex: '#2563EB', rgb: { r: 0.15, g: 0.39, b: 0.92 } },
  { name: 'Forest Green', hex: '#059669', rgb: { r: 0.02, g: 0.59, b: 0.41 } },
  { name: 'Amber Gold', hex: '#D97706', rgb: { r: 0.85, g: 0.47, b: 0.02 } },
];

export const WatermarkPdfPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'watermark-pdf')!;
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Real page thumbnails cache
  const [thumbnails, setThumbnails] = useState<{ [pageIndex: number]: string }>({});

  useEffect(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    if (f && f.name.toLowerCase().endsWith('.pdf') && !file) {
      handleDocumentSelected([f]);
    }
  }, []);

  // Watermark parameters
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [angle, setAngle] = useState(45);
  const [fontSize, setFontSize] = useState(42);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkedBytes, setWatermarkedBytes] = useState<Uint8Array | null>(null);
  const toast = useToast();

  const handleDocumentSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setThumbnails({});
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

const handleApplyWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const bytes = await watermarkPdf(file, watermarkText.trim(), {
        opacity,
        fontSize,
        rotation: angle,
        color: selectedColor.rgb,
      });
      setProgress(100);

      setWatermarkedBytes(bytes);
      const outName = `watermarked_${file.name}`;

      DocumentStorage.saveDocument({
        name: outName,
        size: bytes.byteLength,
        type: 'application/pdf',
      });
      toast.success('Watermark stamped onto all pages successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to watermark PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 transition-all ${file ? 'max-w-7xl' : 'max-w-4xl'}`}>
      <SeoHead
        title="Watermark PDF Documents Online — Doclly"
        description="Add custom text watermarks to any PDF document. Live interactive page preview with rotation, opacity, and color styling."
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Watermark PDF' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] tracking-tight">
          Watermark PDF Documents
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Protect confidential files with live-preview text stamps, custom opacity, and angles.
        </p>
      </div>

      {!watermarkedBytes ? (
        <div className="space-y-6">
          {!file ? (
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <UploadZone
                onFilesSelected={handleDocumentSelected}
                accepts={['.pdf', 'application/pdf']}
                acceptsDescription="Select the PDF document to watermark"
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
                    Watermark &ldquo;<span className="font-bold text-[#111111]">{watermarkText || 'CONFIDENTIAL'}</span>&rdquo; will be stamped across all {pageCount} pages.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setThumbnails({});
                      setWatermarkedBytes(null);
                    }}
                    className="text-xs"
                  >
                    Change File
                  </Button>
                </div>
              </div>

              {/* Main Studio Grid (Sidebar + Live Canvas + Controls Panel) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* 1. LEFT SLIDEBAR (Page Thumbnails Strip) */}
                <div className="lg:col-span-3 bg-white border border-[#E5E5E5] rounded-2xl p-3.5 space-y-3 shadow-2xs max-h-[620px] overflow-y-auto">
                  <div className="text-xs font-bold text-[#111111] uppercase tracking-wider px-1 flex items-center justify-between">
                    <span>Pages Preview</span>
                    <span className="text-[10px] text-[#6B7280] font-normal">Click to view</span>
                  </div>

                  <div className="space-y-2.5">
                    {Array.from({ length: pageCount }, (_, idx) => {
                      const isActive = idx === activePageIndex;
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
                          {/* Mini Thumbnail with Real Overlay */}
                          <div className="w-14 aspect-[3/4] bg-white border border-[#E5E5E5] rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative shadow-2xs">
                            {thumb ? (
                              <img src={thumb} alt={`Page ${idx + 1}`} className="w-full h-full object-contain pointer-events-none" />
                            ) : (
                              <span className="text-[10px] text-gray-400 font-bold">{idx + 1}</span>
                            )}
                            {/* Watermark Mini Indicator */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span
                                style={{
                                  color: selectedColor.hex,
                                  opacity: opacity * 0.8,
                                  transform: `rotate(${angle}deg)`,
                                }}
                                className="text-[6px] font-extrabold uppercase truncate max-w-[45px]"
                              >
                                {watermarkText || 'SAMPLE'}
                              </span>
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isActive ? 'text-[#111111]' : 'text-gray-700'}`}>
                                Page {idx + 1}
                              </span>
                              {isActive && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#111111] text-white">
                                  PREVIEW
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#6B7280] mt-0.5">Watermark active</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. CENTER REAL PDF CANVAS WITH LIVE WATERMARK OVERLAY */}
                <div className="lg:col-span-5 space-y-4">
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

                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </div>
                  </div>

                  {/* Real Page Canvas Sheet with Dynamic Rotating Watermark */}
                  <div className="flex justify-center bg-[#E5E5E5]/40 border border-[#E5E5E5] rounded-2xl p-4 sm:p-6 overflow-hidden">
                    <div className="relative w-full max-w-md aspect-[1/1.414] bg-white rounded-xl shadow-lg border border-gray-300 select-none overflow-hidden flex items-center justify-center">
                      {/* Real PDF Background Image */}
                      {thumbnails[activePageIndex] ? (
                        <img
                          src={thumbnails[activePageIndex]}
                          alt={`Page ${activePageIndex + 1}`}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 space-y-3 bg-white">
                          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#FFC800] rounded-full animate-spin" />
                          <span className="text-xs font-bold text-[#111111]">Loading Page {activePageIndex + 1}...</span>
                        </div>
                      )}

                      {/* Dynamic Live Watermark Stamp */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                        <div
                          style={{
                            color: selectedColor.hex,
                            opacity: opacity,
                            transform: `rotate(${angle}deg)`,
                            fontSize: `${fontSize * 0.55}px`,
                          }}
                          className="font-extrabold uppercase tracking-widest text-center whitespace-nowrap select-none drop-shadow-xs transition-all duration-100"
                        >
                          {watermarkText || 'WATERMARK'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. RIGHT CONTROLS PANEL (Styling, Colors, Presets, Sliders) */}
                <div className="lg:col-span-4 bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-5 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#111111] pb-2 border-b border-[#E5E5E5]">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    <span>Watermark Customization</span>
                  </div>

                  {/* Watermark Text Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                      Stamp Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. CONFIDENTIAL"
                      className="w-full h-10 px-3 text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FFC800] font-semibold"
                    />

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {WATERMARK_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setWatermarkText(preset)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
                            watermarkText === preset
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-[#F5F5F5] text-[#6B7280] border-[#E5E5E5] hover:text-[#111111]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                      Stamp Color
                    </label>
                    <div className="flex items-center gap-2">
                      {COLOR_OPTIONS.map((c) => {
                        const isSelected = selectedColor.name === c.name;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            style={{ backgroundColor: c.hex }}
                            className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                              isSelected ? 'ring-2 ring-offset-2 ring-[#111111] scale-110' : 'hover:scale-105'
                            }`}
                            title={c.name}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Opacity Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                      <span>Opacity</span>
                      <span className="text-[#6B7280]">{Math.round(opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full accent-[#FFC800] cursor-pointer"
                    />
                  </div>

                  {/* Rotation Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                      <span>Rotation Angle</span>
                      <span className="text-[#6B7280]">{angle}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="15"
                      value={angle}
                      onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                      className="w-full accent-[#FFC800] cursor-pointer"
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                      <span>Font Size</span>
                      <span className="text-[#6B7280]">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="72"
                      step="2"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                      className="w-full accent-[#FFC800] cursor-pointer"
                    />
                  </div>

                  {/* Apply Button */}
                  <div className="pt-2">
                    <Button
                      onClick={handleApplyWatermark}
                      disabled={isProcessing || !watermarkText.trim()}
                      size="lg"
                      className="w-full bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] font-bold cursor-pointer shadow-2xs"
                    >
                      {isProcessing ? 'Watermarking...' : 'Stamp Watermark & Download'}
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2 pt-2">
                      <ProgressBar progress={progress} />
                      <p className="text-xs text-center text-[#6B7280]">
                        Stamping watermark across all {pageCount} pages...
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
            filename={`watermarked_${file?.name || 'document.pdf'}`}
            fileSize={watermarkedBytes.byteLength}
            onDownload={() => {
              if (watermarkedBytes && file) {
                downloadBytes(watermarkedBytes, `watermarked_${file.name}`, 'application/pdf');
              }
            }}
            onStartOver={() => {
              setFile(null);
              setWatermarkedBytes(null);
              setThumbnails({});
              setActivePageIndex(0);
            }}
          />
        </div>
      )}
    </div>
  );
};

