import React, { useState, useMemo } from 'react';
import { ToolDefinition, ToolCategory } from '../../types/tool';
import { TOOL_CATEGORIES, ALL_TOOLS } from '../../lib/constants';
import { ToolCard } from './ToolCard';
import { Sparkles, Files, Minimize2, PenTool, PenLine, Table, RefreshCw } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  convert: RefreshCw,
  organize: Files,
  optimize: Minimize2,
  edit: PenTool,
  sign: PenLine,
  ai: Sparkles,
  office: Table,
};

interface ToolGridProps {
  initialCategory?: ToolCategory | 'all';
  limit?: number;
  showCategoryTabs?: boolean;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  initialCategory = 'all',
  limit,
  showCategoryTabs = true,
}) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const displayedTools = limit ? filteredTools.slice(0, limit) : filteredTools;

  return (
    <div className="space-y-6">
      {showCategoryTabs && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#FFC800] text-[#111111] border border-[#E5E5E5] shadow-2xs'
                  : 'bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] hover:bg-[#EAEAEA]'
              }`}
            >
              All Tools ({ALL_TOOLS.length})
            </button>

            {TOOL_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Files;
              const isSelected = activeCategory === cat.id;
              const count = ALL_TOOLS.filter((t) => t.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-[#FFC800] text-[#111111] font-semibold border border-[#E5E5E5] shadow-2xs'
                      : 'bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] hover:bg-[#EAEAEA]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tools..."
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111] placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {displayedTools.length === 0 ? (
        <div className="py-12 text-center bg-[#F5F5F5] rounded-xl border border-dashed border-[#E5E5E5]">
          <p className="text-sm text-[#6B7280]">No tools found matching your criteria.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-semibold text-[#111111] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};
