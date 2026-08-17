import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { BLOG_POSTS } from './BlogPage';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SeoHead
        title={`${post.title} — Doclly Guide`}
        description={post.excerpt}
      />

      <Breadcrumb
        items={[
          { label: 'Blog', to: '/blog' },
          { label: post.title },
        ]}
      />

      {/* Header */}
      <div className="space-y-3 border-b border-[#E5E5E5] pb-6">
        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
          <span className="font-bold text-[#111111] bg-[#FFC800] px-2.5 py-0.5 rounded-full">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {post.date}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">{post.excerpt}</p>
      </div>

      {/* Main Body */}
      <div className="prose prose-gray max-w-none text-xs sm:text-sm text-gray-800 leading-relaxed space-y-6">
        <p>
          Working with documents across different operating systems, email clients, and application portals is a daily requirement for professionals and students. Whether you are dealing with government upload size limits, vendor agreements, or financial statements, having the right utility simplifies your workflow significantly.
        </p>

        <h2 className="text-lg font-bold text-[#111111] pt-2">Step 1: Understanding the Objective</h2>
        <p>
          Before executing conversions or optimizations, identify the core requirements of your destination portal. For example, many government tax and university submission portals require PDF files below 2 MB, while maintaining clear 300 DPI text legibility for scanning.
        </p>

        <h2 className="text-lg font-bold text-[#111111] pt-2">Step 2: Client-Side Zero Retention Processing</h2>
        <p>
          Unlike older legacy utility sites that upload your confidential documents to unknown remote servers, Doclly uses modern browser-native execution. When you compress or merge files, the operation happens directly in your device memory with zero retention.
        </p>

        {/* Embedded Interactive CTA Card */}
        <div className="my-6 p-5 bg-[#FFC800]/20 rounded-2xl border border-[#FFC800]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#111111]">Try this tool directly on Doclly</h4>
            <p className="text-xs text-[#6B7280]">
              Execute this workflow in 5 seconds with zero software installation.
            </p>
          </div>
          <Link
            to={post.toolLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#111111] bg-[#FFC800] hover:bg-[#E6B400] rounded-xl transition-colors shrink-0 border border-[#E5E5E5] shadow-2xs"
          >
            <span>Open {post.toolName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <h2 className="text-lg font-bold text-[#111111] pt-2">Step 3: Verification & Next Steps</h2>
        <p>
          Always inspect the resulting file to ensure page numbering, signatures, and image clarity are preserved accurately. If you need to summarize or extract data from the final output, Doclly&rsquo;s AI Assistant is accessible with a single click.
        </p>
      </div>

      {/* Bottom Navigation */}
      <div className="pt-8 border-t border-[#E5E5E5] flex items-center justify-between">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Guides</span>
        </Link>
      </div>
    </article>
  );
};
