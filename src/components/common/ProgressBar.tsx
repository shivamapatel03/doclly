import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  sublabel?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, sublabel }) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full space-y-2">
      {(label || sublabel) && (
        <div className="flex items-center justify-between text-xs text-[#111111] font-medium">
          <span>{label}</span>
          <span className="text-[#6B7280]">{sublabel || `${clamped}%`}</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden border border-[#E5E5E5]">
        <div
          className="h-full bg-[#FFC800] rounded-full transition-all duration-300 ease-out border-r border-[#111111]/20"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
