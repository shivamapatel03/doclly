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
                <Link to="/dashboard" className="text-[#6B7280] hover:text-[#111111] transition-colors">Account Dashboard</Link>
              </li>
              <li>
                <a href="#faq" className="text-[#6B7280] hover:text-[#111111] transition-colors">Frequently Asked</a>
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
