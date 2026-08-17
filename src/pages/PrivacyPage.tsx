import React from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Shield, Lock, EyeOff, RefreshCw } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SeoHead
        title="Privacy, Security & Retention Policy — Doclly"
        description="Learn how Doclly protects your documents with client-side zero-retention architecture, TLS 1.3 encryption, and strict AI data isolation."
      />

      <Breadcrumb items={[{ label: 'Privacy & Security' }]} />

      {/* Header */}
      <div className="space-y-3 border-b border-[#E5E5E5] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#111111] bg-[#FFC800]/20 border border-[#FFC800]/40">
          <Shield className="w-3.5 h-3.5 text-[#111111]" />
          <span>Zero-Retention Privacy Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Privacy & Document Security
        </h1>
        <p className="text-sm text-[#6B7280]">
          Last updated: August 17, 2026 • Effective immediately
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#111111]">Client-Side Processing</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Core PDF and spreadsheet operations run directly inside your browser memory.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#FFC800]/20 border border-[#FFC800]/40 text-[#111111] flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#111111]">No AI Training</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Your documents are never used to train public foundation models or language datasets.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] flex items-center justify-center">
            <RefreshCw className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#111111]">Instant Deletion</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Temporary files generated during AI extraction are purged immediately upon task completion.
          </p>
        </div>
      </div>

      {/* Main Policy Content */}
      <div className="prose prose-gray max-w-none text-xs sm:text-sm text-[#6B7280] leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">1. File Handling & Architecture</h2>
          <p>
            Doclly is built on a privacy-first foundation. For our core utility tools (including Merge PDF, Split PDF, Rotate, Watermark, Compress, and Sign), operations execute directly within your browser&rsquo;s JavaScript runtime via WebAssembly and client-side engines (`pdf-lib`, `xlsx`). In these modes, file data never transmits to external storage servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">2. Processing & AI Security</h2>
          <p>
            When utilizing AI Document Assistant features (such as Summarize, Extract, or Translate), documents are parsed in isolated ephemeral sandboxes. Text vectors and extracted entities exist only for the duration of your active session. We do not store, index, or sell any contents of your documents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">3. Retention & Deletion Policy</h2>
          <p>
            • <strong>Free Tier:</strong> Zero document retention. Session memory clears upon closing the browser tab.<br />
            • <strong>Pro & Business Workspaces:</strong> Files saved explicitly to your local or cloud workspace are encrypted with AES-256 at rest and TLS 1.3 in transit. You can permanently delete any document or folder at any time with a single click.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">4. Electronic Signatures & Compliance</h2>
          <p>
            Signatures created on Doclly are rendered onto document pages client-side. We do not store signature biometric models or private keys. The resulting signed PDF adheres to ISO 32000-1 document formatting standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">5. Security Contacts</h2>
          <p>
            For questions regarding our privacy architecture, data deletion requests, or compliance inquiries, please contact our security team at <span className="text-[#111111] font-bold">security@doclly.app</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
