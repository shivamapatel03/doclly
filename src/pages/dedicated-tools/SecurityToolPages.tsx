import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { protectPdf, unlockPdf, flattenPdf } from '../../lib/pdf-engine';
import { downloadBytes } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import {
  Lock, Unlock, Layers, Eye, EyeOff, Check, FileCheck, ShieldCheck, Sparkles,
} from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

/* ======================== SHARED UPLOAD SHELL ======================== */
interface ToolShellProps {
  toolId: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: (file: File, onReset: () => void) => React.ReactNode;
}

const ToolUploadShell: React.FC<ToolShellProps> = ({ toolId, title, subtitle, icon, children }) => {
  const [file, setFile] = useState<File | null>(null);
  const tool = ALL_TOOLS.find((t) => t.id === toolId);

  const handleReset = () => setFile(null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: title }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{title}</h1>
        <p className="text-sm text-[#6B7280]">{subtitle}</p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {!file ? (
          <UploadZone
            onFilesSelected={(files) => files[0] && setFile(files[0])}
            accepts={['.pdf', 'application/pdf']}
            acceptsDescription="PDF document"
            maxFiles={1}
          />
        ) : (
          children(file, handleReset)
        )}
      </div>
    </div>
  );
};


/* ======================== PROTECT PDF ======================== */
export const ProtectPdfPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultFilename, setResultFilename] = useState('');
  const toast = useToast();

  const handleProtect = async (file: File) => {
    if (!password) { toast.error('Please enter a password.'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match.'); return; }
    if (password.length < 4) { toast.error('Password must be at least 4 characters.'); return; }

    setIsProcessing(true);
    setProgress(30);
    try {
      setProgress(60);
      const bytes = await protectPdf(file, password);
      setProgress(100);
      const name = `protected_${file.name}`;
      setResultBytes(bytes);
      setResultFilename(name);
      DocumentStorage.saveDocument({ name, size: bytes.byteLength, type: 'application/pdf' });
      downloadBytes(bytes, name, 'application/pdf');
      toast.success('PDF protected and downloaded!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to protect PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (resultBytes) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Protect PDF' }]} />
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <ResultDownloadCard
            filename={resultFilename}
            fileSize={resultBytes.byteLength}
            onDownload={() => downloadBytes(resultBytes!, resultFilename, 'application/pdf')}
            onStartOver={() => { setResultBytes(null); setPassword(''); setConfirmPassword(''); }}
          />
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-800">Password Protection Applied</p>
              <p className="text-xs text-emerald-700 mt-0.5">Your PDF has been secured. Keep your password safe — it cannot be recovered.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToolUploadShell
      toolId="protect-pdf"
      title="Protect PDF with Password"
      subtitle="Encrypt your PDF with a secure password. The file stays private in your browser — never uploaded to any server."
      icon={<Lock className="w-6 h-6 text-rose-600" />}
    >
      {(file, onReset) => (
        <div className="space-y-5">
          {/* File Info */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F5F5F5] border border-[#E5E5E5] rounded-2xl">
            <div>
              <p className="text-sm font-bold text-[#111111]">{file.name}</p>
              <p className="text-xs text-[#6B7280]">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={onReset} className="text-xs text-[#6B7280] hover:text-[#111111] font-semibold cursor-pointer">Change file</button>
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Set Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password..."
                  className="w-full h-11 pl-4 pr-10 text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC800]/40 focus:border-[#FFC800]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111111] cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password..."
                className={`w-full h-11 px-4 text-sm bg-[#F5F5F5] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC800]/40 focus:border-[#FFC800] ${
                  confirmPassword && password !== confirmPassword ? 'border-red-300 bg-red-50' : 'border-[#E5E5E5]'
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Password Strength */}
          {password.length > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#111111]">Password Strength</span>
                <span className={
                  password.length < 6 ? 'text-red-500' :
                  password.length < 10 ? 'text-amber-500' : 'text-emerald-600'
                }>
                  {password.length < 6 ? 'Weak' : password.length < 10 ? 'Moderate' : 'Strong'}
                </span>
              </div>
              <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    password.length < 6 ? 'bg-red-400 w-1/4' :
                    password.length < 10 ? 'bg-amber-400 w-2/4' : 'bg-emerald-500 w-full'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Security Info */}
          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
            <strong>📌 Note:</strong> This adds owner-level metadata protection. For full AES-256 encryption, the file is processed locally in your browser using pdf-lib. Store your password safely — it cannot be recovered once set.
          </div>

          {isProcessing && <ProgressBar progress={progress} />}

          <Button
            onClick={() => handleProtect(file)}
            disabled={isProcessing || !password || password !== confirmPassword}
            size="lg"
            className="w-full bg-[#111111] hover:bg-black text-white font-bold cursor-pointer"
          >
            {isProcessing ? 'Protecting PDF...' : <><Lock className="w-4 h-4 mr-2" />Protect PDF & Download</>}
          </Button>
        </div>
      )}
    </ToolUploadShell>
  );
};


/* ======================== UNLOCK PDF ======================== */
export const UnlockPdfPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultFilename, setResultFilename] = useState('');
  const toast = useToast();

  const handleUnlock = async (file: File) => {
    setIsProcessing(true);
    setProgress(30);
    try {
      setProgress(65);
      const bytes = await unlockPdf(file, password);
      setProgress(100);
      const name = `unlocked_${file.name}`;
      setResultBytes(bytes);
      setResultFilename(name);
      DocumentStorage.saveDocument({ name, size: bytes.byteLength, type: 'application/pdf' });
      downloadBytes(bytes, name, 'application/pdf');
      toast.success('PDF unlocked and downloaded!');
    } catch (err: any) {
      toast.error('Could not unlock this PDF. Make sure the password is correct.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (resultBytes) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Unlock PDF' }]} />
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <ResultDownloadCard
            filename={resultFilename}
            fileSize={resultBytes.byteLength}
            onDownload={() => downloadBytes(resultBytes!, resultFilename, 'application/pdf')}
            onStartOver={() => { setResultBytes(null); setPassword(''); }}
          />
        </div>
      </div>
    );
  }

  return (
    <ToolUploadShell
      toolId="unlock-pdf"
      title="Unlock PDF Document"
      subtitle="Remove password protection from a PDF. Enter the current password if required — everything is processed locally."
      icon={<Unlock className="w-6 h-6 text-emerald-600" />}
    >
      {(file, onReset) => (
        <div className="space-y-5">
          <div className="flex items-center justify-between px-4 py-3 bg-[#F5F5F5] border border-[#E5E5E5] rounded-2xl">
            <div>
              <p className="text-sm font-bold text-[#111111]">{file.name}</p>
              <p className="text-xs text-[#6B7280]">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={onReset} className="text-xs text-[#6B7280] hover:text-[#111111] font-semibold cursor-pointer">Change file</button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Current Password (if protected)</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter existing password (leave blank if none)..."
                className="w-full h-11 pl-4 pr-10 text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC800]/40 focus:border-[#FFC800]"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111111] cursor-pointer"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">Leave blank if the PDF has owner restrictions but no user password.</p>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
            <strong>⚠️ Legal notice:</strong> Only unlock PDFs you own or have permission to access. Bypassing passwords on files you don't own may be unlawful.
          </div>

          {isProcessing && <ProgressBar progress={progress} />}

          <Button
            onClick={() => handleUnlock(file)}
            disabled={isProcessing}
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
          >
            {isProcessing ? 'Unlocking PDF...' : <><Unlock className="w-4 h-4 mr-2" />Remove Protection & Download</>}
          </Button>
        </div>
      )}
    </ToolUploadShell>
  );
};


/* ======================== FLATTEN PDF ======================== */
export const FlattenPdfPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultFilename, setResultFilename] = useState('');
  const toast = useToast();

  const handleFlatten = async (file: File) => {
    setIsProcessing(true);
    setProgress(30);
    try {
      setProgress(65);
      const bytes = await flattenPdf(file);
      setProgress(100);
      const name = `flattened_${file.name}`;
      setResultBytes(bytes);
      setResultFilename(name);
      DocumentStorage.saveDocument({ name, size: bytes.byteLength, type: 'application/pdf' });
      downloadBytes(bytes, name, 'application/pdf');
      toast.success('PDF flattened and downloaded!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to flatten PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (resultBytes) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Flatten PDF' }]} />
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <ResultDownloadCard
            filename={resultFilename}
            fileSize={resultBytes.byteLength}
            onDownload={() => downloadBytes(resultBytes!, resultFilename, 'application/pdf')}
            onStartOver={() => setResultBytes(null)}
          />
          <div className="mt-6 p-4 bg-violet-50 border border-violet-100 rounded-2xl flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-violet-800">Form Fields Flattened</p>
              <p className="text-xs text-violet-700 mt-0.5">All interactive form fields, checkboxes and annotations are now permanently embedded as static content.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToolUploadShell
      toolId="flatten-pdf"
      title="Flatten PDF Form Fields"
      subtitle="Lock all interactive form fields, checkboxes, and annotations into permanent, non-editable content."
      icon={<Layers className="w-6 h-6 text-violet-600" />}
    >
      {(file, onReset) => (
        <div className="space-y-5">
          <div className="flex items-center justify-between px-4 py-3 bg-[#F5F5F5] border border-[#E5E5E5] rounded-2xl">
            <div>
              <p className="text-sm font-bold text-[#111111]">{file.name}</p>
              <p className="text-xs text-[#6B7280]">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={onReset} className="text-xs text-[#6B7280] hover:text-[#111111] font-semibold cursor-pointer">Change file</button>
          </div>

          {/* What gets flattened */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📝', label: 'Text Fields', desc: 'Input and text areas' },
              { icon: '☑️', label: 'Checkboxes', desc: 'Selection controls' },
              { icon: '🔘', label: 'Radio Buttons', desc: 'Multiple-choice fields' },
              { icon: '💬', label: 'Annotations', desc: 'Comments & markup' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 p-3 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl">
                <span className="text-base">{item.icon}</span>
                <div>
                  <div className="text-xs font-bold text-[#111111]">{item.label}</div>
                  <div className="text-[11px] text-[#6B7280]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-violet-50 border border-violet-100 rounded-xl text-xs text-violet-700">
            <strong>ℹ️ What does flatten mean?</strong> Flattening merges form fields and annotations into the PDF page content, making them read-only and preventing further editing of the submitted form data.
          </div>

          {isProcessing && <ProgressBar progress={progress} />}

          <Button
            onClick={() => handleFlatten(file)}
            disabled={isProcessing}
            size="lg"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer"
          >
            {isProcessing ? 'Flattening PDF...' : <><Layers className="w-4 h-4 mr-2" />Flatten Form Fields & Download</>}
          </Button>
        </div>
      )}
    </ToolUploadShell>
  );
};
