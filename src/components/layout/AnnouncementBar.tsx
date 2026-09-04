import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('doclly_beta_announcement_dismissed');
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('doclly_beta_announcement_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Announcement" className="bg-[#111111] text-white py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium relative z-40 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Clickable Announcement Content */}
        <a
          href="mailto:helpdoclly@zohomail.in?subject=Doclly%20Beta%20Feedback"
          className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-90 transition-opacity"
        >
          {/* Beta Badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#FFC800] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08)] shrink-0">
            Beta Version
          </span>

          {/* Desktop & Tablet Text */}
          <span className="hidden sm:inline text-neutral-300 truncate">
            Doclly is currently in <strong>Beta</strong>! Try all PDF & AI tools free — share your thoughts with us.
          </span>

          {/* Mobile Text */}
          <span className="sm:hidden text-neutral-300 text-[11px] truncate">
            Doclly is in Beta — Free early access!
          </span>

          {/* Action CTA */}
          <span className="inline-flex items-center gap-1 font-bold text-[11px] sm:text-xs text-[#FFC800] hover:text-[#FFE066] shrink-0 ml-auto sm:ml-2">
            Give Feedback <ArrowRight className="w-3 h-3" />
          </span>
        </a>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors shrink-0 ml-1"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
