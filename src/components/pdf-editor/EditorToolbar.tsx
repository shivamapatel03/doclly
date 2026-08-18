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
}

const TOOL_GROUPS: { name: string; tools: Tool[] }[] = [
  {
    name: "select",
    tools: [
      { id: "select", label: "Select & Move", icon: <MousePointer2 className="w-4 h-4" /> },
    ],
  },
  {
    name: "insert",
    tools: [
      { id: "text", label: "Add Text", icon: <Type className="w-4 h-4" /> },
      { id: "image", label: "Add Image", icon: <Image className="w-4 h-4" /> },
      { id: "signature", label: "Signature", icon: <PenLine className="w-4 h-4" /> },
    ],
  },
  {
    name: "shapes",
    tools: [
      { id: "rect", label: "Rectangle", icon: <Square className="w-4 h-4" /> },
      { id: "circle", label: "Circle", icon: <Circle className="w-4 h-4" /> },
      { id: "line", label: "Line", icon: <Minus className="w-4 h-4" /> },
    ],
  },
  {
    name: "annotate",
    tools: [
      { id: "highlight", label: "Highlight", icon: <Highlighter className="w-4 h-4" /> },
      { id: "redact", label: "Whiteout / Redact", icon: <EyeOff className="w-4 h-4" /> },
      { id: "eraser", label: "Delete Object", icon: <Eraser className="w-4 h-4" /> },
    ],
  },
];

interface EditorToolbarProps {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeTool,
  onToolChange,
}) => {
  return (
    <aside className="w-12 bg-white border-r border-[#E5E5E5] py-2 px-1 flex flex-col items-center shrink-0 select-none z-10">
      <div className="flex flex-col items-center gap-1 w-full">
        {TOOL_GROUPS.map((group, gIdx) => (
          <React.Fragment key={group.name}>
            {gIdx > 0 && <div className="w-6 h-px bg-[#E5E5E5] my-0.5" />}
            {group.tools.map((tool) => (
              <button
                key={tool.id}
                title={tool.label}
                onClick={() => onToolChange(tool.id)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  activeTool === tool.id
                    ? "bg-[#FFC800] text-[#111111] shadow-xs"
                    : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111111]"
                }`}
              >
                {tool.icon}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};
