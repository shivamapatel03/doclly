import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { compressPdf } from '../../lib/pdf-engine';
import { downloadBytes, formatFileSize } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import { Minimize2, Sparkles } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

import { FileSession } from '../../lib/file-session';
import { useLocation } from 'react-router-dom';

export const CompressPdfPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'compress-pdf')!;
  const location = useLocation();
  const [file, setFile] = useState<File | null>(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    return f && f.name.toLowerCase().endsWith('.pdf') ? f : null;
  });
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'balanced' | 'high'>('balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [result, setResult] = useState<{
    data: Uint8Array;
    originalSize: number;
    newSize: number;
    percentageReduced: number;
  } | null>(null);

  const toast = useToast();

const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(25);

    try {
      setProgress(50);
      const res = await compressPdf(file, compressionLevel);
      setProgress(90);
      await new Promise((r) => setTimeout(r, 300));
      setProgress(100);

      setResult(res);
      DocumentStorage.saveDocument({
        name: `Compressed_${file.name}`,
        size: res.newSize,
        type: 'application/pdf',
      });
      toast.success(`Reduced file size by ${res.percentageReduced}%!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result && file) {
      downloadBytes(result.data, `compressed_${file.name}`, 'application/pdf');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask" />
      <SeoHead
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Compress PDF' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Compress PDF documents
        </h1>
        <p className="text-sm text-[#6B7280]">
          Reduce PDF file size while maintaining pristine text and image clarity.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs relative z-10">
        {result ? (
          <ResultDownloadCard
            filename={`compressed_${file?.name || 'document.pdf'}`}
            fileSize={result.newSize}
            originalSize={result.originalSize}
            reductionPercentage={result.percentageReduced}
            onDownload={handleDownload}
            onStartOver={() => {
              setFile(null);
              setResult(null);
              setProgress(0);
            }}
          />
        ) : (
          <>
            {!file ? (
              <div className="space-y-4">
                <UploadZone
                  onFilesSelected={(files) => files[0] && setFile(files[0])}
                  accepts={['.pdf', 'application/pdf']}
                  acceptsDescription="PDF documents"
                  maxFiles={1}
                />
                
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Preview Bar */}
                <div className="p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                    <p className="text-xs text-[#6B7280]">Original size: {formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-[#111111] font-bold hover:underline"
                  >
                    Change file
                  </button>
                </div>

                {/* Compression Level Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Select Compression Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'low',
                        title: 'Low Compression',
                        desc: 'Best quality, ~25% smaller',
                        badge: 'High Quality',
                      },
                      {
                        id: 'balanced',
                        title: 'Balanced',
                        desc: 'Optimal balance, ~45% smaller',
                        badge: 'Recommended',
                      },
                      {
                        id: 'high',
                        title: 'High Compression',
                        desc: 'Smallest size, ~65% smaller',
                        badge: 'Max Reduction',
                      },
                    ].map((lvl) => {
                      const isSelected = compressionLevel === lvl.id;
                      return (
                        <div
                          key={lvl.id}
                          onClick={() => setCompressionLevel(lvl.id as any)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#111111] bg-[#FFC800]/15 ring-2 ring-[#FFC800]/50 shadow-2xs'
                              : 'border-[#E5E5E5] hover:bg-[#F5F5F5]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#111111]">{lvl.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isSelected ? 'bg-[#FFC800] text-[#111111] border-[#E5E5E5]' : 'bg-white text-gray-600 border-[#E5E5E5]'
                            }`}>
                              {lvl.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B7280]">{lvl.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    onClick={handleCompress}
                    leftIcon={<Minimize2 className="w-4 h-4" />}
                  >
                    Compress PDF Now
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Optimizing streams and compressing PDF..." />
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

