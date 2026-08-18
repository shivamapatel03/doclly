import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('doclly_ph_announcement_dismissed');
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('doclly_ph_announcement_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#111111] text-white py-2 px-4 text-xs sm:text-sm font-medium relative z-40 border-b border-neutral-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFC800] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#FF6154"/>
              <path d="M13.6 12H10.5V8.5H13.6C14.5665 8.5 15.35 9.2835 15.35 10.25C15.35 11.2165 14.5665 12 13.6 12ZM13.6 7H9V17H10.5V13.5H13.6C15.3949 13.5 16.85 12.0449 16.85 10.25C16.85 8.45507 15.3949 7 13.6 7Z" fill="white"/>
            </svg>
            Launching Aug 30
          </span>
          <span className="hidden sm:inline text-neutral-300">
            Doclly is officially launching on Product Hunt on <strong>August 30</strong>!
          </span>
          <span className="sm:hidden text-neutral-300">
            Doclly launches Aug 30 on Product Hunt!
          </span>
          <a
            href="https://www.producthunt.com/products/doclly?utm_source=doclly_banner&utm_medium=website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full bg-[#FFC800] hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] ml-1 transition-all cursor-pointer"
          >
            Support Us <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
