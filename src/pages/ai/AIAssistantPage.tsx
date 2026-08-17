import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { DocumentViewer } from '../../components/ai/DocumentViewer';
import { AIChatPanel } from '../../components/ai/AIChatPanel';
import { extractDocumentText } from '../../lib/ai-engine';
import { Sparkles, Upload } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

export const AIAssistantPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docText, setDocText] = useState<string>('');

  const handleDocumentSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);

    try {
      const text = await extractDocumentText(selected);
      setDocText(text);
      DocumentStorage.saveDocument({
        name: selected.name,
        size: selected.size,
        type: selected.type || 'application/pdf',
        extractedText: text,
      });
    } catch {
      setDocText('Doclly Document Workspace.\n\nReady for analysis.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
      <div className="absolute top-0 right-0 w-96 h-96 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask" />
      <SeoHead
        title="Talk to Your Documents with AI — Doclly AI Assistant"
        description="Upload a document and ask questions, summarize it, extract information or rewrite content in seconds."
      />

      <Breadcrumb items={[{ label: 'AI Tools', to: '/ai' }, { label: 'AI Document Assistant' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#111111] bg-[#FFC800]/20 border border-[#FFC800]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            AI Document Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Talk to your documents.
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Upload a document and ask questions, summarize it, extract key clauses, or translate content.
          </p>
        </div>

        {file && (
          <button
            onClick={() => {
              setFile(null);
              setDocText('');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111111] bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#E5E5E5] rounded-lg self-start sm:self-auto shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            Change Document
          </button>
        )}
      </div>

      {!file ? (
        <div className="max-w-2xl mx-auto py-6">
          <UploadZone
            onFilesSelected={handleDocumentSelected}
            accepts={['.pdf', '.docx', '.txt', '.xlsx', '.csv', 'application/pdf']}
            acceptsDescription="PDF, Word, Excel, CSV, or Text documents"
            maxFiles={1}
          />
        </div>
      ) : (
        /* Dual-pane Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[620px]">
          {/* Left: Document Reader Preview */}
          <DocumentViewer file={file} text={docText} className="h-full min-h-[500px]" />

          {/* Right: Interactive AI Chat Panel */}
          <AIChatPanel
            documentText={docText}
            documentName={file.name}
            className="h-full min-h-[500px]"
          />
        </div>
      )}
    </div>
  );
};
