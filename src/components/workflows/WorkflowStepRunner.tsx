import React, { useState } from 'react';
import { WorkflowPreset } from '../../types/document';
import { UploadZone } from '../tools/UploadZone';
import { ResultDownloadCard } from '../tools/ResultDownloadCard';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { downloadBytes } from '../../lib/utils';
import { createSamplePdf } from '../../lib/pdf-engine';

interface WorkflowStepRunnerProps {
  preset: WorkflowPreset;
  onBack: () => void;
}

export const WorkflowStepRunner: React.FC<WorkflowStepRunnerProps> = ({ preset, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const handleStartWorkflow = async (file: File) => {
    setUploadedFile(file);
    setIsRunning(true);
    setCurrentStepIndex(1);

    // Sequentially step through the workflow
    for (let i = 1; i < preset.steps.length; i++) {
      setCurrentStepIndex(i);
      // Wait for step simulation
      await new Promise((r) => setTimeout(r, 1200));
      setCompletedSteps((prev) => [...prev, i]);
    }

    // Generate output
    const { bytes } = await createSamplePdf(`Final_${preset.title.replace(/\s+/g, '_')}.pdf`, 4);
    setResultBytes(bytes);
    setIsRunning(false);
    setIsDone(true);
  };

  const handleDownload = () => {
    if (resultBytes) {
      downloadBytes(resultBytes, `Final_${preset.id}_processed.pdf`, 'application/pdf');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-[#6B7280] hover:text-[#111111] mb-1 flex items-center gap-1"
          >
            ← Back to all workflows
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">{preset.title}</h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">{preset.description}</p>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 text-xs font-bold text-[#111111] bg-[#FFC800] border border-[#E5E5E5] rounded-full shadow-2xs">
          ~{preset.estimatedSeconds}s pipeline
        </span>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {preset.steps.map((step, idx) => {
          const isComplete = completedSteps.includes(idx);
          const isCurrent = currentStepIndex === idx && isRunning;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all ${
                isComplete
                  ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                  : isCurrent
                  ? 'border-[#111111] bg-[#FFC800]/20 text-[#111111] ring-2 ring-[#FFC800]/50'
                  : 'border-[#E5E5E5] bg-white text-[#6B7280]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                  Step {idx + 1}
                </span>
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#111111] shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                )}
              </div>
              <div className="text-xs font-bold text-[#111111] truncate">{step.name}</div>
            </div>
          );
        })}
      </div>

      {/* Main Execution Area */}
      <div className="p-6 sm:p-8 bg-white border border-[#E5E5E5] rounded-2xl shadow-2xs">
        {!uploadedFile && !isRunning && !isDone && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#111111]">
                Step 1: Upload source document to initiate pipeline
              </h3>
              <p className="text-xs text-[#6B7280]">
                All subsequent operations will run automatically in sequence.
              </p>
            </div>
            <UploadZone
              onFilesSelected={(files) => files[0] && handleStartWorkflow(files[0])}
              acceptsDescription="Any document (PDF, Word, Excel, Images)"
              maxFiles={1}
            />
          </div>
        )}

        {isRunning && (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC800]/20 text-[#111111] flex items-center justify-center mx-auto border border-[#FFC800]/40">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#111111]">
                Executing {preset.steps[currentStepIndex]?.name}...
              </h3>
              <p className="text-xs text-[#6B7280]">
                {preset.steps[currentStepIndex]?.description || 'Processing document step...'}
              </p>
            </div>
          </div>
        )}

        {isDone && (
          <ResultDownloadCard
            filename={`Processed_${preset.id}.pdf`}
            title="Multi-step Workflow Completed!"
            description={`Successfully executed all ${preset.steps.length} operations seamlessly.`}
            onDownload={handleDownload}
            onStartOver={() => {
              setUploadedFile(null);
              setIsDone(false);
              setCompletedSteps([]);
              setCurrentStepIndex(0);
            }}
          />
        )}
      </div>
    </div>
  );
};
