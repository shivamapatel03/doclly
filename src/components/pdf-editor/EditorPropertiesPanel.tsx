import React from "react";
import { X } from "lucide-react";

interface EditorPropertiesPanelProps {
  selectedType: string | null;
  textColor: string;
  fontSize: number;
  shapeColor: string;
  shapeOpacity: number;
  onTextColorChange: (c: string) => void;
  onFontSizeChange: (n: number) => void;
  onShapeColorChange: (c: string) => void;
  onShapeOpacityChange: (n: number) => void;
  onApplyProperties: () => void;
  onClose?: () => void;
}

export const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({
  selectedType,
  textColor,
  fontSize,
  shapeColor,
  shapeOpacity,
  onTextColorChange,
  onFontSizeChange,
  onShapeColorChange,
  onShapeOpacityChange,
  onApplyProperties,
  onClose,
}) => {
  if (!selectedType) return null;

  const isText = selectedType === "textbox" || selectedType === "i-text" || selectedType === "text";
  const isShape = selectedType === "rect" || selectedType === "circle" || selectedType === "line";

  return (
    <aside className="w-44 bg-white border-l border-[#E5E5E5] p-3 flex flex-col gap-3 shrink-0 overflow-y-auto z-10 animate-in slide-in-from-right-4 duration-150 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">
          {isText ? "Text" : isShape ? "Shape" : "Properties"}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F5F5F5] rounded-md text-[#9CA3AF] hover:text-[#111111] cursor-pointer"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isText && (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#6B7280] font-medium">Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-full h-7 rounded cursor-pointer border border-[#E5E5E5] p-0.5"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-[#6B7280]">
              <span>Font Size</span>
              <span className="font-mono font-bold text-[#111111]">{fontSize}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={fontSize}
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="w-full accent-[#FFC800] h-1.5 cursor-pointer"
            />
          </div>
          <button
            onClick={onApplyProperties}
            className="w-full bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] text-xs font-bold py-1.5 px-3 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all cursor-pointer select-none"
          >
            Apply
          </button>
        </div>
      )}

      {isShape && (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#6B7280] font-medium">Fill Color</label>
            <input
              type="color"
              value={shapeColor}
              onChange={(e) => onShapeColorChange(e.target.value)}
              className="w-full h-7 rounded cursor-pointer border border-[#E5E5E5] p-0.5"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-[#6B7280]">
              <span>Opacity</span>
              <span className="font-mono font-bold text-[#111111]">{Math.round(shapeOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={shapeOpacity}
              onChange={(e) => onShapeOpacityChange(Number(e.target.value))}
              className="w-full accent-[#FFC800] h-1.5 cursor-pointer"
            />
          </div>
          <button
            onClick={onApplyProperties}
            className="w-full bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] text-xs font-bold py-1.5 px-3 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all cursor-pointer select-none"
          >
            Apply
          </button>
        </div>
      )}
    </aside>
  );
};
