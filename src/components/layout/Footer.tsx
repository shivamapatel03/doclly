import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F5] border-t border-[#E5E5E5] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo/image.png"
                alt="Doclly Icon"
                className="h-8 w-auto object-contain rounded-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <img
                src="/logo/text.png"
                alt="Doclly"
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const sibling = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                  if (sibling) sibling.classList.remove('hidden');
                }}
              />
              <span className="text-xl font-extrabold tracking-tight text-[#111111] hidden">Doclly</span>
            </Link>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-sm">
              The high-speed PDF & document conversion platform. Convert, merge, split, compress, edit, and protect files with 100% in-browser privacy.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#6B7280] pt-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-Retention Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#111111]" />
                <span>Client-Side Security</span>
              </div>
            </div>
          </div>

          {/* Col 2: Convert from PDF */}
          <div>
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">Convert from PDF</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tools/pdf-to-word" className="text-[#6B7280] hover:text-[#111111] transition-colors">PDF to Word</Link>
              </li>
              <li>
                <Link to="/tools/pdf-to-excel" className="text-[#6B7280] hover:text-[#111111] transition-colors">PDF to Excel</Link>
              </li>
              <li>
                <Link to="/tools/pdf-to-ppt" className="text-[#6B7280] hover:text-[#111111] transition-colors">PDF to PowerPoint</Link>
              </li>
              <li>
                <Link to="/tools/pdf-to-jpg" className="text-[#6B7280] hover:text-[#111111] transition-colors">PDF to JPG</Link>
              </li>
              <li>
                <Link to="/tools/pdf-to-text" className="text-[#6B7280] hover:text-[#111111] transition-colors">PDF to Text</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Convert to PDF & Organize */}
          <div>
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">Convert to PDF</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tools/word-to-pdf" className="text-[#6B7280] hover:text-[#111111] transition-colors">Word to PDF</Link>
              </li>
              <li>
                <Link to="/tools/excel-to-pdf" className="text-[#6B7280] hover:text-[#111111] transition-colors">Excel to PDF</Link>
              </li>
              <li>
                <Link to="/tools/jpg-to-pdf" className="text-[#6B7280] hover:text-[#111111] transition-colors">JPG to PDF</Link>
              </li>
              <li>
                <Link to="/tools/merge-pdf" className="text-[#6B7280] hover:text-[#111111] transition-colors">Merge PDF</Link>
              </li>
              <li>
                <Link to="/tools/split-pdf" className="text-[#6B7280] hover:text-[#111111] transition-colors">Split PDF</Link>
              </li>
              <li>
                <Link to="/tools/compress-pdf" className="text-[#6B7280] hover:text-[#111111] transition-colors">Compress PDF</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">Company & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/pricing" className="text-[#6B7280] hover:text-[#111111] transition-colors">Pricing</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#6B7280] hover:text-[#111111] transition-colors">Privacy & Security</Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#6B7280] hover:text-[#111111] transition-colors">Guides & Blog</Link>
              </li>
              <li>
                <a
                  href="https://www.reddit.com/user/doclly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B7280] hover:text-[#FF4500] flex items-center gap-1.5 transition-colors font-medium"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#FF4500"/>
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" fill="white"/>
                  </svg>
                  Reddit News
                </a>
              </li>
              <li>
                <a
                  href="https://www.producthunt.com/products/doclly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B7280] hover:text-[#FF6154] flex items-center gap-1.5 transition-colors font-medium"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#FF6154"/>
                    <path d="M13.6 12H10.5V8.5H13.6C14.5665 8.5 15.35 9.2835 15.35 10.25C15.35 11.2165 14.5665 12 13.6 12ZM13.6 7H9V17H10.5V13.5H13.6C15.3949 13.5 16.85 12.0449 16.85 10.25C16.85 8.45507 15.3949 7 13.6 7Z" fill="white"/>
                  </svg>
                  Product Hunt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© {new Date().getFullYear()} Doclly. All rights reserved. Documents simplified.</p>
          <div className="flex items-center gap-1.5 font-medium text-[#4B5563]">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline-block animate-pulse" />
            <span>in India</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#111111] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#111111] transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-[#111111] transition-colors">Security Overview</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
