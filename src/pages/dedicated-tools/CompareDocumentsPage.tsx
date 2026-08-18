import React, { useState, useMemo } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { pdfToText, generatePdfThumbnails } from '../../lib/pdf-engine';
import { downloadBlob } from '../../lib/utils';
import { getFile3DIcon } from '../../components/common/ThreeDIcon';
import * as Diff from 'diff';
import JSZip from 'jszip';
import {
  GitCompare,
  Plus,
  Minus,
  FileText,
  BarChart3,
  RefreshCw,
  Check,
  ArrowLeftRight,
  Download,
  Copy,
  Split,
  AlignLeft,
  Images,
  Maximize2,
  X,
  FileCheck,
} from 'lucide-react';

async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return await pdfToText(file);
  }

  if (ext === 'docx' || ext === 'doc') {
    try {
      const zip = await JSZip.loadAsync(file);
      const docXml = await zip.file('word/document.xml')?.async('text');
      if (docXml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(docXml, 'application/xml');
        const paragraphs = Array.from(xmlDoc.getElementsByTagName('w:p'));
        const textContent = paragraphs
          .map((p) => p.textContent?.trim() || '')
          .filter(Boolean)
          .join('\n\n');
        if (textContent.length > 0) return textContent;
      }
    } catch {
      // Fallback to text
    }
  }

  return await file.text();
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const CompareDocumentsPage: React.FC = () => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [thumbnailsA, setThumbnailsA] = useState<{ [pageIdx: number]: string }>({});
  const [thumbnailsB, setThumbnailsB] = useState<{ [pageIdx: number]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compared, setCompared] = useState(false);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified' | 'visual'>('side-by-side');
  const [diffGranularity, setDiffGranularity] = useState<'words' | 'lines'>('words');
  const [copied, setCopied] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string } | null>(null);

  const toast = useToast();

  const handleSelectA = async (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setFileA(f);
    setCompared(false);
    setThumbnailsA({});
    try {
      const txt = await extractTextFromFile(f);
      setTextA(txt);

      if (f.name.toLowerCase().endsWith('.pdf')) {
        generatePdfThumbnails(f, (pageIdx, dataUrl) => {
          setThumbnailsA((prev) => ({ ...prev, [pageIdx]: dataUrl }));
        });
      }
    } catch {
      toast.error('Could not extract text from Document A.');
    }
  };

  const handleSelectB = async (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setFileB(f);
    setCompared(false);
    setThumbnailsB({});
    try {
      const txt = await extractTextFromFile(f);
      setTextB(txt);

      if (f.name.toLowerCase().endsWith('.pdf')) {
        generatePdfThumbnails(f, (pageIdx, dataUrl) => {
          setThumbnailsB((prev) => ({ ...prev, [pageIdx]: dataUrl }));
        });
      }
    } catch {
      toast.error('Could not extract text from Document B.');
    }
  };

  const handleSwap = () => {
    const tempFile = fileA;
    const tempText = textA;
    const tempThumbs = thumbnailsA;

    setFileA(fileB);
    setTextA(textB);
    setThumbnailsA(thumbnailsB);

    setFileB(tempFile);
    setTextB(tempText);
    setThumbnailsB(tempThumbs);

    toast.info('Swapped Original and Revised documents.');
  };

  const handleCompare = async () => {
    if (!textA && !textB) {
      toast.error('Please upload both documents first.');
      return;
    }
    setIsProcessing(true);
    setProgress(30);
    await new Promise((r) => setTimeout(r, 200));
    setProgress(75);
    await new Promise((r) => setTimeout(r, 150));
    setProgress(100);
    setCompared(true);
    setIsProcessing(false);
    toast.success('Document comparison complete!');
  };

  // Diff Calculations
  const wordDiff = useMemo(() => {
    if (!compared) return [];
    return Diff.diffWordsWithSpace(textA, textB);
  }, [compared, textA, textB]);

  const lineDiff = useMemo(() => {
    if (!compared) return [];
    return Diff.diffLines(textA, textB);
  }, [compared, textA, textB]);

  const activeDiff = diffGranularity === 'words' ? wordDiff : lineDiff;

  // Stats
  const addedCount = useMemo(() => {
    return wordDiff
      .filter((c) => c.added)
      .reduce((sum, c) => sum + countWords(c.value), 0);
  }, [wordDiff]);

  const removedCount = useMemo(() => {
    return wordDiff
      .filter((c) => c.removed)
      .reduce((sum, c) => sum + countWords(c.value), 0);
  }, [wordDiff]);

  const unchangedCount = useMemo(() => {
    return wordDiff
      .filter((c) => !c.added && !c.removed)
      .reduce((sum, c) => sum + countWords(c.value), 0);
  }, [wordDiff]);

  const totalWords = addedCount + removedCount + unchangedCount;
  const similarity = totalWords > 0 ? Math.round((unchangedCount / (unchangedCount + Math.max(addedCount, removedCount))) * 100) : 100;

  const handleExportReport = () => {
    const header = `======================================================
DOCLLY DOCUMENT COMPARISON REPORT
======================================================
Original Document (A): ${fileA?.name || 'Document A'} (${countWords(textA)} words)
Revised Document (B):  ${fileB?.name || 'Document B'} (${countWords(textB)} words)
Date:                  ${new Date().toLocaleString()}
Content Similarity:    ${similarity}%
Words Added:          +${addedCount}
Words Removed:        -${removedCount}
Unchanged Words:       ${unchangedCount}
======================================================

UNIFIED DIFF OUTPUT:
`;
    const diffBody = wordDiff
      .map((c) => {
        if (c.added) return `\n[+ ADDED]: ${c.value.trim()}\n`;
        if (c.removed) return `\n[- REMOVED]: ${c.value.trim()}\n`;
        return c.value;
      })
      .join('');

    const fullReport = header + '\n' + diffBody;
    const blob = new Blob([fullReport], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `comparison_report_${fileA?.name || 'docA'}_vs_${fileB?.name || 'docB'}.txt`);
    toast.success('Downloaded comparison report!');
  };

  const handleCopySummary = () => {
    const summary = `Comparison Summary (${fileA?.name} vs ${fileB?.name}):\nSimilarity: ${similarity}%\nWords Added: +${addedCount}\nWords Removed: -${removedCount}\nUnchanged: ${unchangedCount}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Summary copied to clipboard!');
  };

  const isBothPdf = fileA?.name.toLowerCase().endsWith('.pdf') && fileB?.name.toLowerCase().endsWith('.pdf');
  const maxPages = Math.max(Object.keys(thumbnailsA).length, Object.keys(thumbnailsB).length);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SeoHead
        title="Compare Documents Side by Side — Doclly"
        description="Upload two PDF or Word documents and compare them side by side with word-level diff, similarity metrics, and visual comparison."
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Compare Documents' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Compare Documents Side by Side
        </h1>
        <p className="text-sm text-[#6B7280]">
          Compare two PDF, Word, or text files to instantly detect additions, deletions, and structural revisions.
        </p>
      </div>

      {/* Upload Two Files with Swap Button */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Document A */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-extrabold">
                  A
                </div>
                <h3 className="font-bold text-sm text-[#111111]">Original Document</h3>
              </div>
              {fileA && (
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {countWords(textA).toLocaleString()} words
                </span>
              )}
            </div>

            {!fileA ? (
              <UploadZone
                onFilesSelected={handleSelectA}
                accepts={['.pdf', '.docx', '.doc', '.txt', '.csv', '.md', 'application/pdf']}
                acceptsDescription="Original PDF or Word (.docx)"
                maxFiles={1}
              />
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">{getFile3DIcon(fileA.name)}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#111111] truncate">{fileA.name}</p>
                    <p className="text-[11px] text-[#6B7280]">
                      {(fileA.size / 1024).toFixed(1)} KB • {countWords(textA).toLocaleString()} words extracted
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setFileA(null);
                      setTextA('');
                      setThumbnailsA({});
                      setCompared(false);
                    }}
                    className="text-xs text-[#6B7280] hover:text-[#111111] font-semibold cursor-pointer px-2 py-1 bg-white border border-[#E5E5E5] rounded-lg shadow-2xs"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Document B */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-extrabold">
                  B
                </div>
                <h3 className="font-bold text-sm text-[#111111]">Revised Document</h3>
              </div>
              {fileB && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {countWords(textB).toLocaleString()} words
                </span>
              )}
            </div>

            {!fileB ? (
              <UploadZone
                onFilesSelected={handleSelectB}
                accepts={['.pdf', '.docx', '.doc', '.txt', '.csv', '.md', 'application/pdf']}
                acceptsDescription="Revised PDF or Word (.docx)"
                maxFiles={1}
              />
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">{getFile3DIcon(fileB.name)}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#111111] truncate">{fileB.name}</p>
                    <p className="text-[11px] text-[#6B7280]">
                      {(fileB.size / 1024).toFixed(1)} KB • {countWords(textB).toLocaleString()} words extracted
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setFileB(null);
                      setTextB('');
                      setThumbnailsB({});
                      setCompared(false);
                    }}
                    className="text-xs text-[#6B7280] hover:text-[#111111] font-semibold cursor-pointer px-2 py-1 bg-white border border-[#E5E5E5] rounded-lg shadow-2xs"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Swap Button (Floating Center) */}
        {fileA && fileB && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
            <button
              onClick={handleSwap}
              title="Swap Document A and Document B"
              className="p-2.5 bg-white border border-[#E5E5E5] rounded-full shadow-md hover:scale-110 hover:bg-[#FFC800] text-[#111111] transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Compare Action Button */}
      {fileA && fileB && !compared && (
        <div className="flex flex-col items-center gap-3">
          {isProcessing && (
            <div className="w-full max-w-md space-y-1">
              <ProgressBar progress={progress} />
              <p className="text-xs text-center text-[#6B7280]">Running full text diff analysis...</p>
            </div>
          )}
          <Button
            onClick={handleCompare}
            disabled={isProcessing}
            size="lg"
            className="bg-[#FFC800] text-[#111111] hover:bg-[#E6B400] font-bold cursor-pointer px-10 shadow-2xs"
          >
            <GitCompare className="w-4 h-4 mr-2" />
            {isProcessing ? 'Analyzing Documents...' : 'Compare Documents'}
          </Button>
        </div>
      )}

      {/* Comparison Results */}
      {compared && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 text-center shadow-xs">
              <div className="text-2xl font-extrabold text-[#111111]">{similarity}%</div>
              <div className="text-xs text-[#6B7280] font-semibold mt-1">Content Similarity</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center shadow-xs">
              <div className="text-2xl font-extrabold text-emerald-600">+{addedCount.toLocaleString()}</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">Words Added</div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center shadow-xs">
              <div className="text-2xl font-extrabold text-red-600">-{removedCount.toLocaleString()}</div>
              <div className="text-xs text-red-700 font-semibold mt-1">Words Removed</div>
            </div>
            <div className="bg-gray-50 border border-[#E5E5E5] rounded-2xl p-4 text-center shadow-xs">
              <div className="text-2xl font-extrabold text-[#111111]">{unchangedCount.toLocaleString()}</div>
              <div className="text-xs text-[#6B7280] font-semibold mt-1">Unchanged Words</div>
            </div>
          </div>

          {/* Similarity Progress Bar */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-amber-500" /> Match Score
              </span>
              <span>{similarity}% identical</span>
            </div>
            <div className="h-2.5 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  similarity > 80 ? 'bg-emerald-500' : similarity > 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${similarity}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E5E5E5]">
              <div className="flex gap-4 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-200 border border-emerald-400" />
                  Added in B (+{addedCount})
                </span>
                <span className="flex items-center gap-1.5 text-red-700">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-200 border border-red-400" />
                  Removed from A (-{removedCount})
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-gray-100 border border-gray-300" />
                  Unchanged ({unchangedCount})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-[#F5F5F5] hover:bg-[#EAEAEA] rounded-lg text-[#111111] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  onClick={handleExportReport}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-[#111111] hover:bg-black text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Diff Report
                </button>
              </div>
            </div>
          </div>

          {/* View Mode & Granularity Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E5E5E5] rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] p-1 rounded-xl">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'side-by-side'
                    ? 'bg-white text-[#111111] shadow-2xs'
                    : 'text-[#6B7280] hover:text-[#111111]'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'unified'
                    ? 'bg-white text-[#111111] shadow-2xs'
                    : 'text-[#6B7280] hover:text-[#111111]'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                Unified View
              </button>
              {isBothPdf && (
                <button
                  onClick={() => setViewMode('visual')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'visual'
                      ? 'bg-white text-[#111111] shadow-2xs'
                      : 'text-[#6B7280] hover:text-[#111111]'
                  }`}
                >
                  <Images className="w-3.5 h-3.5" />
                  Visual Pages
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280]">Granularity:</span>
              <div className="flex items-center gap-1 bg-[#F5F5F5] p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setDiffGranularity('words')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                    diffGranularity === 'words' ? 'bg-white text-[#111111] shadow-2xs' : 'text-[#6B7280]'
                  }`}
                >
                  Words
                </button>
                <button
                  onClick={() => setDiffGranularity('lines')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                    diffGranularity === 'lines' ? 'bg-white text-[#111111] shadow-2xs' : 'text-[#6B7280]'
                  }`}
                >
                  Lines
                </button>
              </div>
            </div>
          </div>

          {/* MAIN DIFF VIEWER */}
          {viewMode === 'side-by-side' && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
              <div className="grid grid-cols-2 border-b border-[#E5E5E5] bg-[#F9F9F9] text-xs font-bold text-[#111111]">
                <div className="px-5 py-3 border-r border-[#E5E5E5] flex items-center justify-between">
                  <span>Document A: {fileA?.name} (Original)</span>
                  <span className="text-red-600 font-mono">-{removedCount} words</span>
                </div>
                <div className="px-5 py-3 flex items-center justify-between">
                  <span>Document B: {fileB?.name} (Revised)</span>
                  <span className="text-emerald-600 font-mono">+{addedCount} words</span>
                </div>
              </div>

              <div className="grid grid-cols-2 text-xs font-mono max-h-[550px] overflow-y-auto divide-x divide-[#E5E5E5]">
                {/* Left Column: Original with Deletions */}
                <div className="p-5 whitespace-pre-wrap leading-relaxed">
                  {activeDiff.map((chunk, idx) => {
                    if (chunk.added) return null;
                    if (chunk.removed) {
                      return (
                        <span
                          key={idx}
                          className="bg-red-100 text-red-900 line-through px-0.5 rounded border-b border-red-300"
                        >
                          {chunk.value}
                        </span>
                      );
                    }
                    return <span key={idx} className="text-[#333333]">{chunk.value}</span>;
                  })}
                </div>

                {/* Right Column: Revised with Additions */}
                <div className="p-5 whitespace-pre-wrap leading-relaxed">
                  {activeDiff.map((chunk, idx) => {
                    if (chunk.removed) return null;
                    if (chunk.added) {
                      return (
                        <span
                          key={idx}
                          className="bg-emerald-100 text-emerald-900 font-semibold px-0.5 rounded border-b border-emerald-300"
                        >
                          {chunk.value}
                        </span>
                      );
                    }
                    return <span key={idx} className="text-[#333333]">{chunk.value}</span>;
                  })}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'unified' && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E5E5E5] bg-[#F9F9F9] flex items-center justify-between text-xs font-bold text-[#111111]">
                <span>Unified Inline Diff</span>
                <span className="text-[#6B7280] font-mono">Showing combined differences in context</span>
              </div>
              <div className="p-5 max-h-[550px] overflow-y-auto text-xs font-mono leading-relaxed whitespace-pre-wrap">
                {activeDiff.map((chunk, idx) => {
                  if (chunk.added) {
                    return (
                      <span
                        key={idx}
                        className="bg-emerald-100 text-emerald-900 font-semibold px-1 py-0.5 rounded border-b-2 border-emerald-400 mx-0.5 inline-block"
                      >
                        +{chunk.value}
                      </span>
                    );
                  }
                  if (chunk.removed) {
                    return (
                      <span
                        key={idx}
                        className="bg-red-100 text-red-900 line-through px-1 py-0.5 rounded border-b-2 border-red-400 mx-0.5 inline-block"
                      >
                        -{chunk.value}
                      </span>
                    );
                  }
                  return <span key={idx} className="text-[#333333]">{chunk.value}</span>;
                })}
              </div>
            </div>
          )}

          {viewMode === 'visual' && isBothPdf && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 text-xs font-bold text-[#111111]">
                <span>Visual Page-by-Page Comparison ({maxPages} pages)</span>
                <span className="text-[#6B7280]">Click any page to zoom in full resolution</span>
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto p-1">
                {Array.from({ length: maxPages }, (_, i) => i).map((pageIdx) => {
                  const thumbA = thumbnailsA[pageIdx];
                  const thumbB = thumbnailsB[pageIdx];

                  return (
                    <div key={pageIdx} className="border border-[#E5E5E5] rounded-2xl p-4 bg-[#F9F9F9] space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                        <span>Page {pageIdx + 1}</span>
                        <div className="flex gap-4">
                          <span className="text-blue-600">Doc A (Original)</span>
                          <span className="text-emerald-600">Doc B (Revised)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Page A */}
                        <div
                          onClick={() => thumbA && setLightboxImg({ src: thumbA, title: `Doc A - Page ${pageIdx + 1}` })}
                          className="aspect-[3/4] bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-2xs relative group cursor-pointer flex items-center justify-center"
                        >
                          {thumbA ? (
                            <>
                              <img src={thumbA} alt={`Doc A Page ${pageIdx + 1}`} className="w-full h-full object-contain" />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="p-2 bg-white rounded-lg text-xs font-bold text-[#111111] shadow-md flex items-center gap-1">
                                  <Maximize2 className="w-3.5 h-3.5" /> Zoom Page A
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">Page {pageIdx + 1} not in Doc A</span>
                          )}
                        </div>

                        {/* Page B */}
                        <div
                          onClick={() => thumbB && setLightboxImg({ src: thumbB, title: `Doc B - Page ${pageIdx + 1}` })}
                          className="aspect-[3/4] bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-2xs relative group cursor-pointer flex items-center justify-center"
                        >
                          {thumbB ? (
                            <>
                              <img src={thumbB} alt={`Doc B Page ${pageIdx + 1}`} className="w-full h-full object-contain" />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="p-2 bg-white rounded-lg text-xs font-bold text-[#111111] shadow-md flex items-center gap-1">
                                  <Maximize2 className="w-3.5 h-3.5" /> Zoom Page B
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">Page {pageIdx + 1} not in Doc B</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-between items-center pt-2">
            <Button
              onClick={() => {
                setFileA(null);
                setFileB(null);
                setTextA('');
                setTextB('');
                setThumbnailsA({});
                setThumbnailsB({});
                setCompared(false);
              }}
              variant="secondary"
              size="sm"
            >
              Compare Different Documents
            </Button>

            <Button
              onClick={handleCompare}
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-run Comparison
            </Button>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5]">
              <h4 className="font-bold text-sm text-[#111111]">{lightboxImg.title}</h4>
              <button
                onClick={() => setLightboxImg(null)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex items-center justify-center bg-[#F5F5F5]">
              <img src={lightboxImg.src} alt="Preview" className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
