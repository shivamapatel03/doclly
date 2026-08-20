import React, { useState } from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import { FileSession } from '../lib/file-session';
import { ALL_TOOLS } from '../lib/constants';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { SeoHead } from '../components/layout/SeoHead';
import { UploadZone } from '../components/tools/UploadZone';
import { FileList } from '../components/tools/FileList';
import { ResultDownloadCard } from '../components/tools/ResultDownloadCard';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { useToast } from '../components/common/Toast';
import { downloadBytes, downloadBlob } from '../lib/utils';
import {
  imagesToPdf,
  pdfToImages,
  pdfToText,
  wordToPdf,
  excelToPdf,
  flattenPdf,
  protectPdf,
  unlockPdf,
} from '../lib/pdf-engine';
import { DocumentStorage } from '../lib/storage';

// Import dedicated pages
import { MergePdfPage } from './dedicated-tools/MergePdfPage';
import { SplitPdfPage } from './dedicated-tools/SplitPdfPage';
import { CompressPdfPage } from './dedicated-tools/CompressPdfPage';
import { PdfToWordPage } from './dedicated-tools/PdfToWordPage';
import { PdfToExcelPage } from './dedicated-tools/PdfToExcelPage';
import { PdfToJpgPage } from './dedicated-tools/PdfToJpgPage';
import { SignPdfPage } from './dedicated-tools/SignPdfPage';
import { OrganizePdfPage } from './dedicated-tools/OrganizePdfPage';
import { RemovePagesPage } from './dedicated-tools/RemovePagesPage';
import { ExtractPagesPage } from './dedicated-tools/ExtractPagesPage';
import { CompareDocumentsPage } from './dedicated-tools/CompareDocumentsPage';
import { ProtectPdfPage, UnlockPdfPage, FlattenPdfPage } from './dedicated-tools/SecurityToolPages';
import { WatermarkPdfPage } from './dedicated-tools/WatermarkPdfPage';
import { OfficeConvertersPage } from './dedicated-tools/OfficeConvertersPage';
import { PdfEditorPage } from './dedicated-tools/PdfEditorPage';
import { ExcelCleanupPage } from './dedicated-tools/ExcelCleanupPage';
import { StampQrBarcodePage } from './dedicated-tools/StampQrBarcodePage';
import { QrCodeGeneratorPage } from './dedicated-tools/QrCodeGeneratorPage';
import { GovtExamResizerPage } from './dedicated-tools/GovtExamResizerPage';
import { Copy, Check } from 'lucide-react';
import { ThreeDIcon } from '../components/common/ThreeDIcon';

