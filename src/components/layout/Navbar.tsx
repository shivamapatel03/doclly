import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  RefreshCw,
  Files,
  Minimize2,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  FileCode,
  FilePlus,
  Scissors,
  Trash2,
  Copy,
  LayoutGrid,
  PenLine,
  Stamp,
  ListOrdered,
  Lock,
  Unlock,
  Layers,
  GitCompare,
  Code,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);
  const [organizeDropdownOpen, setOrganizeDropdownOpen] = useState(false);
  const [securityDropdownOpen, setSecurityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setConvertDropdownOpen(false);
        setOrganizeDropdownOpen(false);
        setSecurityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setConvertDropdownOpen(false);
    setOrganizeDropdownOpen(false);
    setSecurityDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const CONVERT_FROM_PDF = [
    {
      to: '/tools/pdf-to-word',
      label: 'PDF to Word',
      badge: 'DOCX',
      desc: 'Editable Word document',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100/80 group-hover:border-blue-200',
    },
    {
      to: '/tools/pdf-to-excel',
      label: 'PDF to Excel',
      badge: 'XLSX',
      desc: 'Extract tables to spreadsheet',
      icon: FileSpreadsheet,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100/80 group-hover:border-emerald-200',
    },
    {
      to: '/tools/pdf-to-ppt',
      label: 'PDF to PowerPoint',
      badge: 'PPTX',
      desc: 'Presentation slide decks',
      icon: Presentation,
      color: 'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-100/80 group-hover:border-orange-200',
    },
    {
      to: '/tools/pdf-to-jpg',
      label: 'PDF to JPG / PNG',
      badge: 'IMG',
      desc: 'High-res image extracts',
      icon: Image,
      color: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100/80 group-hover:border-amber-200',
    },
    {
      to: '/tools/pdf-to-text',
      label: 'PDF to Text',
      badge: 'TXT',
      desc: 'Plain text stream extract',
      icon: FileCode,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100/80 group-hover:border-indigo-200',
    },
  ];

  const CONVERT_TO_PDF = [
    {
      to: '/tools/word-to-pdf',
      label: 'Word to PDF',
      badge: 'DOCX',
      desc: 'DOCX to portable PDF',
      icon: FilePlus,
      color: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100/80 group-hover:border-blue-200',
    },
    {
      to: '/tools/excel-to-pdf',
      label: 'Excel to PDF',
      badge: 'XLSX',
      desc: 'Spreadsheet to PDF table',
      icon: FileSpreadsheet,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100/80 group-hover:border-emerald-200',
    },
    {
      to: '/tools/ppt-to-pdf',
      label: 'PowerPoint to PDF',
      badge: 'PPTX',
      desc: 'Slides to PDF document',
      icon: Presentation,
      color: 'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-100/80 group-hover:border-orange-200',
    },
    {
      to: '/tools/jpg-to-pdf',
      label: 'JPG / Images to PDF',
      badge: 'IMG',
      desc: 'Combine pictures to PDF',
      icon: Image,
      color: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100/80 group-hover:border-amber-200',
    },
    {
      to: '/tools/html-to-pdf',
      label: 'HTML to PDF',
      badge: 'HTML',
      desc: 'Web code to PDF format',
      icon: Code,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100/80 group-hover:border-indigo-200',
    },
  ];

  const ORGANIZE_TOOLS = [
    {
      to: '/tools/merge-pdf',
      label: 'Merge PDF',
      desc: 'Combine multiple PDFs into one',
      icon: Files,
      color: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-100/80 group-hover:border-rose-200',
    },
    {
      to: '/tools/split-pdf',
      label: 'Split PDF',
      desc: 'Separate pages or custom ranges',
      icon: Scissors,
      color: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100/80 group-hover:border-purple-200',
    },
    {
      to: '/tools/remove-pages',
      label: 'Remove Pages',
      desc: 'Delete unwanted pages',
      icon: Trash2,
      color: 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-100/80 group-hover:border-red-200',
    },
    {
      to: '/tools/extract-pages',
      label: 'Extract Pages',
      desc: 'Save selected pages to new PDF',
      icon: Copy,
      color: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-100/80 group-hover:border-sky-200',
    },
    {
      to: '/tools/organize-pdf',
      label: 'Organize PDF',
      desc: 'Reorder, drag & delete pages',
      icon: LayoutGrid,
      color: 'bg-violet-50 text-violet-600 border-violet-100 group-hover:bg-violet-100/80 group-hover:border-violet-200',
    },
  ];

  const SECURITY_TOOLS = [
    {
      to: '/tools/sign-pdf',
      label: 'Sign PDF',
      desc: 'Stamp electronic signature',
      icon: PenLine,
      color: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100/80 group-hover:border-amber-200',
    },
    {
      to: '/tools/watermark-pdf',
      label: 'Watermark PDF',
      desc: 'Add text stamps to pages',
      icon: Stamp,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-100/80 group-hover:border-cyan-200',
    },
    {
      to: '/tools/protect-pdf',
      label: 'Protect PDF',
      desc: 'Encrypt with password',
      icon: Lock,
      color: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-100/80 group-hover:border-rose-200',
    },
    {
      to: '/tools/unlock-pdf',
      label: 'Unlock PDF',
      desc: 'Remove password restrictions',
      icon: Unlock,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100/80 group-hover:border-emerald-200',
    },
    {
      to: '/tools/flatten-pdf',
      label: 'Flatten PDF',
      desc: 'Lock interactive form fields',
      icon: Layers,
      color: 'bg-amber-50 text-amber-700 border-amber-100 group-hover:bg-amber-100/80 group-hover:border-amber-200',
    },
    {
      to: '/tools/compare-documents',
      label: 'Compare PDF',
      desc: 'Side-by-side clause diff',
      icon: GitCompare,
      color: 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-200/80 group-hover:border-slate-300',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-10" ref={dropdownRef}>
          {/* Logo with /logo/image.png and /logo/text.png */}
          <Link to="/" onClick={closeAll} className="flex items-center gap-2.5 shrink-0 group focus:outline-none">
            <img
              src="/logo/image.png"
              alt="Doclly Icon"
              className="h-8 sm:h-9 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <img
              src="/logo/text.png"
              alt="Doclly"
              className="h-6 sm:h-7 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                const sibling = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                if (sibling) sibling.classList.remove('hidden');
              }}
            />
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#111111] hidden">
              Doclly
            </span>
          </Link>

          {/* Desktop Navigation - Single line */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm font-semibold text-[#111111] whitespace-nowrap">
            {/* 1. Convert PDF Mega Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setConvertDropdownOpen(!convertDropdownOpen);
                  setOrganizeDropdownOpen(false);
                  setSecurityDropdownOpen(false);
                }}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  convertDropdownOpen ? 'bg-[#F5F5F5] text-[#111111]' : 'text-[#4B5563] hover:text-[#111111] hover:bg-[#F5F5F5]'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                <span>Convert PDF</span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${convertDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {convertDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[560px] bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-2xl grid grid-cols-2 gap-6 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Convert from PDF */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-3 pb-1 border-b border-[#E5E5E5]">
                      Convert from PDF
                    </div>
                    <div className="space-y-1">
                      {CONVERT_FROM_PDF.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={closeAll}
                            className="group flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F5] transition-all"
                          >
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all ${item.color}`}>
                              <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-[#111111] group-hover:text-black">
                                {item.label}
                              </div>
                              <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Convert to PDF */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-3 pb-1 border-b border-[#E5E5E5]">
                      Convert to PDF
                    </div>
                    <div className="space-y-1">
                      {CONVERT_TO_PDF.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={closeAll}
                            className="group flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F5] transition-all"
                          >
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all ${item.color}`}>
                              <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-[#111111] group-hover:text-black">
                                {item.label}
                              </div>
                              <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Merge & Organize Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setOrganizeDropdownOpen(!organizeDropdownOpen);
                  setConvertDropdownOpen(false);
                  setSecurityDropdownOpen(false);
                }}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  organizeDropdownOpen ? 'bg-[#F5F5F5] text-[#111111]' : 'text-[#4B5563] hover:text-[#111111] hover:bg-[#F5F5F5]'
                }`}
              >
                <Files className="w-3.5 h-3.5 shrink-0" />
                <span>Organize PDF</span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${organizeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {organizeDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#E5E5E5] rounded-2xl p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] px-2 py-1 mb-1 border-b border-[#E5E5E5]">
                    Organize & Modify Pages
                  </div>
                  {ORGANIZE_TOOLS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeAll}
                        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F5] transition-all"
                      >
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all ${item.color}`}>
                          <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#111111]">{item.label}</div>
                          <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Direct Compress PDF link */}
            <Link
              to="/tools/compress-pdf"
              onClick={closeAll}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                location.pathname === '/tools/compress-pdf' ? 'bg-[#F5F5F5] text-[#111111]' : 'text-[#4B5563] hover:text-[#111111] hover:bg-[#F5F5F5]'
              }`}
            >
              <Minimize2 className="w-3.5 h-3.5 shrink-0" />
              <span>Compress PDF</span>
            </Link>

            {/* 4. Edit & Security Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSecurityDropdownOpen(!securityDropdownOpen);
                  setConvertDropdownOpen(false);
                  setOrganizeDropdownOpen(false);
                }}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  securityDropdownOpen ? 'bg-[#F5F5F5] text-[#111111]' : 'text-[#4B5563] hover:text-[#111111] hover:bg-[#F5F5F5]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Edit & Security</span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${securityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {securityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#E5E5E5] rounded-2xl p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 max-h-[80vh] overflow-y-auto">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] px-2 py-1 mb-1 border-b border-[#E5E5E5]">
                    Security, Sign & Annotate
                  </div>
                  {SECURITY_TOOLS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeAll}
                        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F5] transition-all"
                      >
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all ${item.color}`}>
                          <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#111111]">{item.label}</div>
                          <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Pricing link */}
            <Link
              to="/pricing"
              onClick={closeAll}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname === '/pricing' ? 'bg-[#F5F5F5] text-[#111111]' : 'text-[#4B5563] hover:text-[#111111] hover:bg-[#F5F5F5]'
              }`}
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right: Auth Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sign In */}
          <button
            onClick={() => onOpenAuth('signin')}
            className="hidden sm:inline-flex items-center px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
          >
            Sign In
          </button>

          {/* Get Started button */}
          <Link
            to="/tools/merge-pdf"
            className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold text-[#111111] bg-[#FFC800] hover:bg-[#E6B400] border border-[#E5E5E5] rounded-xl transition-all shadow-2xs whitespace-nowrap"
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5] rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] bg-white px-4 pt-3 pb-5 space-y-2 animate-in fade-in duration-100 max-h-[85vh] overflow-y-auto">
          <Link
            to="/"
            onClick={closeAll}
            className="block px-3 py-2 rounded-md text-base font-semibold text-[#111111] hover:bg-[#F5F5F5]"
          >
            All Tools Home
          </Link>

          <div className="pt-2 border-t border-[#E5E5E5]">
            <div className="text-[11px] font-bold uppercase text-[#6B7280] px-3 py-1">Convert from PDF</div>
            {CONVERT_FROM_PDF.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                onClick={closeAll}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#111111] hover:bg-[#F5F5F5] rounded-lg"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${t.color}`}>
                  <t.icon className="w-3.5 h-3.5" />
                </div>
                <span>{t.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E5E5E5]">
            <div className="text-[11px] font-bold uppercase text-[#6B7280] px-3 py-1">Convert to PDF</div>
            {CONVERT_TO_PDF.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                onClick={closeAll}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#111111] hover:bg-[#F5F5F5] rounded-lg"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${t.color}`}>
                  <t.icon className="w-3.5 h-3.5" />
                </div>
                <span>{t.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E5E5E5]">
            <Link
              to="/pricing"
              onClick={closeAll}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-[#111111] hover:bg-[#F5F5F5]"
            >
              Pricing
            </Link>
            <Link
              to="/privacy"
              onClick={closeAll}
              className="block px-3 py-2 rounded-md text-sm text-[#6B7280] hover:bg-[#F5F5F5]"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};


