import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { extractDocumentText, generateDocumentSummary } from '../../lib/ai-engine';
import { Calendar, CheckSquare, Sparkles, Copy, Check } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

export const AISummarizePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const [summaryData, setSummaryData] = useState<{
    summary: string;
    keyPoints: string[];
    importantDates: string[];
    actionItems: string[];
  } | null>(null);

  const toast = useToast();

  const handleDocumentSelected = (files: File[]) => {
    if (files.length > 0) setFile(files[0]);
  };

  const handleSummarize = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const text = await extractDocumentText(file);
      setProgress(85);
      const result = await generateDocumentSummary(text);
      setProgress(100);

      setSummaryData(result);
      DocumentStorage.saveDocument({
        name: `Summary_${file.name}`,
        size: file.size,
        type: 'text/plain',
      });
      toast.success('Executive brief generated successfully!');
    } catch {
      toast.error('Failed to summarize document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!summaryData) return;
    const fullText = `EXECUTIVE SUMMARY\n${summaryData.summary}\n\nKEY POINTS\n${summaryData.keyPoints.map((k) => `• ${k}`).join('\n')}\n\nIMPORTANT DATES\n${summaryData.importantDates.map((d) => `• ${d}`).join('\n')}\n\nACTION ITEMS\n${summaryData.actionItems.map((a) => `• ${a}`).join('\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Summary copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="AI Document Summarizer — Executive Briefs — Doclly"
        description="Summarize lengthy research papers, contracts, and reports in seconds with AI."
      />

      <Breadcrumb items={[{ label: 'AI Tools', to: '/ai' }, { label: 'Summarize Document' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          AI Document Summarizer
        </h1>
        <p className="text-sm text-[#6B7280]">
          Get an executive brief, key points, deadlines, and action items from 50+ page documents.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        {summaryData ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header with copy */}
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#111111]" />
                <h3 className="text-base font-bold text-[#111111]">Executive Brief & Takeaways</h3>
              </div>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy All'}
              </Button>
            </div>

            {/* Overview */}
            <div className="p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                Executive Overview
              </h4>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{summaryData.summary}</p>
            </div>

            {/* Key Points & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-[#111111]" />
                  Key Points
                </h4>
                <ul className="space-y-1.5 text-xs text-[#6B7280]">
                  {summaryData.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#111111] font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#111111]" />
                  Important Dates & Deadlines
                </h4>
                <ul className="space-y-1.5 text-xs text-[#6B7280]">
                  {summaryData.importantDates.map((dt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#111111] font-bold">•</span>
                      <span>{dt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Items */}
            <div className="p-4 bg-[#FFC800]/15 border border-[#FFC800]/40 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Recommended Action Items
              </h4>
              <ul className="space-y-1.5 text-xs text-[#111111]">
                {summaryData.actionItems.map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setSummaryData(null);
                  setProgress(0);
                }}
              >
                Summarize Another Document
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!file ? (
              <UploadZone
                onFilesSelected={handleDocumentSelected}
                acceptsDescription="PDF, Word, or Text document"
                maxFiles={1}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                    <p className="text-xs text-[#6B7280]">Ready to generate executive brief</p>
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
                    onClick={handleSummarize}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Generate Summary
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Reading clauses and generating executive brief..." />
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
