import React, { useEffect } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../common/Button';
import { formatFileSize } from '../../lib/utils';
import { DocReady3DIcon, ThreeDIcon, getFile3DIcon } from '../common/ThreeDIcon';

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
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFC800', '#111111', '#10B981', '#F5F5F5'],
      });
    } catch {
      // Ignore in environments without canvas
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-3.5 py-1 animate-in zoom-in-95 duration-200">
      {/* 3D Success Document Ready Icon */}
      <div className="w-12 h-12 flex items-center justify-center mx-auto">
        <DocReady3DIcon className="w-12 h-12" />
      </div>

      {/* Heading & Subtitle */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#111111] tracking-tight">{title}</h2>
        <p className="text-xs text-[#6B7280]">{description}</p>
      </div>

      {/* Compact File Info Box */}
      <div className="p-3 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] flex items-center justify-between text-left">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            {getFile3DIcon(filename, 'w-7 h-7')}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#111111] truncate">{filename}</p>
            <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
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
          <span className="px-2 py-0.5 text-[11px] font-bold text-[#111111] bg-[#FFC800] border border-[#E5E5E5] rounded-full shrink-0">
            -{reductionPercentage}%
          </span>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center justify-center gap-2.5 pt-1">
        <Button
          size="md"
          variant="primary"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={onDownload}
          className="px-6 font-bold cursor-pointer"
        >
          Download File
        </Button>

        <Button
          size="md"
          variant="secondary"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={onStartOver}
          className="px-4 cursor-pointer"
        >
          Start Over
        </Button>
      </div>
    </div>
  );
};
