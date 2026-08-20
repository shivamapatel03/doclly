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
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, FileText, ChevronDown } from 'lucide-react';
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
        data: blob,
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

  const howToSteps = [
    {
      name: 'Select your PDF document',
      text: 'Click the upload box or drag and drop your PDF file directly into the converter.'
    },
    {
      name: 'Convert PDF to Word',
      text: 'Click "Convert to Word (.docx)" to extract typography, layout, and paragraphs with high accuracy.'
    },
    {
      name: 'Download editable DOCX file',
      text: 'Download your fresh Microsoft Word (.docx) document ready to open in Word, Google Docs, or LibreOffice.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask" />
      
      <SeoHead
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
        faq={tool.seo.faq}
        howTo={{
          name: 'How to convert PDF to Word online for free',
          description: 'Step-by-step guide to converting PDF documents to editable Microsoft Word files for free using Doclly.',
          steps: howToSteps
        }}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'PDF to Word' }]} />

      {/* Main SEO Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Convert PDF to Word online for free
        </h1>
        <p className="text-base text-[#6B7280]">
          Convert PDF to editable Word documents for free. PDF to Word conversion is fast, secure and 100% accurate.
        </p>
      </div>

      {/* Main Converter Card */}
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

      {/* How to Convert PDF to Word (3-Step Guide) */}
      <section className="mt-16 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111111]">
            How to convert PDF to Word online for free
          </h2>
          <p className="text-sm text-[#6B7280]">
            Convert any PDF document to an editable Microsoft Word document in 3 simple steps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howToSteps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E5E5E5] space-y-3 shadow-2xs relative">
              <div className="w-8 h-8 rounded-full bg-[#FFC800] text-[#111111] font-extrabold flex items-center justify-center text-sm shadow-xs">
                {idx + 1}
              </div>
              <h3 className="font-bold text-[#111111] text-base">{step.name}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Advantages / Features */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-[#111111] text-sm">100% In-Browser Privacy</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Your PDF is converted locally in your browser memory. No files are ever sent to external cloud servers.
          </p>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-2">
          <Zap className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-[#111111] text-sm">Lightning Fast & Accurate</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Extract headings, paragraphs, and tables into standard editable .docx format with zero lag.
          </p>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-[#111111] text-sm">Scanned & Native PDFs</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Supports both digital PDFs and scanned documents. Fully compatible with Google Docs and Microsoft Word.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      {tool.seo.faq && tool.seo.faq.length > 0 && (
        <section className="mt-16 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-[#111111]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#6B7280]">
              Everything you need to know about converting PDF to Word with Doclly.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {tool.seo.faq.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left font-bold text-sm text-[#111111] flex items-center justify-between hover:bg-[#FAFAFA]"
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-[#6B7280] leading-relaxed border-t border-[#F1F5F9] pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
