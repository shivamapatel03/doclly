import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../../types/tool';
import { ThreeDIcon, getTool3DIcon } from '../common/ThreeDIcon';

interface ToolCardProps {
  tool: ToolDefinition;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const icon3dName = getTool3DIcon(tool.id, tool.iconName);

  return (
    <Link
      to={tool.route}
      className="group relative flex flex-col justify-between p-5 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-2xl transition-all duration-200 hover:shadow-md select-none"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <ThreeDIcon
              name={icon3dName}
              className="w-10 h-10 drop-shadow-md transition-transform duration-200 group-hover:scale-110"
            />
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
