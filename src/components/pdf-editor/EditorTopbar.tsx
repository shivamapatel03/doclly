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
  <div className="flex items-center justify-between gap-2 bg-white border-b border-[#E5E5E5] px-4 h-12 shrink-0 select-none z-20">
    {/* Left: Back + File Name + Auto-saved */}
    <div className="flex items-center gap-3 min-w-0">
      <button
        onClick={onBack}
        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer shrink-0"
        title="Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-semibold text-[#111111] truncate max-w-[130px] sm:max-w-xs" title={fileName}>
        {fileName}
      </span>
      <span className="text-xs text-[#9CA3AF] shrink-0 hidden sm:block">
        Page {activePage + 1} / {totalPages}
      </span>
      <span className="text-[11px] text-emerald-600 font-medium hidden lg:flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Auto-saved
      </span>
    </div>

    {/* Center: Undo/Redo + Zoom + Fullscreen */}
    <div className="flex items-center gap-1">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${canUndo ? "hover:bg-[#F5F5F5] text-[#111111]" : "text-[#D1D5DB] cursor-not-allowed"}`}
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${canRedo ? "hover:bg-[#F5F5F5] text-[#111111]" : "text-[#D1D5DB] cursor-not-allowed"}`}
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-[#E5E5E5] mx-1" />

      <button onClick={onZoomOut} title="Zoom Out (or Ctrl + Wheel Down)" className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={onFitScreen}
        title="Click to Fit Page to Screen"
        className="text-xs font-mono font-semibold text-[#111111] hover:bg-[#F5F5F5] px-1.5 py-0.5 rounded cursor-pointer transition-colors"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button onClick={onZoomIn} title="Zoom In (or Ctrl + Wheel Up)" className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-[#E5E5E5] mx-1" />

      {/* Fullscreen Toggle Button */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Full Screen (Esc)" : "Full Screen Mode"}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isFullscreen
            ? "bg-[#111111] text-white hover:bg-black"
            : "hover:bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111]"
        }`}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>
    </div>

    {/* Right: Detect & Edit Text + Apply Changes + Download */}
    <div className="flex items-center gap-2">
      {onDetectText && (
        <button
          onClick={onDetectText}
          disabled={isDetecting}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
            isDetectionActive
              ? "bg-[#111111] text-[#FFC800] ring-2 ring-[#FFC800]"
              : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300"
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
          className="flex items-center gap-1 bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#111111] text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-[#E5E5E5]"
          title="Apply & Save Canvas Changes"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
          <span className="hidden sm:inline">Apply</span>
        </button>
      )}

      <button
        onClick={onDownload}
        disabled={isExporting}
        className="flex items-center gap-1.5 bg-[#FFC800] hover:bg-[#f0b800] disabled:bg-[#FFF0A0] text-[#111111] text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {isExporting ? "Exporting..." : "Download PDF"}
      </button>
    </div>
  </div>
);
