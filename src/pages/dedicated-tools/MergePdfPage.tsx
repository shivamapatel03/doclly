import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { FileList } from '../../components/tools/FileList';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { mergePdfs } from '../../lib/pdf-engine';
import { downloadBytes } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import { ArrowRight, Plus } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

import { useLocation } from 'react-router-dom';
import { FileSession } from '../../lib/file-session';

export const MergePdfPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'merge-pdf')!;
  const location = useLocation();
  const [files, setFiles] = useState<File[]>(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    return f && f.name.toLowerCase().endsWith('.pdf') ? [f] : [];
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedBytes, setMergedBytes] = useState<Uint8Array | null>(null);
  const toast = useToast();

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(20);

    try {
      setProgress(50);
      const result = await mergePdfs(files);
      setProgress(90);
      await new Promise((r) => setTimeout(r, 300));
      setProgress(100);

      setMergedBytes(result);
      DocumentStorage.saveDocument({
        name: `Merged_${files.length}_docs.pdf`,
        size: result.byteLength,
        type: 'application/pdf',
      });
      toast.success('PDFs merged successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to merge PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedBytes) {
      downloadBytes(mergedBytes, 'merged_document.pdf', 'application/pdf');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SeoHead
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Merge PDF' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Merge PDF files
        </h1>
        <p className="text-sm text-[#6B7280]">
          Combine multiple PDF documents into a single organized file in seconds.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        {mergedBytes ? (
          <ResultDownloadCard
            filename="merged_document.pdf"
            fileSize={mergedBytes.byteLength}
            onDownload={handleDownload}
            onStartOver={() => {
              setFiles([]);
              setMergedBytes(null);
              setProgress(0);
            }}
          />
        ) : (
          <>
            {files.length === 0 ? (
              <UploadZone
                onFilesSelected={handleFilesSelected}
                accepts={['.pdf', 'application/pdf']}
                acceptsDescription="PDF files"
                maxFiles={20}
              />
            ) : (
              <div className="space-y-6">
                <FileList
                  files={files}
                  onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
                  onReorder={(newFiles) => setFiles(newFiles)}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:bg-[#EAEAEA] bg-[#F5F5F5] px-3 py-2 rounded-xl border border-[#E5E5E5] transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add more files</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,application/pdf"
                        onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <Button
                    size="lg"
                    variant="primary"
                    disabled={isProcessing || files.length === 0}
                    isLoading={isProcessing}
                    onClick={handleMerge}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] font-bold cursor-pointer"
                  >
                    Merge {files.length} {files.length === 1 ? 'PDF' : 'PDFs'}
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Combining PDF documents..." />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
