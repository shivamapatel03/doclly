import React from "react";

interface EditorPageStripProps {
  thumbnails: string[];
  activePage: number;
  onPageSelect: (index: number) => void;
}

export const EditorPageStrip: React.FC<EditorPageStripProps> = ({
  thumbnails,
  activePage,
  onPageSelect,
}) => {
  if (thumbnails.length <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 overflow-x-auto bg-[#F9F9F9] border-t border-[#E5E5E5] px-3 py-1.5 shrink-0 select-none scrollbar-thin">
      {thumbnails.map((thumb, i) => (
        <button
          key={i}
          onClick={() => onPageSelect(i)}
          title={`Page ${i + 1}`}
          className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
            activePage === i
              ? "bg-[#FFF9DB] border-[#FFC800] text-[#111111] font-bold shadow-xs"
              : "bg-white border-[#E5E5E5] text-[#6B7280] hover:border-[#9CA3AF]"
          }`}
        >
          {thumb && (
            <img src={thumb} alt={`P${i + 1}`} className="h-6 w-auto object-contain rounded-xs" />
          )}
          <span className="text-[11px] font-mono">Page {i + 1}</span>
        </button>
      ))}
    </div>
  );
};
