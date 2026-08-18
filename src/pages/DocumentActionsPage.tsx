import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { ThreeDIcon, getFile3DIcon } from '../components/common/ThreeDIcon';
import { formatFileSize } from '../lib/utils';
import { FileSession } from '../lib/file-session';
import {
  Search,
  Upload,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface ActionItem {
  id: string;
  name: string;
  category: 'popular' | 'convert' | 'organize' | 'security' | 'ai';
  description: string;
  route: string;
  icon3d: string;
  badge?: string;
  highlight?: boolean;
}

export const DocumentActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Retrieve initial file from router state or in-memory session
  const [file, setFile] = useState<File | null>(() => {
    return (location.state as any)?.file || FileSession.getFile();
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (file) {
      FileSession.setFile(file);
    }
  }, [file]);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    const nextFile = newFiles[0];
    setFile(nextFile);
    FileSession.setFile(nextFile);
  };

  const handleActionSelect = (route: string) => {
    if (file) {
      FileSession.setFile(file);
      navigate(route, { state: { file } });
    } else {
      navigate(route);
    }
  };

  const isPdf = file?.name.toLowerCase().endsWith('.pdf') ?? true;
  const fileExt = file?.name.split('.').pop()?.toUpperCase() || 'DOCUMENT';

  // Master action list tailored for PDF and general document workflows
  const ALL_ACTIONS: ActionItem[] = [
    // Recommended / Popular
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      category: 'popular',
      description: 'Reduce file size by up to 90% without losing visual clarity',
      route: '/tools/compress-pdf',
      icon3d: 'compress',
      badge: 'Popular',
      highlight: true,
    },
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      category: 'popular',
      description: 'Convert into an editable Microsoft Word document (.docx)',
      route: '/tools/pdf-to-word',
      icon3d: 'word',
      badge: 'DOCX',
      highlight: true,
    },
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG / PNG',
      category: 'popular',
      description: 'Convert and extract multi-page images with custom page selection',
      route: '/tools/pdf-to-jpg',
      icon3d: 'image',
      badge: 'IMG',
      highlight: true,
    },
    {
      id: 'sign-pdf',
      name: 'Sign PDF',
      category: 'popular',
      description: 'Stamp your legal signature or initial onto pages',
      route: '/tools/sign-pdf',
      icon3d: 'sign',
      badge: 'Sign',
      highlight: true,
    },

    // Convert & Export
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      category: 'convert',
      description: 'Extract tables and financial figures into a .xlsx spreadsheet',
      route: '/tools/pdf-to-excel',
      icon3d: 'excel',
      badge: 'XLSX',
    },
    {
      id: 'pdf-to-ppt',
      name: 'PDF to PowerPoint',
      category: 'convert',
      description: 'Turn your PDF pages into editable PowerPoint (.pptx) slides',
      route: '/tools/pdf-to-ppt',
      icon3d: 'ppt',
      badge: 'PPTX',
    },
    {
      id: 'pdf-to-text',
      name: 'PDF to Text',
      category: 'convert',
      description: 'Extract plain formatted text content directly from pages',
      route: '/tools/pdf-to-text',
      icon3d: 'text',
      badge: 'TXT',
    },
    {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      category: 'convert',
      description: 'Convert DOCX documents into clean portable PDF format',
      route: '/tools/word-to-pdf',
      icon3d: 'word',
      badge: 'PDF',
    },

    // Organize & Optimize
    {
      id: 'organize-pdf',
      name: 'Organize Pages',
      category: 'organize',
      description: 'Sort, reorder, rotate 90°, and delete individual pages',
      route: '/tools/organize-pdf',
      icon3d: 'organize',
      badge: 'Reorder',
    },
    {
      id: 'split-pdf',
      name: 'Split PDF',
      category: 'organize',
      description: 'Separate single pages or custom ranges into standalone files or ZIP',
      route: '/tools/split-pdf',
      icon3d: 'split',
      badge: 'Extract',
    },
    {
      id: 'merge-pdf',
      name: 'Merge with Other PDFs',
      category: 'organize',
      description: 'Combine this document with multiple other PDF files',
      route: '/tools/merge-pdf',
      icon3d: 'merge',
      badge: 'Combine',
    },
    {
      id: 'remove-pages',
      name: 'Remove Pages',
      category: 'organize',
      description: 'Select unwanted pages to cleanly delete from your document',
      route: '/tools/remove-pages',
      icon3d: 'remove',
      badge: 'Trim',
    },
    {
      id: 'extract-pages',
      name: 'Extract Pages',
      category: 'organize',
      description: 'Pull out specific pages and save them into a new document',
      route: '/tools/extract-pages',
      icon3d: 'extract',
      badge: 'Export',
    },

    // Security & Protection
    {
      id: 'protect-pdf',
      name: 'Protect & Encrypt PDF',
      category: 'security',
      description: 'Secure with standard ISO 128-bit MD5 & ARC4 password encryption',
      route: '/tools/protect-pdf',
      icon3d: 'protect',
      badge: 'Lock',
    },
    {
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      category: 'security',
      description: 'Remove password and document restrictions with valid password',
      route: '/tools/unlock-pdf',
      icon3d: 'unlock',
      badge: 'Unlock',
    },
    {
      id: 'watermark-pdf',
      name: 'Watermark PDF',
      category: 'security',
      description: 'Stamp custom text or confidential stamps across all pages',
      route: '/tools/watermark-pdf',
      icon3d: 'watermark',
      badge: 'Stamp',
    },
    {
      id: 'flatten-pdf',
      name: 'Flatten PDF',
      category: 'security',
      description: 'Merge fillable form fields and layers into non-editable pages',
      route: '/tools/flatten-pdf',
      icon3d: 'flatten',
      badge: 'Flatten',
    },
    {
      id: 'compare-documents',
      name: 'Compare Documents',
      category: 'security',
      description: 'Compare text and page differences against another document',
      route: '/tools/compare-documents',
      icon3d: 'compare',
      badge: 'Diff',
    },

    // AI Document Intelligence
    {
      id: 'ai-assistant',
      name: 'Chat with Document (AI)',
      category: 'ai',
      description: 'Ask questions, analyze contract clauses, and query your document with AI',
      route: '/ai/assistant',
      icon3d: 'word',
      badge: 'AI Chat',
    },
    {
      id: 'ai-summarize',
      name: 'Summarize with AI',
      category: 'ai',
      description: 'Generate instant executive summaries and bullet points',
      route: '/ai/summarize',
      icon3d: 'text',
      badge: 'AI Summary',
    },
    {
      id: 'ai-extract',
      name: 'Extract Invoice / Data',
      category: 'ai',
      description: 'Extract key-value tables and totals into Excel / CSV format',
      route: '/ai/extract',
      icon3d: 'excel',
      badge: 'AI OCR',
    },
  ];

  const filteredActions = ALL_ACTIONS.filter((action) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      action.name.toLowerCase().includes(q) ||
      action.description.toLowerCase().includes(q) ||
      action.badge?.toLowerCase().includes(q)
    );
  });

  const popularActions = filteredActions.filter((a) => a.category === 'popular');
  const convertActions = filteredActions.filter((a) => a.category === 'convert');
  const organizeActions = filteredActions.filter((a) => a.category === 'organize');
  const securityActions = filteredActions.filter((a) => a.category === 'security');
  const aiActions = filteredActions.filter((a) => a.category === 'ai');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      <SeoHead
        title="Select Action for Document — Doclly"
        description="Choose how to convert, edit, organize, compress, sign, or analyze your uploaded document."
      />

      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Document Actions' }]} />

      {/* Hidden file input for changing the document */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.jpg,.jpeg,.png,.webp,.txt"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files)}
      />

      {/* Selected Document Header Banner */}
      <div className="p-4 sm:p-5 bg-white border border-[#E5E5E5] rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="shrink-0">
            {getFile3DIcon(file?.name || 'document.pdf', 'w-10 h-10')}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-[#111111] truncate">
                {file?.name || 'Uploaded Document'}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold text-[#111111] bg-[#FFC800] border border-[#E5E5E5] rounded-full shrink-0">
                {fileExt}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {file ? formatFileSize(file.size) : 'Ready for processing'} • Ready to convert, edit or optimize
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#111111] bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#E5E5E5] rounded-xl transition-all shadow-2xs self-stretch sm:self-auto justify-center cursor-pointer whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Change Document</span>
        </button>
      </div>

      {/* Hero Headline & Live Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            What would you like to do?
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Select an action below to process <span className="font-semibold text-[#111111]">{file?.name || 'your document'}</span> instantly.
          </p>
        </div>

        {/* Action Filter Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search actions (e.g. word, compress)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-semibold text-[#111111] placeholder-gray-400 focus:outline-none focus:border-[#111111] shadow-2xs transition-colors"
          />
        </div>
      </div>

      {/* Grid Categories */}
      <div className="space-y-8">
        {/* Category 1: Recommended / Quick Actions */}
        {popularActions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFC800]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                Recommended Actions
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleActionSelect(action.route)}
                  className="group p-5 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-2xl cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                        <ThreeDIcon name={action.icon3d} className="w-10 h-10" />
                      </div>
                      {action.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold text-[#111111] bg-[#FFC800]/30 border border-[#FFC800]/50 rounded-md">
                          {action.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-[#111111] group-hover:text-black tracking-tight">
                        {action.name}
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed line-clamp-2">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-bold text-[#111111]">
                    <span>Start Action</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category 2: Convert & Export */}
        {convertActions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
              Convert & Export Format
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {convertActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleActionSelect(action.route)}
                  className="group p-5 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-2xl cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                        <ThreeDIcon name={action.icon3d} className="w-10 h-10" />
                      </div>
                      {action.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold text-[#6B7280] bg-[#F5F5F5] border border-[#E5E5E5] rounded-md">
                          {action.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-[#111111] group-hover:text-black tracking-tight">
                        {action.name}
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed line-clamp-2">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-bold text-[#111111]">
                    <span>Convert Now</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category 3: Organize & Modify Pages */}
        {organizeActions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
              Organize, Merge & Split Pages
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizeActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleActionSelect(action.route)}
                  className="group p-5 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-2xl cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-between gap-4 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                      <ThreeDIcon name={action.icon3d} className="w-9 h-9" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#111111] truncate">
                        {action.name}
                      </h4>
                      <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#111111] shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category 4: Edit, Security & Watermark */}
        {securityActions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
              Security, Signature & Annotations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleActionSelect(action.route)}
                  className="group p-5 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-2xl cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-between gap-4 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                      <ThreeDIcon name={action.icon3d} className="w-9 h-9" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#111111] truncate">
                        {action.name}
                      </h4>
                      <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#111111] shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category 5: AI Intelligence */}
        {aiActions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
                AI Document Intelligence
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {aiActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleActionSelect(action.route)}
                  className="group p-5 bg-gradient-to-br from-white to-[#FFC800]/5 border border-[#E5E5E5] hover:border-[#111111] rounded-2xl cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                        <ThreeDIcon name={action.icon3d} className="w-9 h-9" />
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold text-[#111111] bg-[#FFC800] rounded-md shadow-2xs">
                        {action.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#111111] group-hover:text-black">
                        {action.name}
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-bold text-[#111111]">
                    <span>Run with AI</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
