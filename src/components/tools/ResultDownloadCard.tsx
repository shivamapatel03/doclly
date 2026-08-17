import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, RotateCcw, Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../common/Button';
import { formatFileSize } from '../../lib/utils';

interface ResultDownloadCardProps {
  filename: string;
  fileSize?: number;
  originalSize?: number;
  reductionPercentage?: number;
  onDownload: () => void;
  onStartOver: () => void;
  title?: string;
  description?: string;
}

export const ResultDownloadCard: React.FC<ResultDownloadCardProps> = ({
  filename,
  fileSize,
  originalSize,
  reductionPercentage,
  onDownload,
  onStartOver,
  title = 'Your document is ready',
  description = 'Processing completed successfully. You can download your file now.',
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFC800', '#111111', '#10B981', '#F5F5F5'],
      });
    } catch {
      // Ignore in environments without canvas
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white border border-[#E5E5E5] rounded-2xl text-center space-y-6 animate-in zoom-in-95 duration-200 shadow-2xs">
      {/* Success Badge */}
      <div className="w-14 h-14 bg-[#FFC800]/20 text-[#111111] rounded-2xl flex items-center justify-center mx-auto border border-[#FFC800]/40">
        <CheckCircle2 className="w-7 h-7 text-[#111111]" />
      </div>

      {/* Heading & Subtitle */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">{title}</h2>
        <p className="text-xs sm:text-sm text-[#6B7280]">{description}</p>
      </div>

      {/* File Info Box */}
      <div className="p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] flex items-center justify-between text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E5E5] text-[#111111] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111111] truncate">{filename}</p>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              {fileSize !== undefined && <span>{formatFileSize(fileSize)}</span>}
              {originalSize !== undefined && (
                <span className="line-through text-gray-400">
                  {formatFileSize(originalSize)}
                </span>
              )}
            </div>
          </div>
        </div>

        {reductionPercentage !== undefined && reductionPercentage > 0 && (
          <span className="px-2.5 py-1 text-xs font-bold text-[#111111] bg-[#FFC800] border border-[#E5E5E5] rounded-full shrink-0">
            -{reductionPercentage}%
          </span>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          size="lg"
          variant="primary"
          leftIcon={<Download className="w-5 h-5" />}
          onClick={onDownload}
          className="w-full sm:w-auto px-8"
        >
          Download File
        </Button>

        <Button
          size="lg"
          variant="secondary"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={onStartOver}
          className="w-full sm:w-auto"
        >
          Start Over
        </Button>
      </div>

      {/* Next Smart Steps: AI Prompt Card */}
      <div className="pt-4 border-t border-[#E5E5E5] text-left">
        <div className="p-3.5 bg-[#FFC800]/10 border border-[#FFC800]/30 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#111111] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#111111]">Want to ask questions or extract data?</p>
              <p className="text-[11px] text-[#6B7280]">Open this document directly in Doclly AI Assistant</p>
            </div>
          </div>
          <Link
            to="/ai"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] hover:underline whitespace-nowrap"
          >
            Chat with AI <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
