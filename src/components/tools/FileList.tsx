import React from 'react';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';
import { getFile3DIcon } from '../common/ThreeDIcon';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onReorder?: (newFiles: File[]) => void;
  showReorder?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onRemove,
  onReorder,
  showReorder = true,
}) => {
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!onReorder) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const newFiles = [...files];
    const [moved] = newFiles.splice(index, 1);
    newFiles.splice(targetIndex, 0, moved);
    onReorder(newFiles);
  };

  if (files.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] uppercase tracking-wider px-1">
        <span>Selected Files ({files.length})</span>
        {showReorder && files.length > 1 && <span>Reorder order</span>}
      </div>

      <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-xl bg-white overflow-hidden shadow-2xs">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-[#F5F5F5] transition-colors gap-3"
          >
            {/* File Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="shrink-0">
                {getFile3DIcon(file.name, 'w-8 h-8')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#111111] truncate">{file.name}</p>
                <p className="text-xs text-[#6B7280]">{formatFileSize(file.size)}</p>
              </div>
            </div>

            {/* Reorder & Remove Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {showReorder && files.length > 1 && (
                <div className="flex items-center gap-0.5 mr-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-1 rounded text-gray-400 hover:text-[#111111] hover:bg-gray-200/60 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === files.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-1 rounded text-gray-400 hover:text-[#111111] hover:bg-gray-200/60 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
