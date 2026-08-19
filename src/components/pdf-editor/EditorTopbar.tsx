import React from "react";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  ArrowLeft,
  Loader2,
  Maximize,
  Minimize,
  Check,
  ScanText,
} from "lucide-react";

interface EditorTopbarProps {
  fileName: string;
  activePage: number;
  totalPages: number;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  isExporting: boolean;
  isFullscreen: boolean;
  isDetecting?: boolean;
  isDetectionActive?: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen?: () => void;
  onToggleFullscreen: () => void;
  onDetectText?: () => void;
  onApplyChanges?: () => void;
  onDownload: () => void;
  onBack: () => void;
}

export const EditorTopbar: React.FC<EditorTopbarProps> = ({
  fileName,
  activePage,
  totalPages,
  zoom,
  canUndo,
  canRedo,
  isExporting,
  isFullscreen,
  isDetecting,
  isDetectionActive,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onToggleFullscreen,
  onDetectText,
  onApplyChanges,
  onDownload,
  onBack,
}) => (
  <div className="flex items-center justify-between gap-2 bg-white border-b border-[#E5E5E5] px-4 h-13 shrink-0 select-none z-20 shadow-2xs">
    {/* Left: Back + File Name + Auto-saved */}
    <div className="flex items-center gap-2.5 min-w-0">
      <button
        onClick={onBack}
        className="p-1.5 rounded-full hover:bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] border border-transparent hover:border-[#E5E5E5] transition-all cursor-pointer shrink-0"
        title="Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <span className="text-xs sm:text-sm font-bold text-[#111111] truncate max-w-[130px] sm:max-w-xs" title={fileName}>
        {fileName}
      </span>
      <span className="text-xs text-[#9CA3AF] shrink-0 hidden sm:block font-medium">
        Page {activePage + 1} / {totalPages}
      </span>
      <span className="text-[11px] text-emerald-800 font-bold hidden lg:flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.04)] shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Auto-saved
      </span>
    </div>

    {/* Center: Undo/Redo + Zoom + Fullscreen */}
    <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#E5E7EB] px-1.5 py-1 rounded-full shadow-2xs">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className={`p-1.5 rounded-full transition-all cursor-pointer ${
          canUndo ? "hover:bg-white text-[#111111] hover:shadow-2xs" : "text-[#D1D5DB] cursor-not-allowed"
        }`}
      >
        <Undo2 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className={`p-1.5 rounded-full transition-all cursor-pointer ${
          canRedo ? "hover:bg-white text-[#111111] hover:shadow-2xs" : "text-[#D1D5DB] cursor-not-allowed"
        }`}
      >
        <Redo2 className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-[#E5E7EB] mx-0.5" />

      <button onClick={onZoomOut} title="Zoom Out (or Ctrl + Wheel Down)" className="p-1.5 rounded-full hover:bg-white text-[#6B7280] hover:text-[#111111] hover:shadow-2xs transition-all cursor-pointer">
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onFitScreen}
        title="Click to Fit Page to Screen"
        className="text-[11px] font-mono font-bold text-[#111111] hover:bg-white px-2 py-0.5 rounded-full hover:shadow-2xs cursor-pointer transition-all"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button onClick={onZoomIn} title="Zoom In (or Ctrl + Wheel Up)" className="p-1.5 rounded-full hover:bg-white text-[#6B7280] hover:text-[#111111] hover:shadow-2xs transition-all cursor-pointer">
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-[#E5E7EB] mx-0.5" />

      {/* Fullscreen Toggle Button */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Full Screen (Esc)" : "Full Screen Mode"}
        className={`p-1.5 rounded-full transition-all cursor-pointer ${
          isFullscreen
            ? "bg-[#111111] text-white hover:bg-black shadow-2xs"
            : "hover:bg-white text-[#6B7280] hover:text-[#111111] hover:shadow-2xs"
        }`}
      >
        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
      </button>
    </div>

    {/* Right: Detect & Edit Text + Apply Changes + Download */}
    <div className="flex items-center gap-2">
      {onDetectText && (
        <button
          onClick={onDetectText}
          disabled={isDetecting}
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
            isDetectionActive
              ? "bg-[#111111] text-[#FFC800] border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.2)]"
              : "bg-amber-50 bg-gradient-to-b from-white/60 to-transparent hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(217,119,6,0.1),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_8px_rgba(217,119,6,0.15)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
          }`}
          title="Auto-detect existing text on page to erase & edit in-place"
        >
          {isDetecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
          ) : (
            <ScanText className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span className="hidden sm:inline">
            {isDetecting ? "Detecting..." : isDetectionActive ? "Text Mode" : "Detect & Edit Text"}
          </span>
        </button>
      )}

      {onApplyChanges && (
        <button
          onClick={onApplyChanges}
          className="flex items-center gap-1.5 bg-[#F5F5F5] bg-gradient-to-b from-white/80 to-transparent hover:bg-[#EAEAEA] active:bg-[#E0E0E0] text-[#111111] text-xs font-bold px-3 sm:px-3.5 py-1.5 rounded-full transition-all cursor-pointer border border-[#D5D5D5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_8px_rgba(0,0,0,0.08)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] select-none"
          title="Apply & Save Canvas Changes"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
          <span className="hidden sm:inline">Apply</span>
        </button>
      )}

      <button
        onClick={onDownload}
        disabled={isExporting}
        className="flex items-center gap-1.5 bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-1.5 rounded-full transition-all cursor-pointer shrink-0 disabled:opacity-50 select-none"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {isExporting ? "Exporting..." : "Download PDF"}
      </button>
    </div>
  </div>
);
