import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ALL_TOOLS, TOOL_CATEGORIES, PRICING_PLANS, FAQ_ITEMS } from '../lib/constants';
import { ToolCard } from '../components/tools/ToolCard';
import { SeoHead } from '../components/layout/SeoHead';
import { UploadZone } from '../components/tools/UploadZone';
import {
  Search,
  Zap,
  Shield,
  MousePointerClick,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Pdf02Icon,
  Doc02Icon,
  Xls02Icon,
  Presentation02Icon,
  Image02Icon,
  LockPasswordIcon,
  SignatureIcon,
  Scissor01Icon,
  FileZipIcon,
  Files01Icon,
} from '@hugeicons/core-free-icons';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.seo.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleHeroFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      navigate('/tools/merge-pdf');
    } else if (ext === 'docx' || ext === 'doc') {
      navigate('/tools/word-to-pdf');
    } else if (ext === 'xlsx' || ext === 'xls') {
      navigate('/tools/excel-to-pdf');
    } else if (ext === 'csv') {
      navigate('/tools/csv-to-excel');
    } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      navigate('/tools/jpg-to-pdf');
    } else {
      navigate('/tools/merge-pdf');
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SeoHead
        title="Doclly - Every Tool You Need to Work with PDFs and Documents Online"
        description="Free online PDF tools: Merge, Split, Compress, Convert PDF to Word, Excel, PPT, JPG, and convert Word to PDF with 100% in-browser privacy."
        keywords={['pdf converter', 'ilovepdf alternative', 'merge pdf', 'compress pdf', 'pdf to word', 'pdf to excel', 'word to pdf']}
      />

      {/* 1. HERO SECTION WITH OFFICIAL HUGEICONS FLOATING IN BACKGROUND */}
      <section className="relative pt-8 sm:pt-14 pb-10 overflow-hidden">
        {/* Ambient Soft Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Subtle Background Dot Pattern */}
        <div className="absolute inset-0 doclly-dot-pattern opacity-35 pointer-events-none doclly-radial-mask" />

        {/* REAL HUGEICONS FLOATING BADGES (NO TEXT) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* --- LEFT SIDE FLOATING HUGEICONS --- */}
          
          {/* 1. Hugeicons PDF (Rose) */}
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-200/90 shadow-xl shadow-rose-500/10 items-center justify-center absolute top-10 left-6 lg:left-14 animate-doclly-float-1">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <HugeiconsIcon icon={Pdf02Icon} size={24} strokeWidth={2} />
            </div>
          </div>

          {/* 2. Hugeicons Word DOCX (Blue) */}
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-200/90 shadow-xl shadow-blue-500/10 items-center justify-center absolute top-48 left-3 lg:left-8 animate-doclly-float-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <HugeiconsIcon icon={Doc02Icon} size={24} strokeWidth={2} />
            </div>
          </div>

          {/* 3. Hugeicons Excel XLSX (Emerald) */}
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200/90 shadow-xl shadow-emerald-500/10 items-center justify-center absolute bottom-10 left-8 lg:left-18 animate-doclly-float-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <HugeiconsIcon icon={Xls02Icon} size={24} strokeWidth={2} />
            </div>
          </div>

          {/* 4. Hugeicons Signature (Amber) */}
          <div className="hidden lg:flex w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-lg shadow-amber-500/10 items-center justify-center absolute top-28 left-[24%] animate-doclly-float-4 opacity-85">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <HugeiconsIcon icon={SignatureIcon} size={19} strokeWidth={2} />
            </div>
          </div>

          {/* 5. Hugeicons Scissors / Split (Purple) */}
          <div className="hidden lg:flex w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-purple-200/90 shadow-md items-center justify-center absolute bottom-28 left-[20%] animate-doclly-float-1 opacity-75">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <HugeiconsIcon icon={Scissor01Icon} size={17} strokeWidth={2} />
            </div>
          </div>


          {/* --- RIGHT SIDE FLOATING HUGEICONS --- */}

          {/* 6. Hugeicons PowerPoint PPTX (Orange) */}
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-orange-200/90 shadow-xl shadow-orange-500/10 items-center justify-center absolute top-10 right-6 lg:right-14 animate-doclly-float-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <HugeiconsIcon icon={Presentation02Icon} size={24} strokeWidth={2} />
            </div>
          </div>

          {/* 7. Hugeicons JPG / Image (Amber) */}
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-xl shadow-amber-500/10 items-center justify-center absolute top-48 right-3 lg:right-8 animate-doclly-float-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <HugeiconsIcon icon={Image02Icon} size={24} strokeWidth={2} />
            </div>
          </div>

          {/* 8. Hugeicons Lock / Protect (Rose/Red) */}
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-200/90 shadow-xl shadow-rose-500/10 items-center justify-center absolute bottom-10 right-8 lg:right-18 animate-doclly-float-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <HugeiconsIcon icon={LockPasswordIcon} size={24} strokeWidth={2} />
            </div>
          </div>

          {/* 9. Hugeicons Compress / Zip (Teal) */}
          <div className="hidden lg:flex w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md border border-teal-200/90 shadow-lg shadow-teal-500/10 items-center justify-center absolute top-28 right-[24%] animate-doclly-float-3 opacity-85">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <HugeiconsIcon icon={FileZipIcon} size={19} strokeWidth={2} />
            </div>
          </div>

          {/* 10. Hugeicons Merge / Multi-Files (Indigo) */}
          <div className="hidden lg:flex w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-indigo-200/90 shadow-md items-center justify-center absolute bottom-28 right-[20%] animate-doclly-float-2 opacity-75">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <HugeiconsIcon icon={Files01Icon} size={17} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-[#E5E5E5] rounded-full text-xs font-semibold text-[#111111] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Client-Side In-Browser Processing - Zero Server Uploads</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
            Every tool you need to work with{' '}
            <span className="underline decoration-[#FFC800] decoration-4 underline-offset-4">
              PDFs & Documents
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Merge, split, compress, convert, edit, sign, and protect your PDF files. Fast, private, and 100% free with no file limits.
          </p>

          {/* Quick Drag & Drop Action Zone */}
          <div id="main-upload" className="max-w-xl mx-auto pt-4">
            <UploadZone
              onFilesSelected={handleHeroFileSelected}
              accepts={['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.csv', '.pptx', '.jpg', '.png', '.webp']}
              acceptsDescription="Drop any PDF, Word, Excel, PowerPoint, or Image file here to start converting"
              maxFiles={10}
            />
          </div>
        </div>
      </section>

      {/* 2. ALL TOOLS DIRECTORY */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              All Document & PDF Tools
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Select a converter utility below to begin your task instantly.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#111111] text-white shadow-2xs'
                  : 'bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] hover:bg-[#EAEAEA]'
              }`}
            >
              All Tools ({ALL_TOOLS.length})
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#111111] text-white shadow-2xs'
                    : 'bg-[#F5F5F5] text-[#6B7280] hover:text-[#111111] hover:bg-[#EAEAEA]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 3. POPULAR TOOLS CAROUSEL/HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Most Popular Converters
            </h2>
            <p className="text-xs text-[#6B7280]">Daily go-to utilities used by millions of professionals.</p>
          </div>
          <Link to="/tools/merge-pdf" className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1">
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {ALL_TOOLS.filter((t) => t.popular).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 4. TRUST & ARCHITECTURE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Engineered for Speed & Privacy
          </h2>
          <p className="text-sm text-[#6B7280]">
            Why students, freelancers, and businesses choose Doclly over legacy converters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">Zero Latency</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              In-browser processing executes conversions in milliseconds with WebAssembly and Web Workers.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">100% Private</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Your confidential files never leave your device and are never sent or stored on remote servers.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">No Clutter</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              No full-page popups, no forced registrations, and no waiting in artificial conversion queues.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">Universal Formats</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Seamlessly interconvert across PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), and JPG.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-[#6B7280]">
            Use all converters free, upgrade for large batches and high file limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between transition-all ${
                plan.isPrimary
                  ? 'bg-white border-[#111111] ring-2 ring-[#FFC800]/60 shadow-md relative overflow-hidden'
                  : 'bg-white border-[#E5E5E5]'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 text-[11px] font-bold text-[#111111] bg-[#FFC800] border border-[#E5E5E5] rounded-full shadow-2xs z-20">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-4 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">{plan.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#111111]">{plan.priceINR}</span>
                  <span className="text-xs text-[#6B7280]">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[#111111] pt-4 border-t border-[#E5E5E5]">
                  {plan.features.slice(0, 5).map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  to="/pricing"
                  className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-colors ${
                    plan.isPrimary
                      ? 'bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] border border-[#E5E5E5]'
                      : 'bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#111111] border border-[#E5E5E5]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#6B7280]">
            Everything you need to know about Doclly&rsquo;s document utilities and privacy.
          </p>
        </div>

        <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-2xl bg-white overflow-hidden shadow-2xs">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-[#111111] hover:bg-[#F5F5F5] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[#111111]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#6B7280] leading-relaxed animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
