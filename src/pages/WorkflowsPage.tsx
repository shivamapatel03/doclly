import React, { useState } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { WorkflowStepRunner } from '../components/workflows/WorkflowStepRunner';
import { WORKFLOW_PRESETS } from '../lib/constants';
import { WorkflowPreset } from '../types/document';
import { Layers, ArrowRight, Clock, Send, Receipt, Scale, GraduationCap } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Send,
  Receipt,
  Scale,
  GraduationCap,
  Layers,
};

export const WorkflowsPage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<WorkflowPreset | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SeoHead
        title="Document Pipelines — Doclly"
        description="Automate complex document operations into single-click multi-step pipelines."
      />

      <Breadcrumb items={[{ label: 'Workflows' }]} />

      {selectedPreset ? (
        <WorkflowStepRunner
          preset={selectedPreset}
          onBack={() => setSelectedPreset(null)}
        />
      ) : (
        <>
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Document Pipelines
            </h1>
            <p className="text-sm sm:text-base text-[#6B7280]">
              Chain multiple operations like compression, conversion, signature stamping, and OCR extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(WORKFLOW_PRESETS as WorkflowPreset[]).map((preset: WorkflowPreset) => {
              const Icon = ICON_MAP[preset.iconName] || Layers;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className="p-6 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-2xl cursor-pointer transition-all shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-[#111111]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <Clock className="w-3.5 h-3.5" />
                      {preset.estimatedSeconds}s
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#111111]">{preset.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{preset.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-bold text-[#111111]">
                    <span>Run Pipeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
