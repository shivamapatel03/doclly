import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';

interface DocumentViewerProps {
  file: File | null;
  text: string;
  className?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ file, text, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!file && !text) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 bg-[#F5F5F5] border border-[#E5E5E5] rounded-2xl text-center ${className}`}>
        <FileText className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-sm font-bold text-[#111111]">No Document Selected</p>
        <p className="text-xs text-[#6B7280] max-w-xs mt-1">
          Upload a PDF, Word, Excel, or Text file to preview its content and start chatting.
        </p>
      </div>
    );
  }

  // Parse lines into paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className={`flex flex-col bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-2xs ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F5F5F5] border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-white border border-[#E5E5E5] text-[#111111] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-[#111111] truncate">{file?.name || 'Document Content'}</p>
            {file && <p className="text-[11px] text-[#6B7280]">{formatFileSize(file.size)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-0.5 flex text-xs">
            <button
              onClick={() => setActiveTab('formatted')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                activeTab === 'formatted' ? 'bg-[#FFC800] text-[#111111] font-bold shadow-2xs' : 'text-[#6B7280]'
              }`}
            >
              Reader
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                activeTab === 'raw' ? 'bg-[#FFC800] text-[#111111] font-bold shadow-2xs' : 'text-[#6B7280]'
              }`}
            >
              Source Text
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-[#E5E5E5] bg-white text-gray-500 hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors"
            title="Copy document text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[600px] text-sm leading-relaxed text-[#111111] bg-white">
        {activeTab === 'formatted' ? (
          <div className="space-y-4 max-w-none">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-xs sm:text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">
            {text}
          </pre>
        )}
      </div>

      {/* Bottom Metadata bar */}
      <div className="px-4 py-2 bg-[#F5F5F5] border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#6B7280]">
        <span>{text.split(/\s+/).filter(Boolean).length} words detected</span>
        <span>Client-side parsed</span>
      </div>
    </div>
  );
};
