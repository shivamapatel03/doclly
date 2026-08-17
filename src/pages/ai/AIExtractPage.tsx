import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { StructuredDataPreview } from '../../components/ai/StructuredDataPreview';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { extractStructuredData, extractDocumentText } from '../../lib/ai-engine';
import { ExtractionDocType } from '../../types/ai';
import { ScanText, Receipt, FileText, Briefcase, FileCheck } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

export const AIExtractPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<ExtractionDocType>('invoice');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedResult, setExtractedResult] = useState<{
    type: ExtractionDocType;
    data: any;
  } | null>(null);

  const toast = useToast();

  const handleDocumentSelected = async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const text = await extractDocumentText(file);
      setProgress(85);
      const result = await extractStructuredData(text, docType);
      setProgress(100);

      setExtractedResult({ type: result.type, data: result.data });
      DocumentStorage.saveDocument({
        name: `Extracted_${file.name}`,
        size: file.size,
        type: 'application/json',
      });
      toast.success('Fields and tables extracted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to extract structured data.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="Extract Data from Invoices, Receipts & Resumes — Doclly AI"
        description="Automate data extraction from financial invoices, receipts, resumes, and contracts into Excel and CSV."
      />

      <Breadcrumb items={[{ label: 'AI Tools', to: '/ai' }, { label: 'Smart Data Extraction' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Smart Document Data Extraction
        </h1>
        <p className="text-sm text-[#6B7280]">
          Extract structured key-value pairs, line items, and totals into downloadable Excel and CSV files.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        {extractedResult ? (
          <div className="space-y-4">
            <StructuredDataPreview type={extractedResult.type as any} data={extractedResult.data} />
            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setExtractedResult(null);
                  setProgress(0);
                }}
              >
                Extract Another Document
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!file ? (
              <div className="space-y-6">
                {/* Doc Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Select Document Type to Extract
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'invoice', label: 'Invoices', desc: 'GST, vendor, line items', icon: Receipt },
                      { id: 'receipt', label: 'Receipts', desc: 'Retail, food, travel slips', icon: FileText },
                      { id: 'resume', label: 'Resumes', desc: 'Skills, work experience', icon: Briefcase },
                      { id: 'contract', label: 'Contracts', desc: 'Dates, liability, terms', icon: FileCheck },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isSelected = docType === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setDocType(t.id as any)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#111111] bg-[#FFC800]/20 ring-2 ring-[#FFC800]/50 shadow-2xs'
                              : 'border-[#E5E5E5] hover:bg-[#F5F5F5]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-[#111111]' : 'text-gray-500'}`} />
                          <div className="text-xs font-bold text-[#111111]">{t.label}</div>
                          <div className="text-[11px] text-[#6B7280]">{t.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <UploadZone
                  onFilesSelected={handleDocumentSelected}
                  acceptsDescription={`${docType} files (PDF, JPG, PNG, DOCX)`}
                  maxFiles={1}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                    <p className="text-xs text-[#6B7280]">
                      Target Schema: <span className="font-bold text-[#111111] capitalize">{docType}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-[#111111] font-bold hover:underline"
                  >
                    Change file
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    onClick={handleExtract}
                    leftIcon={<ScanText className="w-4 h-4" />}
                  >
                    Extract Fields & Tables
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Detecting layout and extracting tabular data..." />
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
