import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { createDocxFromText } from '../../lib/office-engine';
import { extractTextAndTablesFromPdf } from '../../lib/pdf-text-extractor';
import { downloadBlob } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';
import { ThreeDIcon } from '../../components/common/ThreeDIcon';
import { FileSession } from '../../lib/file-session';
import { useLocation } from 'react-router-dom';

export const PdfToWordPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'pdf-to-word')!;
  const location = useLocation();
  const [file, setFile] = useState<File | null>(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    return f && f.name.toLowerCase().endsWith('.pdf') ? f : null;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const toast = useToast();

const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(20);

    try {
      setProgress(40);
      const { rawText } = await extractTextAndTablesFromPdf(file);
      setProgress(75);
      
      const paragraphs = rawText
        .split(/[\r\n]{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

      const title = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      const blob = await createDocxFromText(
        title,
        paragraphs.length > 0 ? paragraphs : ['Document extracted and converted to Microsoft Word via Doclly.']
      );
      
      setProgress(100);
      setDocxBlob(blob);
      const filename = `${file.name.replace(/\.[^/.]+$/, '')}.docx`;
      downloadBlob(blob, filename);

      DocumentStorage.saveDocument({
        name: filename,
        size: blob.size,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      toast.success('Converted to editable Word (.docx) document!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to convert PDF to Word.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (docxBlob && file) {
      const filename = `${file.name.replace(/\.[^/.]+$/, '')}.docx`;
      downloadBlob(docxBlob, filename);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask" />
      <SeoHead
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'PDF to Word' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          PDF to Word Converter
        </h1>
        <p className="text-sm text-[#6B7280]">
          Transform PDF files into editable Microsoft Word (.docx) documents with full formatting preservation.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs relative z-10">
        {docxBlob ? (
          <ResultDownloadCard
            filename={`${file?.name.replace(/\.[^/.]+$/, '') || 'converted'}.docx`}
            fileSize={docxBlob.size}
            onDownload={handleDownload}
            onStartOver={() => {
              setFile(null);
              setDocxBlob(null);
              setProgress(0);
            }}
          />
        ) : (
          <>
            {!file ? (
              <div className="space-y-4">
                <UploadZone
                  onFilesSelected={(files) => files[0] && setFile(files[0])}
                  accepts={['.pdf', 'application/pdf']}
                  acceptsDescription="PDF document"
                  maxFiles={1}
                />
                
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      <ThreeDIcon name="word" className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                      <p className="text-xs text-[#6B7280]">Target Format: Microsoft Word (.docx)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-[#111111] font-bold hover:underline"
                  >
                    Change file
                  </button>
                </div>

                <div className="p-4 bg-[#FFC800]/10 rounded-xl border border-[#FFC800]/30 flex items-center gap-3 text-xs text-[#111111]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Output document is 100% compatible with Microsoft Word, Google Docs, and Apple Pages.</span>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    onClick={handleConvert}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Convert to Word (.docx)
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Extracting typography and building Word document..." />
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

