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
import { ThreeDIcon } from '../components/common/ThreeDIcon';
import { FileSession } from '../lib/file-session';

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
    FileSession.setFile(file);
    navigate('/document-actions', { state: { file } });
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
      <section className="relative pt-6 sm:pt-10 pb-8 overflow-hidden">
        {/* Ambient Soft Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Subtle Background Dot Pattern */}
        <div className="absolute inset-0 doclly-dot-pattern opacity-35 pointer-events-none doclly-radial-mask" />

        {/* REAL 3D FLOATING ICONS ON FAR EDGES ONLY */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* --- LEFT SIDE FLOATING 3D ICONS (FAR EDGES ONLY) --- */}
          
          {/* 1. 3D PDF Icon */}
          <div className="hidden md:block absolute top-10 left-4 lg:left-10 animate-doclly-float-1">
            <ThreeDIcon name="pdf" className="w-13 h-13 opacity-90 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
          </div>

          {/* 2. 3D Word Icon */}
          <div className="hidden sm:block absolute top-52 left-2 lg:left-6 animate-doclly-float-2">
            <ThreeDIcon name="word" className="w-13 h-13 opacity-90 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
          </div>

          {/* 3. 3D Excel Icon */}
          <div className="hidden md:block absolute bottom-8 left-4 lg:left-10 animate-doclly-float-3">
            <ThreeDIcon name="excel" className="w-13 h-13 opacity-90 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
          </div>

          {/* --- RIGHT SIDE FLOATING 3D ICONS (FAR EDGES ONLY) --- */}

          {/* 4. 3D PowerPoint Icon */}
          <div className="hidden md:block absolute top-10 right-4 lg:right-10 animate-doclly-float-2">
            <ThreeDIcon name="ppt" className="w-13 h-13 opacity-90 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
          </div>

          {/* 5. 3D JPG / Image Icon */}
          <div className="hidden sm:block absolute top-52 right-2 lg:right-6 animate-doclly-float-1">
            <ThreeDIcon name="image" className="w-13 h-13 opacity-90 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
          </div>

          {/* 6. 3D Protect / Lock Icon */}
          <div className="hidden md:block absolute bottom-8 right-4 lg:right-10 animate-doclly-float-4">
            <ThreeDIcon name="protect" className="w-13 h-13 opacity-90 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">

          {/* Product Hunt Launch Pill */}
          <div className="inline-flex items-center justify-center">
            <a
              href="https://www.producthunt.com/products/doclly?utm_source=doclly_hero&utm_medium=website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFC800] hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all cursor-pointer group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FF6154"/>
                <path d="M13.6 12H10.5V8.5H13.6C14.5665 8.5 15.35 9.2835 15.35 10.25C15.35 11.2165 14.5665 12 13.6 12ZM13.6 7H9V17H10.5V13.5H13.6C15.3949 13.5 16.85 12.0449 16.85 10.25C16.85 8.45507 15.3949 7 13.6 7Z" fill="white"/>
              </svg>
              <span>Launching on Product Hunt — <strong>August 30</strong></span>
              <ArrowRight className="w-3.5 h-3.5 text-[#111111] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
            Every tool you need to work with{' '}
            <span className="underline decoration-[#FFC800] decoration-4 underline-offset-4">
              PDFs & Documents
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Merge, split, compress, convert, edit, sign, and protect your PDF files. Fast, private, and 100% free with no file limits.
          </p>

          {/* Quick Drag & Drop Action Zone */}
          <div id="main-upload" className="max-w-xl mx-auto mt-2">
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
            <div className="mb-2">
              <ThreeDIcon name="flash" className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">Zero Latency</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              In-browser processing executes conversions in milliseconds with WebAssembly and Web Workers.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl space-y-3 shadow-2xs">
            <div className="mb-2">
              <ThreeDIcon name="shield" className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">100% Private</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Your confidential files never leave your device and are never sent or stored on remote servers.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl space-y-3 shadow-2xs">
            <div className="mb-2">
              <ThreeDIcon name="mouse" className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">No Clutter</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              No full-page popups, no forced registrations, and no waiting in artificial conversion queues.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl space-y-3 shadow-2xs">
            <div className="mb-2">
              <ThreeDIcon name="cycle" className="w-10 h-10" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between transition-all ${
                plan.isPrimary
                  ? 'bg-white border-[#111111] ring-2 ring-[#FFC800]/60 shadow-md relative'
                  : 'bg-white border-[#E5E5E5]'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 text-[11px] font-bold text-[#111111] bg-[#FFC800] border border-[#111111]/15 rounded-full shadow-xs z-20 whitespace-nowrap">
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
                  className={`w-full py-3 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer select-none ${
                    plan.isPrimary
                      ? 'bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]'
                      : 'bg-[#F5F5F5] bg-gradient-to-b from-white/60 to-transparent hover:bg-[#EAEAEA] text-[#111111] border border-[#D5D5D5] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.08)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]'
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
