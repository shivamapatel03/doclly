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
    <div className="flex items-center gap-2 overflow-x-auto bg-[#F9F9F9] border-t border-[#E5E5E5] px-4 py-2 shrink-0 scrollbar-thin">
      {thumbnails.map((thumb, i) => (
        <button
          key={i}
          onClick={() => onPageSelect(i)}
          title={`Page ${i + 1}`}
          className={`shrink-0 flex flex-col items-center gap-1 cursor-pointer group`}
        >
          <div
            className={`relative rounded-md overflow-hidden border-2 transition-all ${
              activePage === i
                ? "border-[#FFC800] shadow-md"
                : "border-[#E5E5E5] hover:border-[#9CA3AF]"
            }`}
          >
            {thumb ? (
              <img src={thumb} alt={`Page ${i + 1}`} className="h-20 w-auto object-contain block" />
            ) : (
              <div className="h-20 w-16 bg-[#F0F0F0] flex items-center justify-center">
                <span className="text-[10px] text-[#9CA3AF]">...</span>
              </div>
            )}
            {activePage === i && (
              <div className="absolute inset-0 bg-[#FFC800]/10" />
            )}
          </div>
          <span
            className={`text-[10px] font-medium ${
              activePage === i ? "text-[#111111]" : "text-[#9CA3AF]"
            }`}
          >
            {i + 1}
          </span>
        </button>
      ))}
    </div>
  );
};
