import React from 'react';
import { RotateCw, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export interface PageItem {
  index: number; // 0-based original index
  pageNumber: number;
  rotation: number;
  isDeleted: boolean;
  isSelected?: boolean;
  thumbnail?: string; // High quality rendered image data URL
}

interface PageThumbnailGridProps {
  totalPages: number;
  pages: PageItem[];
  onRotatePage: (pageIndex: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
  onToggleSelect?: (pageIndex: number) => void;
  allowSelection?: boolean;
}

export const PageThumbnailGrid: React.FC<PageThumbnailGridProps> = ({
  pages,
  onRotatePage,
  onDeletePage,
  onMovePage,
  onToggleSelect,
  allowSelection = false,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {pages.map((page, arrayIndex) => {
        if (page.isDeleted) return null;

        return (
          <div
            key={`page-${page.index}`}
            onClick={() => allowSelection && onToggleSelect && onToggleSelect(page.index)}
            className={`group relative flex flex-col items-center bg-white rounded-xl border transition-all p-3 select-none ${
              page.isSelected
                ? 'border-[#111111] ring-2 ring-[#FFC800]/50 bg-[#FFC800]/10 shadow-2xs'
                : 'border-[#E5E5E5] hover:border-gray-400 hover:shadow-xs'
            } ${allowSelection ? 'cursor-pointer' : ''}`}
          >
            {/* Selection Checkbox */}
            {allowSelection && (
              <div
                className={`absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center border transition-colors z-20 ${
                  page.isSelected
                    ? 'bg-[#FFC800] border-[#111111] text-[#111111] shadow-2xs'
                    : 'bg-white/90 backdrop-blur-xs border-[#E5E5E5] text-transparent group-hover:border-gray-400'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            {/* Page Canvas / Real Thumbnail Image with Rotation & Buffer Loader */}
            <div className="w-full aspect-[3/4] bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg relative overflow-hidden my-1 flex items-center justify-center shadow-2xs">
              <div
                className="w-full h-full flex items-center justify-center p-1 transition-transform duration-200"
                style={{ transform: `rotate(${page.rotation}deg)` }}
              >
                {page.thumbnail ? (
                  <img
                    src={page.thumbnail}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full h-full object-contain rounded bg-white shadow-2xs pointer-events-none animate-in fade-in duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-white rounded p-3 flex flex-col items-center justify-center text-center relative overflow-hidden border border-gray-200 shadow-2xs">
                    {/* Animated Shimmer Stripe */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent animate-pulse" />

                    <div className="relative z-10 flex flex-col items-center space-y-2.5">
                      <div className="relative flex items-center justify-center">
                        <div className="w-7 h-7 border-2 border-gray-200 border-t-[#FFC800] border-r-[#FFC800] rounded-full animate-spin" />
                        <span className="absolute text-[8px] font-bold text-[#111111]">{page.pageNumber}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-[#111111] block">Page {page.pageNumber}</span>
                        <span className="text-[9px] text-[#6B7280] block font-medium">Loading buffer...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Page Label */}
            <div className="w-full mt-2 flex items-center justify-between text-xs text-[#6B7280]">
              <span className="font-bold text-[#111111]">Page {page.pageNumber}</span>
              {page.rotation > 0 && (
                <span className="text-[10px] text-[#111111] font-bold bg-[#FFC800] px-1.5 py-0.5 rounded shadow-2xs">
                  {page.rotation}°
                </span>
              )}
            </div>

            {/* Actions Bar (Rotate, Reorder, Delete) */}
            <div className="w-full mt-2 pt-2 border-t border-[#E5E5E5] flex items-center justify-between gap-1">
              {onMovePage && (
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={arrayIndex === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePage(arrayIndex, arrayIndex - 1);
                    }}
                    className="p-1 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded disabled:opacity-20 transition-colors"
                    title="Move left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={arrayIndex === pages.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePage(arrayIndex, arrayIndex + 1);
                    }}
                    className="p-1 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded disabled:opacity-20 transition-colors"
                    title="Move right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRotatePage(page.index);
                }}
                className="p-1 text-gray-500 hover:text-[#111111] hover:bg-[#FFC800]/20 rounded transition-colors ml-auto"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePage(page.index);
                }}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete page"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
