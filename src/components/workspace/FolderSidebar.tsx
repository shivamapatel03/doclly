import React from 'react';
import { Folder, Star, Trash2, Plus, HardDrive, Files } from 'lucide-react';
import { FolderItem } from '../../types/document';

interface FolderSidebarProps {
  folders: FolderItem[];
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
  onCreateFolder: () => void;
  totalDocsCount: number;
  favoritesCount: number;
  trashCount: number;
}

export const FolderSidebar: React.FC<FolderSidebarProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  totalDocsCount,
  favoritesCount,
  trashCount,
}) => {
  return (
    <aside className="w-full md:w-64 space-y-6">
      {/* Primary Navigation */}
      <div className="space-y-1">
        <button
          onClick={() => onSelectFolder('all')}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
            selectedFolderId === 'all'
              ? 'bg-[#FFC800] text-[#111111] border border-[#E5E5E5] shadow-2xs'
              : 'text-[#111111] hover:bg-[#F5F5F5]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Files className="w-4 h-4" />
            <span>All Documents</span>
          </div>
          <span className="text-xs opacity-70">{totalDocsCount}</span>
        </button>

        <button
          onClick={() => onSelectFolder('favorites')}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedFolderId === 'favorites'
              ? 'bg-[#FFC800] text-[#111111] font-semibold border border-[#E5E5E5] shadow-2xs'
              : 'text-[#111111] hover:bg-[#F5F5F5]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Star className="w-4 h-4 text-amber-500" />
            <span>Favorites</span>
          </div>
          <span className="text-xs text-gray-400">{favoritesCount}</span>
        </button>

        <button
          onClick={() => onSelectFolder('trash')}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedFolderId === 'trash'
              ? 'bg-red-50 text-red-600 font-semibold border border-red-200'
              : 'text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111111]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4" />
            <span>Trash</span>
          </div>
          <span className="text-xs text-gray-400">{trashCount}</span>
        </button>
      </div>

      {/* Folders List */}
      <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Folders</span>
          <button
            onClick={onCreateFolder}
            className="p-1 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded transition-colors"
            title="Create Folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-0.5">
          {folders.map((folder) => {
            if (folder.id === 'all') return null;
            const isSelected = selectedFolderId === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-[#FFC800]/20 text-[#111111] font-semibold border border-[#FFC800]/40'
                    : 'text-[#111111] hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Folder className="w-4 h-4 shrink-0 text-[#111111]" />
                  <span className="truncate">{folder.name}</span>
                </div>
                <span className="text-xs text-gray-400">{folder.itemCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Indicator */}
      <div className="p-3.5 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl space-y-2 text-xs text-[#6B7280]">
        <div className="flex items-center gap-2 text-[#111111] font-semibold">
          <HardDrive className="w-4 h-4 text-[#111111]" />
          <span>Local Storage</span>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#FFC800] h-full w-[12%]" />
        </div>
        <div className="flex justify-between text-[11px]">
          <span>34 MB used</span>
          <span>5 GB Total</span>
        </div>
      </div>
    </aside>
  );
};
