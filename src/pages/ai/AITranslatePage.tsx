import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { extractDocumentText, translateDocumentText } from '../../lib/ai-engine';
import { createDocxFromText } from '../../lib/office-engine';
import { downloadBlob } from '../../lib/utils';
import { Languages, Download, Copy, Check } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

const SUPPORTED_LANGUAGES = [
  { id: 'gujarati', name: 'Gujarati (ગુજરાતી)', regional: true },
  { id: 'hindi', name: 'Hindi (हिन्दी)', regional: true },
  { id: 'spanish', name: 'Spanish (Español)', regional: false },
  { id: 'french', name: 'French (Français)', regional: false },
  { id: 'german', name: 'German (Deutsch)', regional: false },
  { id: 'japanese', name: 'Japanese (日本語)', regional: false },
  { id: 'marathi', name: 'Marathi (मराठी)', regional: true },
  { id: 'tamil', name: 'Tamil (தமிழ்)', regional: true },
];

export const AITranslatePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState('gujarati');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleDocumentSelected = (files: File[]) => {
    if (files.length > 0) setFile(files[0]);
  };

  const handleTranslate = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const text = await extractDocumentText(file);
      setProgress(85);
      const translated = await translateDocumentText(text, targetLang);
      setProgress(100);

      setTranslatedText(translated);
      DocumentStorage.saveDocument({
        name: `Translated_${targetLang}_${file.name}`,
        size: file.size,
        type: 'text/plain',
        data: translated,
      });
      toast.success(`Translated into ${targetLang} successfully!`);
    } catch {
      toast.error('Translation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!translatedText || !file) return;
    const paragraphs = translatedText.split('\n\n');
    const blob = await createDocxFromText(`Translated (${targetLang})`, paragraphs);
    downloadBlob(blob, `Translated_${targetLang}_${file.name.replace(/\.[^/.]+$/, '')}.docx`);
    toast.success('Word document downloaded!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="Translate Documents Online — 40+ Languages — Doclly"
        description="Translate PDF and Word documents into regional languages like Gujarati and Hindi, or global languages accurately."
      />

      <Breadcrumb items={[{ label: 'AI Tools', to: '/ai' }, { label: 'Translate Document' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          AI Document Translation
        </h1>
        <p className="text-sm text-[#6B7280]">
          Translate contracts, reports, and study packs into Gujarati, Hindi, Spanish, French, and 40+ languages.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        {translatedText ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111111] capitalize">
                  Translation Output ({targetLang})
                </h3>
                <p className="text-xs text-[#6B7280]">Layout and terminology preserved</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  onClick={() => {
                    navigator.clipboard.writeText(translatedText);
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
              {translatedText}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setTranslatedText(null);
                  setProgress(0);
                }}
              >
                Translate Another File
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!file ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Select Target Language
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = targetLang === lang.id;
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setTargetLang(lang.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-[#111111] bg-[#FFC800]/20 text-[#111111] ring-2 ring-[#FFC800]/50 shadow-2xs'
                              : 'border-[#E5E5E5] hover:bg-[#F5F5F5] text-[#111111]'
                          }`}
                        >
                          <div className="font-bold truncate">{lang.name}</div>
                          {lang.regional && (
                            <span className="text-[10px] text-[#111111] font-bold bg-[#FFC800] px-1.5 py-0.2 rounded-full mt-1 inline-block">
                              Regional
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <UploadZone
                  onFilesSelected={handleDocumentSelected}
                  acceptsDescription="PDF, Word, or Text document"
                  maxFiles={1}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                    <p className="text-xs text-[#6B7280]">
                      Target Language: <span className="font-bold text-[#111111] capitalize">{targetLang}</span>
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
                    onClick={handleTranslate}
                    leftIcon={<Languages className="w-4 h-4" />}
                  >
                    Translate Document
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Translating clauses and formatting text..." />
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
