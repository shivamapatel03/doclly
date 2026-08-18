import React, { useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { ThreeDIcon } from '../common/ThreeDIcon';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accepts?: string[];
  acceptsDescription?: string;
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  accepts = ['.pdf', '.docx', '.xlsx', '.pptx', '.jpg', '.png', 'application/pdf'],
  acceptsDescription = 'PDF, DOCX, XLSX, PPTX, JPG, PNG',
  maxFiles = 20,
  multiple = true,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const filesArray = Array.from(fileList);

    // Validate size (100 MB max)
    const MAX_SIZE = 100 * 1024 * 1024;
    const oversizedFiles = filesArray.filter((f) => f.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      setErrorMessage(`Some files exceed the 100 MB limit (${oversizedFiles.map((f) => f.name).join(', ')})`);
      return;
    }

    if (filesArray.length > maxFiles) {
      setErrorMessage(`You can upload a maximum of ${maxFiles} file(s) at once.`);
      onFilesSelected(filesArray.slice(0, maxFiles));
      return;
    }

    onFilesSelected(filesArray);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none overflow-hidden ${
          isDragging
            ? 'border-[#111111] bg-[#FFC800]/15 shadow-md scale-[1.01]'
            : 'border-[#E5E5E5] bg-white hover:border-[#111111]/40 hover:bg-[#FBFBFB] shadow-2xs hover:shadow-xs'
        } ${className}`}
      >
        {/* Subtle Textured Background Pattern inside drop zone */}
        <div className="absolute inset-0 doclly-dot-pattern opacity-40 pointer-events-none" />

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accepts.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {/* 3D Upload Icon without background container box */}
        <div className="relative z-10 mb-3 transition-transform duration-200 group-hover:scale-105">
          <ThreeDIcon name="upload" className="w-13 h-13" />
        </div>

        {/* Drop Text */}
        <div className="relative z-10 text-center space-y-1.5 max-w-sm">
          <p className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
            Drop your document here
          </p>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            or <span className="text-[#111111] font-bold underline decoration-[#FFC800] decoration-2">Browse files</span>
          </p>
          <p className="text-xs text-[#6B7280] pt-1">
            Supports {acceptsDescription} • <span className="font-semibold text-[#111111]">Max 100 MB</span>
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 px-3.5 py-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
