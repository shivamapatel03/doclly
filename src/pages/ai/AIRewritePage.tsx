import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { extractDocumentText, rewriteDocumentText } from '../../lib/ai-engine';
import { createDocxFromText } from '../../lib/office-engine';
import { downloadBlob } from '../../lib/utils';
import { Wand2, Download, Copy, Check } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

export const AIRewritePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'concise' | 'executive' | 'casual' | 'academic'>('professional');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleDocumentSelected = (files: File[]) => {
    if (files.length > 0) setFile(files[0]);
  };

  const handleRewrite = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const text = await extractDocumentText(file);
      setProgress(85);
      const result = await rewriteDocumentText(text, selectedTone);
      setProgress(100);

      setRewrittenText(result);
      DocumentStorage.saveDocument({
        name: `Rewritten_${selectedTone}_${file.name}`,
        size: file.size,
        type: 'text/plain',
      });
      toast.success(`Rewritten in ${selectedTone} tone!`);
    } catch {
      toast.error('Failed to rewrite document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!rewrittenText || !file) return;
    const paragraphs = rewrittenText.split('\n\n');
    const blob = await createDocxFromText(`Rewritten Document (${selectedTone})`, paragraphs);
    downloadBlob(blob, `Rewritten_${file.name.replace(/\.[^/.]+$/, '')}.docx`);
    toast.success('Word document downloaded!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="AI Document Rewriter — Polish & Refine — Doclly"
        description="Transform rough notes and drafts into polished professional reports with AI tone control."
      />

      <Breadcrumb items={[{ label: 'AI Tools', to: '/ai' }, { label: 'Rewrite & Polish' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          AI Document Rewriter & Polish
        </h1>
        <p className="text-sm text-[#6B7280]">
          Refine clarity, tone, and grammar for executive briefs, legal memos, and academic essays.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        {rewrittenText ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111111] capitalize">
                  Polished Output ({selectedTone} Tone)
                </h3>
                <p className="text-xs text-[#6B7280]">Enhanced flow, grammar, and structure</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  onClick={() => {
                    navigator.clipboard.writeText(rewrittenText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={handleDownloadDocx}
                >
                  Download DOCX
                </Button>
              </div>
            </div>

            <div className="p-5 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#111111] leading-relaxed whitespace-pre-wrap font-sans">
              {rewrittenText}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setRewrittenText(null);
                  setProgress(0);
                }}
              >
                Rewrite Another File
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!file ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Select Target Style & Tone
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { id: 'professional', label: 'Professional', desc: 'Standard business' },
                      { id: 'concise', label: 'Concise', desc: 'Direct & short' },
                      { id: 'executive', label: 'Executive', desc: 'C-level briefing' },
                      { id: 'casual', label: 'Friendly', desc: 'Warm & engaging' },
                      { id: 'academic', label: 'Academic', desc: 'Rigorous & formal' },
                    ].map((tone) => {
                      const isSelected = selectedTone === tone.id;
                      return (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setSelectedTone(tone.id as any)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-[#111111] bg-[#FFC800]/20 text-[#111111] ring-2 ring-[#FFC800]/50 shadow-2xs'
                              : 'border-[#E5E5E5] hover:bg-[#F5F5F5] text-[#111111]'
                          }`}
                        >
                          <div className="font-bold">{tone.label}</div>
                          <div className="text-[10px] text-[#6B7280]">{tone.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <UploadZone
                  onFilesSelected={handleDocumentSelected}
                  acceptsDescription="Draft document (PDF, Word, TXT)"
                  maxFiles={1}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                    <p className="text-xs text-[#6B7280]">
                      Target Tone: <span className="font-bold text-[#111111] capitalize">{selectedTone}</span>
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
                    onClick={handleRewrite}
                    leftIcon={<Wand2 className="w-4 h-4" />}
                  >
                    Rewrite & Refine
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Rewriting text with selected tone..." />
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
