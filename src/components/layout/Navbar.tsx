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
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { ThreeDIcon } from '../common/ThreeDIcon';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, signOut } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);
  const [organizeDropdownOpen, setOrganizeDropdownOpen] = useState(false);
  const [securityDropdownOpen, setSecurityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileConvertOpen, setMobileConvertOpen] = useState(false);
  const [mobileOrganizeOpen, setMobileOrganizeOpen] = useState(false);
  const [mobileSecurityOpen, setMobileSecurityOpen] = useState(false);

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
    setMobileConvertOpen(false);
    setMobileOrganizeOpen(false);
    setMobileSecurityOpen(false);
  };

  const CONVERT_FROM_PDF = [
    {
      to: '/tools/pdf-to-word',
      label: 'PDF to Word',
      badge: 'DOCX',
      desc: 'Editable Word document',
      icon3d: 'word',
    },
    {
      to: '/tools/pdf-to-excel',
      label: 'PDF to Excel',
      badge: 'XLSX',
      desc: 'Extract tables to spreadsheet',
      icon3d: 'excel',
    },
    {
      to: '/tools/pdf-to-ppt',
      label: 'PDF to PowerPoint',
      badge: 'PPTX',
      desc: 'Presentation slide decks',
      icon3d: 'ppt',
    },
    {
      to: '/tools/pdf-to-jpg',
      label: 'PDF to JPG / PNG',
      badge: 'IMG',
      desc: 'High-res image extracts',
      icon3d: 'image',
    },
    {
      to: '/tools/pdf-to-text',
      label: 'PDF to Text',
      badge: 'TXT',
      desc: 'Plain text stream extract',
      icon3d: 'text',
    },
  ];

  const CONVERT_TO_PDF = [
    {
      to: '/tools/word-to-pdf',
      label: 'Word to PDF',
      badge: 'DOCX',
      desc: 'DOCX to portable PDF',
      icon3d: 'word',
    },
    {
      to: '/tools/excel-to-pdf',
      label: 'Excel to PDF',
      badge: 'XLSX',
      desc: 'Spreadsheet to PDF table',
      icon3d: 'excel',
    },
    {
      to: '/tools/ppt-to-pdf',
      label: 'PowerPoint to PDF',
      badge: 'PPTX',
      desc: 'Slides to PDF document',
      icon3d: 'ppt',
    },
    {
      to: '/tools/jpg-to-pdf',
      label: 'JPG / Images to PDF',
      badge: 'IMG',
      desc: 'Combine pictures to PDF',
      icon3d: 'image',
    },
    {
      to: '/govt-exam-resizer',
      label: 'Govt Exam Photo Resizer',
      badge: '<50 KB',
      desc: 'UPSC, SSC, GATE & NEET presets',
      icon3d: 'image',
    },
  ];

  const ORGANIZE_TOOLS = [
    {
      to: '/tools/merge-pdf',
      label: 'Merge PDF',
      desc: 'Combine multiple PDFs into one',
      icon3d: 'merge',
    },
    {
      to: '/tools/split-pdf',
      label: 'Split PDF',
      desc: 'Separate pages or custom ranges',
      icon3d: 'split',
    },
    {
      to: '/tools/remove-pages',
      label: 'Remove Pages',
      desc: 'Delete unwanted pages',
      icon3d: 'remove',
    },
    {
      to: '/tools/extract-pages',
      label: 'Extract Pages',
      desc: 'Save selected pages to new PDF',
      icon3d: 'extract',
    },
    {
      to: '/tools/organize-pdf',
      label: 'Organize PDF',
      desc: 'Reorder, drag & delete pages',
      icon3d: 'organize',
    },
  ];

  const SECURITY_TOOLS = [
    {
      to: '/tools/edit-pdf',
      label: 'Edit PDF',
      desc: 'Add text, shapes, images & redact',
      icon3d: 'sign',
    },
    {
      to: '/tools/sign-pdf',
      label: 'Sign PDF',
      desc: 'Stamp electronic signature',
      icon3d: 'sign',
    },
    {
      to: '/tools/watermark-pdf',
      label: 'Watermark PDF',
      desc: 'Add text stamps to pages',
      icon3d: 'watermark',
    },
    {
      to: '/tools/qr-code-generator',
      label: 'QR Code Generator',
      desc: 'Create UPI, URL & text QR codes',
      icon3d: 'qrcode',
    },
    {
      to: '/tools/stamp-qr-barcode',
      label: 'Stamp QR on PDF',
      desc: 'Stamp payment QR & barcodes',
      icon3d: 'barcode',
    },
    {
      to: '/tools/protect-pdf',
      label: 'Protect PDF',
      desc: 'Encrypt with password',
      icon3d: 'protect',
    },
    {
      to: '/tools/unlock-pdf',
      label: 'Unlock PDF',
      desc: 'Remove password restrictions',
      icon3d: 'unlock',
    },
    {
      to: '/tools/flatten-pdf',
      label: 'Flatten PDF',
      desc: 'Lock interactive form fields',
      icon3d: 'flatten',
    },
    {
      to: '/tools/compare-documents',
      label: 'Compare PDF',
      desc: 'Side-by-side clause diff',
      icon3d: 'compare',
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
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFC800] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
              Beta
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
                      {CONVERT_FROM_PDF.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={closeAll}
                          className="group flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#F5F5F5] transition-all"
                        >
                          <div className="w-8 h-8 flex items-center justify-center shrink-0">
                            <ThreeDIcon name={item.icon3d} className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-[#111111] group-hover:text-black">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Convert to PDF */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-3 pb-1 border-b border-[#E5E5E5]">
                      Convert to PDF
                    </div>
                    <div className="space-y-1">
                      {CONVERT_TO_PDF.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={closeAll}
                          className="group flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#F5F5F5] transition-all"
                        >
                          <div className="w-8 h-8 flex items-center justify-center shrink-0">
                            <ThreeDIcon name={item.icon3d} className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-[#111111] group-hover:text-black">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
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
                  {ORGANIZE_TOOLS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeAll}
                      className="group flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#F5F5F5] transition-all"
                    >
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <ThreeDIcon name={item.icon3d} className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#111111]">{item.label}</div>
                        <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
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
                  {SECURITY_TOOLS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeAll}
                      className="group flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#F5F5F5] transition-all"
                    >
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <ThreeDIcon name={item.icon3d} className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#111111]">{item.label}</div>
                        <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
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
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F9FAFB] transition-colors cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-[#111111] max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E5E5E5] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-3 py-2 border-b border-[#F0F0F0]">
                    <div className="text-xs font-bold text-[#111111] truncate">{user.name}</div>
                    <div className="text-[11px] text-[#6B7280] truncate">{user.email}</div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#111111] hover:bg-[#F5F5F5] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#6B7280]" />
                    <span>Dashboard & Files</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Sign In */}
              <button
                onClick={() => onOpenAuth('signin')}
                className="hidden sm:inline-flex items-center px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>

              {/* Get Started button (Desktop & Tablet only to prevent mobile overlap) */}
              <button
                onClick={() => onOpenAuth('signup')}
                className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs sm:text-sm font-bold text-[#111111] bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] border border-[#DC9F00] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all whitespace-nowrap cursor-pointer select-none"
              >
                Get Started
              </button>
            </>
          )}

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

      {/* Mobile Dropdown Menu with interactive accordions & 3D icons */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] bg-white px-4 pt-3 pb-6 space-y-2.5 animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto shadow-xl">
          {/* Home Link */}
          <Link
            to="/"
            onClick={closeAll}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm font-bold text-[#111111] hover:bg-[#F9FAFB] transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <ThreeDIcon name="pdf" className="w-8 h-8" />
            </div>
            <span>All Tools Home</span>
          </Link>

          {/* 1. Mobile Convert PDF Accordion */}
          <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-white">
            <button
              onClick={() => setMobileConvertOpen(!mobileConvertOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-[#111111] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <ThreeDIcon name="word" className="w-8 h-8" />
                </div>
                <span>Convert PDF</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
                  mobileConvertOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileConvertOpen && (
              <div className="px-3 pb-3 pt-1 border-t border-[#F0F0F0] space-y-3 bg-[#FAFAFA]/70 animate-in fade-in duration-100">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] px-2 py-1">
                    Convert from PDF
                  </div>
                  <div className="space-y-1 mt-1">
                    {CONVERT_FROM_PDF.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeAll}
                        className="group flex items-center gap-3 p-2 rounded-xl bg-white hover:bg-[#F5F5F5] border border-[#EBEBEB] transition-all shadow-2xs"
                      >
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                          <ThreeDIcon name={item.icon3d} className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#111111]">{item.label}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200/50">
                              {item.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] px-2 py-1">
                    Convert to PDF
                  </div>
                  <div className="space-y-1 mt-1">
                    {CONVERT_TO_PDF.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeAll}
                        className="group flex items-center gap-3 p-2 rounded-xl bg-white hover:bg-[#F5F5F5] border border-[#EBEBEB] transition-all shadow-2xs"
                      >
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                          <ThreeDIcon name={item.icon3d} className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#111111]">{item.label}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200/50">
                              {item.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Mobile Organize PDF Accordion */}
          <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-white">
            <button
              onClick={() => setMobileOrganizeOpen(!mobileOrganizeOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-[#111111] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <ThreeDIcon name="organize" className="w-8 h-8" />
                </div>
                <span>Organize PDF</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
                  mobileOrganizeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileOrganizeOpen && (
              <div className="px-3 pb-3 pt-1 border-t border-[#F0F0F0] space-y-1 bg-[#FAFAFA]/70 animate-in fade-in duration-100">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] px-2 py-1">
                  Organize & Modify Pages
                </div>
                {ORGANIZE_TOOLS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeAll}
                    className="group flex items-center gap-3 p-2 rounded-xl bg-white hover:bg-[#F5F5F5] border border-[#EBEBEB] transition-all shadow-2xs"
                  >
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      <ThreeDIcon name={item.icon3d} className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-[#111111]">{item.label}</div>
                      <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 3. Direct Compress PDF link */}
          <Link
            to="/tools/compress-pdf"
            onClick={closeAll}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F9FAFB] text-sm font-bold text-[#111111] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <ThreeDIcon name="compress" className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
              </div>
              <span>Compress PDF</span>
            </div>
            <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
              Fast
            </span>
          </Link>

          {/* 4. Mobile Edit & Security Accordion */}
          <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-white">
            <button
              onClick={() => setMobileSecurityOpen(!mobileSecurityOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-[#111111] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <ThreeDIcon name="protect" className="w-8 h-8" />
                </div>
                <span>Edit & Security</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
                  mobileSecurityOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileSecurityOpen && (
              <div className="px-3 pb-3 pt-1 border-t border-[#F0F0F0] space-y-1 bg-[#FAFAFA]/70 animate-in fade-in duration-100">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] px-2 py-1">
                  Security, Sign & Annotate
                </div>
                {SECURITY_TOOLS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeAll}
                    className="group flex items-center gap-3 p-2 rounded-xl bg-white hover:bg-[#F5F5F5] border border-[#EBEBEB] transition-all shadow-2xs"
                  >
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      <ThreeDIcon name={item.icon3d} className="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-[#111111]">{item.label}</div>
                      <div className="text-[11px] text-[#6B7280] truncate">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 5. Pricing & Actions */}
          <div className="pt-2 border-t border-[#E5E5E5] space-y-2">
            <Link
              to="/pricing"
              onClick={closeAll}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm font-bold text-[#111111] hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <ThreeDIcon name="flash" className="w-8 h-8" />
              </div>
              <span>Pricing Plans</span>
            </Link>

            {user ? (
              <div className="space-y-2 pt-1">
                <div className="px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#111111] truncate">{user.name}</div>
                      <div className="text-[10px] text-[#6B7280] truncate">{user.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFC800] text-[#111111] uppercase border border-[#E5E5E5]">
                    {user.planTier || 'Free'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/dashboard"
                    onClick={closeAll}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] hover:bg-[#EAEAEA] text-xs font-bold text-[#111111] transition-colors text-center"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      closeAll();
                      signOut();
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition-colors text-center cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    closeAll();
                    onOpenAuth('signin');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full border border-[#D5D5D5] bg-[#F5F5F5] bg-gradient-to-b from-white/60 to-transparent hover:bg-[#EAEAEA] text-xs font-bold text-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.08)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all text-center cursor-pointer select-none"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    closeAll();
                    onOpenAuth('signup');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] border border-[#DC9F00] text-xs font-bold text-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all text-center cursor-pointer select-none"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
