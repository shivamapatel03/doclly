import React from "react";
import { Undo2, Redo2, ZoomIn, ZoomOut, Download, ArrowLeft, Loader2 } from "lucide-react";

interface EditorTopbarProps {
  fileName: string;
  activePage: number;
  totalPages: number;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  isExporting: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
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
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onDownload,
  onBack,
}) => (
  <div className="flex items-center justify-between gap-2 bg-white border-b border-[#E5E5E5] px-4 h-12 shrink-0">
    {/* Left: Back + File Name */}
    <div className="flex items-center gap-3 min-w-0">
      <button
        onClick={onBack}
        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer shrink-0"
        title="Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-semibold text-[#111111] truncate max-w-[160px] sm:max-w-xs" title={fileName}>
        {fileName}
      </span>
      <span className="text-xs text-[#9CA3AF] shrink-0 hidden sm:block">
        Page {activePage + 1} / {totalPages}
      </span>
    </div>

    {/* Center: Undo/Redo + Zoom */}
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

      <button onClick={onZoomOut} title="Zoom Out" className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">
        <ZoomOut className="w-4 h-4" />
      </button>
      <span className="text-xs font-mono text-[#6B7280] w-10 text-center">{Math.round(zoom * 100)}%</span>
      <button onClick={onZoomIn} title="Zoom In" className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>

    {/* Right: Download */}
    <button
      onClick={onDownload}
      disabled={isExporting}
      className="flex items-center gap-1.5 bg-[#FFC800] hover:bg-[#f0b800] disabled:bg-[#FFF0A0] text-[#111111] text-sm font-bold px-4 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {isExporting ? "Exporting..." : "Download PDF"}
    </button>
  </div>
);
