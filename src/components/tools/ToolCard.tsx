import React from 'react';
import { Link } from 'react-router-dom';
import {
  Files,
  Scissors,
  Minimize2,
  FileText,
  Table,
  FileType,
  Sheet,
  Image,
  Images,
  ImageDown,
  Presentation,
  FileSpreadsheet,
  FilePlus,
  FileCode,
  Code,
  LayoutGrid,
  RotateCw,
  PenTool,
  ShieldAlert,
  ListOrdered,
  PenLine,
  Stamp,
  Lock,
  Unlock,
  Layers,
  Trash2,
  Copy,
  GitCompare,
  CheckCheck,
  ArrowRight,
} from 'lucide-react';
import { ToolDefinition } from '../../types/tool';

const ICON_MAP: Record<string, React.ElementType> = {
  Files,
  Scissors,
  Minimize2,
  FileText,
  Table,
  FileType,
  Sheet,
  Image,
  Images,
  ImageDown,
  Presentation,
  FileSpreadsheet,
  FilePlus,
  FileCode,
  Code,
  LayoutGrid,
  RotateCw,
  PenTool,
  ShieldAlert,
  ListOrdered,
  PenLine,
  Stamp,
  Lock,
  Unlock,
  Layers,
  Trash2,
  Copy,
  GitCompare,
  CheckCheck,
};

const TOOL_COLOR_MAP: Record<string, string> = {
  'pdf-to-word': 'bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
  'word-to-pdf': 'bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
  'pdf-to-excel': 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
  'excel-to-pdf': 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
  'csv-to-excel': 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
  'excel-to-csv': 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
  'excel-cleanup': 'bg-teal-50 text-teal-600 border-teal-200 group-hover:bg-teal-600 group-hover:text-white',
  'pdf-to-ppt': 'bg-orange-50 text-orange-600 border-orange-200 group-hover:bg-orange-600 group-hover:text-white',
  'ppt-to-pdf': 'bg-orange-50 text-orange-600 border-orange-200 group-hover:bg-orange-600 group-hover:text-white',
  'pdf-to-jpg': 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-500 group-hover:text-white',
  'jpg-to-pdf': 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-500 group-hover:text-white',
  'pdf-to-text': 'bg-indigo-50 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
  'html-to-pdf': 'bg-indigo-50 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
  'merge-pdf': 'bg-rose-50 text-rose-600 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
  'split-pdf': 'bg-purple-50 text-purple-600 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
  'remove-pages': 'bg-red-50 text-red-600 border-red-200 group-hover:bg-red-600 group-hover:text-white',
  'extract-pages': 'bg-sky-50 text-sky-600 border-sky-200 group-hover:bg-sky-600 group-hover:text-white',
  'organize-pdf': 'bg-violet-50 text-violet-600 border-violet-200 group-hover:bg-violet-600 group-hover:text-white',
  'compress-pdf': 'bg-red-50 text-red-600 border-red-200 group-hover:bg-red-600 group-hover:text-white',
  'sign-pdf': 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-500 group-hover:text-white',
  'watermark-pdf': 'bg-cyan-50 text-cyan-600 border-cyan-200 group-hover:bg-cyan-600 group-hover:text-white',
  'protect-pdf': 'bg-rose-50 text-rose-600 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
  'unlock-pdf': 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
  'flatten-pdf': 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
  'compare-documents': 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-900 group-hover:text-white',
};

interface ToolCardProps {
  tool: ToolDefinition;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const IconComponent = ICON_MAP[tool.iconName] || FileText;
  const colorClass = TOOL_COLOR_MAP[tool.id] || 'bg-[#F5F5F5] text-[#111111] border-[#E5E5E5] group-hover:bg-[#111111] group-hover:text-white';

  return (
    <Link
      to={tool.route}
      className="group relative flex flex-col justify-between p-5 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-2xl transition-all duration-200 hover:shadow-md select-none"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 ${colorClass}`}>
            <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>

          {tool.popular && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFC800]/20 text-[#111111] border border-[#FFC800]/40">
              POPULAR
            </span>
          )}
        </div>

        <h3 className="text-sm sm:text-base font-bold text-[#111111] tracking-tight transition-colors mb-1.5">
          {tool.name}
        </h3>
        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#6B7280] group-hover:text-[#111111] transition-colors">
        <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">
          {tool.outputFormat}
        </span>
        <div className="flex items-center gap-1 font-bold text-[#111111]">
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};


