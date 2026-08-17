import React, { useState, useMemo } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { pdfToText } from '../../lib/pdf-engine';
import {
  GitCompare,
  Plus,
  Minus,
  Equal,
  FileText,
  BarChart3,
  RefreshCw,
  Check,
} from 'lucide-react';

// Simple word-level diff algorithm
type DiffChunk = { type: 'same' | 'add' | 'remove'; text: string };

function computeDiff(textA: string, textB: string): DiffChunk[] {
  const wordsA = textA.split(/\s+/).filter(Boolean);
  const wordsB = textB.split(/\s+/).filter(Boolean);

  // Build LCS via DP (limited to first 2000 words for performance)
  const aSlice = wordsA.slice(0, 2000);
  const bSlice = wordsB.slice(0, 2000);
  const m = aSlice.length;
  const n = bSlice.length;

  // dp[i][j] = lcs length for aSlice[0..i-1] and bSlice[0..j-1]
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aSlice[i - 1] === bSlice[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const chunks: DiffChunk[] = [];
  let i = m;
  let j = n;
  const ops: DiffChunk[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aSlice[i - 1] === bSlice[j - 1]) {
      ops.push({ type: 'same', text: aSlice[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: 'add', text: bSlice[j - 1] });
      j--;
    } else {
      ops.push({ type: 'remove', text: aSlice[i - 1] });
      i--;
    }
  }

  // Merge consecutive same-type ops into runs
  ops.reverse();
  let prev: DiffChunk | null = null;
  for (const op of ops) {
    if (prev && prev.type === op.type) {
      prev.text += ' ' + op.text;
    } else {
      prev = { type: op.type, text: op.text };
      chunks.push(prev);
    }
  }

  return chunks;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export const CompareDocumentsPage: React.FC = () => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compared, setCompared] = useState(false);
  const toast = useToast();

  const handleSelectA = async (files: File[]) => {
    if (!files[0]) return;
    setFileA(files[0]);
    setCompared(false);
    try {
      const txt = await pdfToText(files[0]);
      setTextA(txt);
    } catch {
      toast.error('Could not read document A. Make sure it is a valid PDF.');
    }
  };

  const handleSelectB = async (files: File[]) => {
    if (!files[0]) return;
    setFileB(files[0]);
    setCompared(false);
    try {
      const txt = await pdfToText(files[0]);
      setTextB(txt);
    } catch {
      toast.error('Could not read document B. Make sure it is a valid PDF.');
    }
  };

  const handleCompare = async () => {
    if (!textA || !textB) {
      toast.error('Please upload both documents first.');
      return;
    }
    setIsProcessing(true);
    setProgress(30);
    await new Promise((r) => setTimeout(r, 300));
    setProgress(80);
    await new Promise((r) => setTimeout(r, 200));
    setProgress(100);
    setCompared(true);
    setIsProcessing(false);
    toast.success('Comparison complete!');
  };

  const diffChunks = useMemo(
    () => (compared ? computeDiff(textA, textB) : []),
    [compared, textA, textB]
  );

  const addedWords = diffChunks.filter((c) => c.type === 'add').reduce((s, c) => s + c.text.split(/\s+/).length, 0);
  const removedWords = diffChunks.filter((c) => c.type === 'remove').reduce((s, c) => s + c.text.split(/\s+/).length, 0);
  const sameWords = diffChunks.filter((c) => c.type === 'same').reduce((s, c) => s + c.text.split(/\s+/).length, 0);
  const totalWords = addedWords + removedWords + sameWords;
  const similarity = totalWords > 0 ? Math.round((sameWords / totalWords) * 100) : 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SeoHead
        title="Compare PDF Documents Side by Side — Doclly"
        description="Upload two PDFs and see added, removed, and unchanged content highlighted with word-level diff analysis."
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Compare PDF' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Compare PDF Documents
        </h1>
        <p className="text-sm text-[#6B7280]">
          Upload two PDF documents to see a word-by-word diff highlighting additions, deletions, and shared content.
        </p>
      </div>

      {/* Upload Two Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Document A */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-extrabold">A</div>
            <h3 className="font-bold text-sm text-[#111111]">Original Document</h3>
          </div>

          {!fileA ? (
            <UploadZone
              onFilesSelected={handleSelectA}
              accepts={['.pdf', 'application/pdf']}
              acceptsDescription="Original PDF"
              maxFiles={1}
            />
          ) : (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#111111] truncate">{fileA.name}</p>
                  <p className="text-[11px] text-[#6B7280]">{countWords(textA).toLocaleString()} words extracted</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {textA && <Check className="w-4 h-4 text-emerald-500" />}
                <button
                  onClick={() => { setFileA(null); setTextA(''); setCompared(false); }}
                  className="text-[11px] text-[#6B7280] hover:text-[#111111] font-semibold cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Document B */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-extrabold">B</div>
            <h3 className="font-bold text-sm text-[#111111]">Revised Document</h3>
          </div>

          {!fileB ? (
            <UploadZone
              onFilesSelected={handleSelectB}
              accepts={['.pdf', 'application/pdf']}
              acceptsDescription="Revised PDF"
              maxFiles={1}
            />
          ) : (
            <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#111111] truncate">{fileB.name}</p>
                  <p className="text-[11px] text-[#6B7280]">{countWords(textB).toLocaleString()} words extracted</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {textB && <Check className="w-4 h-4 text-emerald-500" />}
                <button
                  onClick={() => { setFileB(null); setTextB(''); setCompared(false); }}
                  className="text-[11px] text-[#6B7280] hover:text-[#111111] font-semibold cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compare Button */}
      {fileA && fileB && !compared && (
        <div className="flex flex-col items-center gap-3">
          {isProcessing && <div className="w-full max-w-md"><ProgressBar progress={progress} /></div>}
          <Button
            onClick={handleCompare}
            disabled={isProcessing}
            size="lg"
            className="bg-[#111111] hover:bg-black text-white font-bold cursor-pointer px-10"
          >
            <GitCompare className="w-4 h-4 mr-2" />
            {isProcessing ? 'Analyzing Documents...' : 'Compare Documents'}
          </Button>
        </div>
      )}

      {/* Stats Summary */}
      {compared && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 text-center shadow-xs">
              <div className="text-2xl font-extrabold text-[#111111]">{similarity}%</div>
              <div className="text-xs text-[#6B7280] font-semibold mt-1">Similarity</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center shadow-xs">
              <div className="text-2xl font-extrabold text-emerald-600">+{addedWords}</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">Words Added</div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center shadow-xs">
              <div className="text-2xl font-extrabold text-red-600">-{removedWords}</div>
              <div className="text-xs text-red-700 font-semibold mt-1">Words Removed</div>
            </div>
            <div className="bg-gray-50 border border-[#E5E5E5] rounded-2xl p-4 text-center shadow-xs">
              <div className="text-2xl font-extrabold text-[#111111]">{sameWords}</div>
              <div className="text-xs text-[#6B7280] font-semibold mt-1">Unchanged Words</div>
            </div>
          </div>

          {/* Similarity Bar */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
              <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5 text-amber-500" /> Content Similarity</span>
              <span>{similarity}% match</span>
            </div>
            <div className="h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  similarity > 80 ? 'bg-emerald-400' :
                  similarity > 50 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${similarity}%` }}
              />
            </div>
            <div className="flex gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-200 border border-emerald-400" />Added in B</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-200 border border-red-400" />Removed from A</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-gray-100 border border-gray-300" />Unchanged</span>
            </div>
          </div>

          {/* Diff Viewer */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#111111]">
                <GitCompare className="w-4 h-4 text-[#111111]" />
                <span>Word-Level Diff Viewer</span>
              </div>
              <button
                onClick={() => { setCompared(false); }}
                className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#111111] font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Re-compare
              </button>
            </div>

            <div className="p-5 max-h-[500px] overflow-y-auto">
              <div className="text-sm leading-relaxed font-mono">
                {diffChunks.map((chunk, idx) => {
                  if (chunk.type === 'same') {
                    return <span key={idx} className="text-[#333333]">{chunk.text} </span>;
                  }
                  if (chunk.type === 'add') {
                    return (
                      <span key={idx} className="bg-emerald-100 text-emerald-800 px-0.5 rounded border-b-2 border-emerald-400">
                        {chunk.text}{' '}
                      </span>
                    );
                  }
                  return (
                    <span key={idx} className="bg-red-100 text-red-800 line-through px-0.5 rounded border-b-2 border-red-400">
                      {chunk.text}{' '}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* New compare button */}
          <div className="text-center">
            <Button
              onClick={() => { setFileA(null); setFileB(null); setTextA(''); setTextB(''); setCompared(false); }}
              variant="outline"
              size="sm"
            >
              Compare New Documents
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
