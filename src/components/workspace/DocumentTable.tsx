import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Star,
  Trash2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { DocItem } from '../../types/document';
import { formatFileSize } from '../../lib/utils';

interface DocumentTableProps {
  documents: DocItem[];
  onToggleFavorite: (id: string) => void;
  onMoveToTrash: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  isTrashView?: boolean;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onToggleFavorite,
  onMoveToTrash,
  onRestore,
  onPermanentDelete,
  isTrashView = false,
}) => {
  if (documents.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-[#E5E5E5] rounded-2xl">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#111111]">
          {isTrashView ? 'Trash is empty' : 'No documents yet'}
        </h3>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-sm mx-auto mt-1 mb-4">
          {isTrashView
            ? 'Deleted documents will appear here before permanent removal.'
            : 'Upload your first document or start by merging, compressing, or converting a file.'}
        </p>
        {!isTrashView && (
          <Link
            to="/tools/merge-pdf"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-[#111111] bg-[#FFC800] hover:bg-[#E6B400] rounded-lg transition-colors border border-[#E5E5E5] shadow-2xs"
          >
            Upload Document
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="border border-[#E5E5E5] rounded-2xl bg-white overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#F5F5F5] text-[#6B7280] border-b border-[#E5E5E5]">
            <tr>
              <th className="px-4 py-3 font-semibold w-10"></th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Type</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Size</th>
              <th className="px-4 py-3 font-semibold hidden lg:table-cell">Uploaded</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-[#F5F5F5]/70 transition-colors group">
                {/* Favorite Star */}
                <td className="px-4 py-3 text-center">
                  {!isTrashView && (
                    <button
                      onClick={() => onToggleFavorite(doc.id)}
                      className="text-gray-300 hover:text-amber-500 transition-colors p-1"
                      title={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          doc.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  )}
                </td>

                {/* Name */}
                <td className="px-4 py-3 font-semibold text-[#111111]">
                  <div className="flex items-center gap-2.5 min-w-0 max-w-xs sm:max-w-md">
                    <div className="w-7 h-7 rounded-md bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="truncate">{doc.name}</span>
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3 text-[#6B7280] hidden md:table-cell capitalize">
                  {doc.type.includes('pdf')
                    ? 'PDF'
                    : doc.type.includes('sheet')
                    ? 'Spreadsheet'
                    : 'Document'}
                </td>

                {/* Size */}
                <td className="px-4 py-3 text-[#6B7280] hidden sm:table-cell">
                  {formatFileSize(doc.size)}
                </td>

                {/* Uploaded */}
                <td className="px-4 py-3 text-[#6B7280] hidden lg:table-cell">
                  {doc.uploadedAt}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isTrashView ? (
                      <>
                        <button
                          onClick={() => onRestore(doc.id)}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPermanentDelete(doc.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/ai"
                          className="p-1.5 text-gray-400 hover:text-[#111111] hover:bg-[#FFC800]/20 rounded-lg transition-colors"
                          title="Open with AI"
                        >
                          <Sparkles className="w-4 h-4 text-[#111111]" />
                        </Link>
                        <button
                          onClick={() => onMoveToTrash(doc.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Move to trash"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
