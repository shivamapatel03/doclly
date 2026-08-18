import React from "react";
import { Canvas } from "fabric";

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
}) => {
  const isText = selectedType === "textbox" || selectedType === "i-text" || selectedType === "text";
  const isShape = selectedType === "rect" || selectedType === "circle" || selectedType === "line";
  const isImage = selectedType === "image";

  if (!selectedType) {
    return (
      <aside className="w-52 hidden xl:flex flex-col gap-3 bg-white border-l border-[#E5E5E5] p-4 shrink-0">
        <p className="text-xs text-[#9CA3AF] text-center mt-8 leading-relaxed">
          Select an object on the canvas to edit its properties.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-52 hidden xl:flex flex-col gap-4 bg-white border-l border-[#E5E5E5] p-4 shrink-0 overflow-y-auto">
      <h3 className="text-xs font-bold text-[#111111] uppercase tracking-widest">Properties</h3>

      {isText && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#6B7280] font-medium">Text Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-full h-8 rounded cursor-pointer border border-[#E5E5E5]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#6B7280] font-medium">Font Size ({fontSize}px)</label>
            <input
              type="range"
              min={8}
              max={72}
              value={fontSize}
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="w-full accent-[#FFC800]"
            />
          </div>
          <button
            onClick={onApplyProperties}
            className="bg-[#FFC800] text-[#111111] text-xs font-bold py-2 rounded-xl hover:bg-[#f0b800] transition-colors cursor-pointer"
          >
            Apply
          </button>
        </>
      )}

      {isShape && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#6B7280] font-medium">Fill Color</label>
            <input
              type="color"
              value={shapeColor}
              onChange={(e) => onShapeColorChange(e.target.value)}
              className="w-full h-8 rounded cursor-pointer border border-[#E5E5E5]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#6B7280] font-medium">Opacity ({Math.round(shapeOpacity * 100)}%)</label>
            <input
              type="range"
              min={0.05}
              max={1}
              step={0.05}
              value={shapeOpacity}
              onChange={(e) => onShapeOpacityChange(Number(e.target.value))}
              className="w-full accent-[#FFC800]"
            />
          </div>
          <button
            onClick={onApplyProperties}
            className="bg-[#FFC800] text-[#111111] text-xs font-bold py-2 rounded-xl hover:bg-[#f0b800] transition-colors cursor-pointer"
          >
            Apply
          </button>
        </>
      )}

      {isImage && (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#6B7280] font-medium">Opacity ({Math.round(shapeOpacity * 100)}%)</label>
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.05}
            value={shapeOpacity}
            onChange={(e) => onShapeOpacityChange(Number(e.target.value))}
            className="w-full accent-[#FFC800]"
          />
          <button
            onClick={onApplyProperties}
            className="mt-2 bg-[#FFC800] text-[#111111] text-xs font-bold py-2 rounded-xl hover:bg-[#f0b800] transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}
    </aside>
  );
};
