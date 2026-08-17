import React from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

export const BLOG_POSTS = [
  {
    slug: 'how-to-reduce-pdf-size',
    title: 'How to Reduce PDF Size Without Losing Quality',
    excerpt: 'Discover practical techniques to compress high-resolution PDFs for portal uploads while keeping fonts and images crisp.',
    category: 'Optimization',
    readTime: '4 min read',
    date: 'Aug 14, 2026',
    toolLink: '/tools/compress-pdf',
    toolName: 'Compress PDF',
  },
  {
    slug: 'how-to-convert-pdf-to-word',
    title: 'How to Convert PDF to Editable Word (.DOCX)',
    excerpt: 'Step-by-step guide to transforming static PDFs into clean, formatted Microsoft Word documents with editable typography and tables.',
    category: 'Conversion',
    readTime: '3 min read',
    date: 'Aug 12, 2026',
    toolLink: '/tools/pdf-to-word',
    toolName: 'PDF to Word',
  },
  {
    slug: 'how-to-sign-a-pdf',
    title: 'How to Electronically Sign Documents & NDAs Online',
    excerpt: 'Learn how to create, type, or draw digital signatures and burn them securely into contracts without printing or scanning.',
    category: 'Security & Sign',
    readTime: '5 min read',
    date: 'Aug 10, 2026',
    toolLink: '/tools/sign-pdf',
    toolName: 'Sign PDF',
  },
  {
    slug: 'how-to-extract-data-from-invoices',
    title: 'How to Extract Data from Invoices & Receipts into Excel',
    excerpt: 'Automate tedious accounting entry by extracting vendor names, dates, line items, and GST totals directly into clean spreadsheets.',
    category: 'AI & Office',
    readTime: '6 min read',
    date: 'Aug 08, 2026',
    toolLink: '/ai/extract',
    toolName: 'Smart Data Extraction',
  },
  {
    slug: 'how-ai-can-summarize-documents',
    title: 'How AI Can Summarize 50+ Page Reports in Seconds',
    excerpt: 'Understand how modern language models break down dense legal briefs and technical research into actionable executive bullet points.',
    category: 'AI Intelligence',
    readTime: '5 min read',
    date: 'Aug 05, 2026',
    toolLink: '/ai/summarize',
    toolName: 'Summarize Document',
  },
  {
    slug: 'best-document-tools-for-students',
    title: 'Best Document Productivity Tools for Students and Researchers',
    excerpt: 'A curated breakdown of essential PDF mergers, splitters, translators, and citation organizers for academic success.',
    category: 'Productivity',
    readTime: '4 min read',
    date: 'Aug 02, 2026',
    toolLink: '/workflows',
    toolName: 'Student Study Pack Workflow',
  },
];

export const BlogPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SeoHead
        title="Doclly Guides & Tutorials — Master Document Productivity"
        description="Read in-depth guides on PDF compression, Word conversion, electronic signatures, AI extraction, and document workflows."
      />

      <Breadcrumb items={[{ label: 'Blog & Guides' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#111111] bg-[#FFC800]/20 border border-[#FFC800]/40">
          <BookOpen className="w-3.5 h-3.5 text-[#111111]" />
          <span>Productivity Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Doclly Guides & Tutorials
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280]">
          Expert advice and step-by-step walkthroughs to get the most out of your documents.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col justify-between p-6 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-2xl transition-all duration-150 group shadow-2xs hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-bold text-[#111111] bg-[#FFC800] px-2.5 py-0.5 rounded-full">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[#111111] group-hover:text-black transition-colors leading-snug">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
              <Link
                to={`/blog/${post.slug}`}
                className="text-xs font-bold text-[#111111] group-hover:underline flex items-center gap-1 transition-colors"
              >
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to={post.toolLink}
                className="text-[11px] font-semibold text-gray-500 hover:text-[#111111] transition-colors"
              >
                Try {post.toolName}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
