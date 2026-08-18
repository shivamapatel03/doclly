import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_TOOLS } from '../../lib/constants';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { ThreeDIcon, getTool3DIcon } from './ThreeDIcon';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Filter tools
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return ALL_TOOLS.slice(0, 10);
    }

    return ALL_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.seo.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation & Ctrl+K trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (searchResults.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % (searchResults.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          navigate(searchResults[selectedIndex].route);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, searchResults, selectedIndex, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-start justify-center p-4 sm:p-6 text-center pt-20 sm:pt-28">
        <div
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl border border-[#E5E5E5] transition-all w-full max-w-xl animate-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 border-b border-[#E5E5E5]">
            <Search className="w-4 h-4 text-gray-400 shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all 25+ PDF converters, mergers, splitters, sign..."
              className="w-full py-3.5 text-sm text-[#111111] placeholder-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {searchResults.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#6B7280]">
                No tools found matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((tool, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        navigate(tool.route);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#FFC800]/20 text-[#111111] font-semibold' : 'hover:bg-[#F5F5F5] text-[#111111]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          <ThreeDIcon
                            name={getTool3DIcon(tool.id, tool.iconName)}
                            className="w-6 h-6 drop-shadow-xs"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-medium truncate">{tool.name}</div>
                          <div className="text-[11px] text-[#6B7280] truncate">{tool.description}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                          {tool.category}
                        </span>
                        {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[#111111]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-[#F5F5F5] border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#6B7280]">
            <div className="flex items-center gap-3">
              <span>Navigate <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E5E5] rounded font-mono">↑ / ↓</kbd></span>
              <span>Open <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E5E5] rounded font-mono">↵</kbd></span>
              <span>Close <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E5E5] rounded font-mono">ESC</kbd></span>
            </div>
            <span className="font-bold text-[#111111]">Doclly</span>
          </div>
        </div>
      </div>
    </div>
  );
};