export const ToolPage: React.FC = () => {
  const { toolId: paramId } = useParams<{ toolId: string }>();
  const location = useLocation();
  
  // Extract toolId from route param or root pathname (e.g. /pdf-to-word -> pdf-to-word)
  const pathId = location.pathname.replace(/^\//, '').replace(/^tools\//, '').replace(/_/g, '-');
  const toolId = (paramId || pathId || '').toLowerCase();

  // Route to specialized dedicated tool views with search keyword aliases
  if (toolId === 'merge-pdf' || toolId === 'combine-pdf') return <MergePdfPage />;
  if (toolId === 'split-pdf' || toolId === 'separate-pdf') return <SplitPdfPage />;
  if (toolId === 'compress-pdf' || toolId === 'reduce-pdf-size') return <CompressPdfPage />;
  if (toolId === 'pdf-to-word' || toolId === 'pdf-to-docx') return <PdfToWordPage />;
  if (toolId === 'pdf-to-excel' || toolId === 'pdf-to-xlsx') return <PdfToExcelPage />;
  if (toolId === 'pdf-to-jpg' || toolId === 'pdf-to-png' || toolId === 'pdf-to-image' || toolId === 'pdf-to-img') return <PdfToJpgPage />;
  if (toolId === 'sign-pdf' || toolId === 'electronic-signature') return <SignPdfPage />;
  if (toolId === 'organize-pdf' || toolId === 'reorder-pdf') return <OrganizePdfPage />;
  if (toolId === 'remove-pages' || toolId === 'delete-pdf-pages') return <RemovePagesPage />;
  if (toolId === 'extract-pages' || toolId === 'pdf-page-extractor') return <ExtractPagesPage />;
  if (toolId === 'compare-documents') return <CompareDocumentsPage />;
  if (toolId === 'protect-pdf' || toolId === 'lock-pdf') return <ProtectPdfPage />;
  if (toolId === 'unlock-pdf' || toolId === 'remove-pdf-password') return <UnlockPdfPage />;
  if (toolId === 'flatten-pdf') return <FlattenPdfPage />;
  if (toolId === 'watermark-pdf' || toolId === 'stamp-watermark') return <WatermarkPdfPage />;
  if (toolId === 'edit-pdf' || toolId === 'pdf-editor') return <PdfEditorPage />;
  if (toolId === 'csv-to-excel') return <OfficeConvertersPage mode="csv-to-excel" />;
  if (toolId === 'excel-to-csv') return <OfficeConvertersPage mode="excel-to-csv" />;
  if (toolId === 'excel-cleanup') return <ExcelCleanupPage />;
  if (toolId === 'qr-code-generator' || toolId === 'upi-qr-generator' || toolId === 'barcode-generator') return <QrCodeGeneratorPage />;
  if (toolId === 'stamp-qr-barcode' || toolId === 'qr-barcode-stamper') return <StampQrBarcodePage />;
  if (
    toolId === 'govt-exam-resizer' ||
    toolId === 'exam-photo-resizer' ||
    toolId === 'photo-resizer' ||
    toolId === 'signature-resizer' ||
    toolId === 'upsc-photo-resizer' ||
    toolId === 'ssc-photo-resizer' ||
    toolId === 'gate-photo-resizer' ||
    toolId === 'passport-photo-maker'
  ) {
    return <GovtExamResizerPage />;
  }

  // Support Image to PDF aliases
  const targetId = (toolId === 'img-to-pdf' || toolId === 'image-to-pdf' || toolId === 'png-to-pdf') ? 'jpg-to-pdf' : toolId;
  const tool = ALL_TOOLS.find((t) => t.id === targetId);
  if (!tool) {
    return <Navigate to="/" replace />;
  }

  return <GenericToolPageShell tool={tool} />;
};

const GenericToolPageShell: React.FC<{ tool: any }> = ({ tool }) => {
  const location = useLocation();
  const [files, setFiles] = useState<File[]>(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    return f ? [f] : [];
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [extractedTextPreview, setExtractedTextPreview] = useState<string | null>(null);
  const [extractedImagesPreview, setExtractedImagesPreview] = useState<string[]>([]);
  const [outFilename, setOutFilename] = useState('processed_document.pdf');
  const [passwordInput, setPasswordInput] = useState('doclly123');
  const [copiedText, setCopiedText] = useState(false);

  const toast = useToast();

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(20);
    setExtractedTextPreview(null);
    setExtractedImagesPreview([]);

    try {
      let output: Uint8Array | null = null;
      let blobOutput: Blob | null = null;
      const baseName = files[0].name.replace(/\.[^/.]+$/, '');
      let name = `${baseName}_converted.pdf`;

      if (tool.id === 'jpg-to-pdf') {
        setProgress(50);
        output = await imagesToPdf(files);
        name = `${baseName}_images.pdf`;
      } else if (tool.id === 'pdf-to-jpg') {
        setProgress(50);
        const images = await pdfToImages(files[0], 'jpg');
        if (images.length > 0) {
          setExtractedImagesPreview(images.map((i) => i.dataUrl));
          const res = await fetch(images[0].dataUrl);
          blobOutput = await res.blob();
          name = `${baseName}_page_1.jpg`;
        } else {
          throw new Error('No pages could be rendered.');
        }
      } else if (tool.id === 'pdf-to-text') {
        setProgress(50);
        const text = await pdfToText(files[0]);
        setExtractedTextPreview(text);
        blobOutput = new Blob([text], { type: 'text/plain;charset=utf-8' });
        name = `${baseName}_extracted.txt`;
      } else if (tool.id === 'pdf-to-ppt') {
        setProgress(50);
        const text = await pdfToText(files[0]);
        blobOutput = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        name = `${baseName}_presentation.pptx`;
      } else if (tool.id === 'ppt-to-pdf' || tool.id === 'word-to-pdf' || tool.id === 'html-to-pdf') {
        setProgress(50);
        output = await wordToPdf(files[0]);
        name = `${baseName}.pdf`;
      } else if (tool.id === 'excel-to-pdf') {
        setProgress(50);
        output = await excelToPdf(files[0]);
        name = `${baseName}.pdf`;
      } else if (tool.id === 'flatten-pdf') {
        setProgress(50);
        output = await flattenPdf(files[0]);
        name = `flattened_${files[0].name}`;
      } else if (tool.id === 'protect-pdf') {
        setProgress(50);
        output = await protectPdf(files[0], passwordInput);
        name = `protected_${files[0].name}`;
      } else if (tool.id === 'unlock-pdf') {
        setProgress(50);
        output = await unlockPdf(files[0], passwordInput);
        name = `unlocked_${files[0].name}`;
      } else {
        setProgress(60);
        output = new Uint8Array(await files[0].arrayBuffer());
        name = `${baseName}.${tool.outputFormat.toLowerCase()}`;
      }

      setProgress(100);
      setResultBytes(output);
      setResultBlob(blobOutput);
      setOutFilename(name);

      DocumentStorage.saveDocument({
        name,
        size: output ? output.byteLength : blobOutput?.size || 1024,
        type: 'application/pdf',
        data: output || blobOutput || undefined,
      });
      toast.success(`${tool.name} completed successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'We could not process this file. Please check the file and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBytes) {
      downloadBytes(resultBytes, outFilename);
    } else if (resultBlob) {
      downloadBlob(resultBlob, outFilename);
    }
  };

  const handleCopyText = () => {
    if (extractedTextPreview) {
      navigator.clipboard.writeText(extractedTextPreview);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      toast.success('Extracted text copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SeoHead
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: tool.name }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          {tool.name}
        </h1>
        <p className="text-sm text-[#6B7280]">{tool.description}</p>
      </div>

      {!resultBytes && !resultBlob ? (
        <div className="space-y-6">
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accepts={tool.accepts}
            acceptsDescription={tool.acceptsDescription}
            maxFiles={tool.maxFiles || 10}
          />

          {files.length > 0 && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-6 shadow-2xs">
              <FileList
                files={files}
                onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
                onReorder={(newFiles) => setFiles(newFiles)}
              />

              {/* Tool Specific Configuration */}
              {tool.id === 'protect-pdf' && (
                <div className="p-4 bg-[#F5F5F5] rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Set Document Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter secure password..."
                    className="w-full h-10 px-3 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FFC800]"
                  />
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <ProgressBar progress={progress} />
                  <p className="text-xs text-center text-[#6B7280]">
                    Processing {files[0].name} with Doclly engine...
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full sm:w-auto bg-[#FFC800] text-[#111111] hover:bg-[#E6B400] font-bold cursor-pointer"
                >
                  {isProcessing ? 'Converting...' : tool.actionButtonText || 'Convert Document'}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-2xs relative z-10">
            <ResultDownloadCard
              filename={outFilename}
              onDownload={handleDownload}
              onStartOver={() => {
                setFiles([]);
                setResultBytes(null);
                setResultBlob(null);
                setExtractedTextPreview(null);
                setExtractedImagesPreview([]);
              }}
            />
          </div>

          {/* Extracted Text Preview Box */}
          {extractedTextPreview && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#111111]">
                  <ThreeDIcon name="text" className="w-5 h-5" />
                  <span>Extracted Document Text</span>
                </div>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#F5F5F5] hover:bg-[#EAEAEA] rounded-lg text-[#111111] transition-colors cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={extractedTextPreview}
                rows={10}
                className="w-full p-3 font-mono text-xs text-[#111111] bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl focus:outline-none resize-y"
              />
            </div>
          )}

          {/* Extracted Image Gallery */}
          {extractedImagesPreview.length > 0 && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#111111]">
                  <ThreeDIcon name="image" className="w-5 h-5" />
                  <span>Extracted Page Images ({extractedImagesPreview.length} pages)</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1">
                {extractedImagesPreview.map((src, idx) => (
                  <div key={idx} className="border border-[#E5E5E5] rounded-xl overflow-hidden shadow-2xs group relative bg-[#F5F5F5]">
                    <img src={src} alt={`Page ${idx + 1}`} className="w-full h-auto object-contain" />
                    <div className="p-1.5 text-center text-[11px] font-bold text-[#111111] bg-white border-t border-[#E5E5E5]">
                      Page {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
