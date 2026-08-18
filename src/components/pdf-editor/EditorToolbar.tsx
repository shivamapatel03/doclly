import React from "react";
import type { EditorTool } from "../../lib/pdf-editor/fabricCanvas";
import {
  MousePointer2, Type, Image, PenLine, Square, Circle, Minus,
  Highlighter, EyeOff, Eraser,
} from "lucide-react";

interface Tool {
  id: EditorTool;
  label: string;
  icon: React.ReactNode;
  group?: string;
}

const TOOLS: Tool[] = [
  { id: "select",    label: "Select",    icon: <MousePointer2 className="w-5 h-5" />, group: "base" },
  { id: "text",      label: "Add Text",  icon: <Type className="w-5 h-5" />,          group: "add" },
  { id: "image",     label: "Add Image", icon: <Image className="w-5 h-5" />,         group: "add" },
  { id: "signature", label: "Signature", icon: <PenLine className="w-5 h-5" />,       group: "add" },
  { id: "rect",      label: "Rectangle", icon: <Square className="w-5 h-5" />,        group: "shape" },
  { id: "circle",    label: "Circle",    icon: <Circle className="w-5 h-5" />,        group: "shape" },
  { id: "line",      label: "Line",      icon: <Minus className="w-5 h-5" />,         group: "shape" },
  { id: "highlight", label: "Highlight", icon: <Highlighter className="w-5 h-5" />,  group: "annot" },
  { id: "redact",    label: "Redact",    icon: <EyeOff className="w-5 h-5" />,       group: "annot" },
  { id: "eraser",    label: "Delete",    icon: <Eraser className="w-5 h-5" />,       group: "annot" },
];

const GROUP_LABELS: Record<string, string> = {
  base: "Tools",
  add: "Insert",
  shape: "Shapes",
  annot: "Annotate",
};

interface EditorToolbarProps {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ activeTool, onToolChange }) => {
  const groups = ["base", "add", "shape", "annot"];
  return (
    <aside className="w-16 lg:w-20 flex flex-col gap-1 bg-white border-r border-[#E5E5E5] py-3 px-1.5 shrink-0 overflow-y-auto">
      {groups.map((group) => {
        const items = TOOLS.filter((t) => t.group === group);
        return (
          <div key={group} className="flex flex-col gap-0.5 mb-2">
            <span className="text-[9px] font-semibold uppercase text-[#9CA3AF] text-center mb-0.5 tracking-widest px-1 hidden lg:block">
              {GROUP_LABELS[group]}
            </span>
            {items.map((tool) => (
              <button
                key={tool.id}
                title={tool.label}
                onClick={() => onToolChange(tool.id)}
                className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl transition-all cursor-pointer ${
                  activeTool === tool.id
                    ? "bg-[#FFC800] text-[#111111] shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111111]"
                }`}
              >
                {tool.icon}
                <span className="text-[8px] font-medium leading-none hidden lg:block">{tool.label}</span>
              </button>
            ))}
          </div>
        );
      })}
    </aside>
  );
};
