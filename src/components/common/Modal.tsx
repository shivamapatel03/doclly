import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const maxWidths = {
    sm: 'max-w-[calc(100vw-1.5rem)] sm:max-w-sm',
    md: 'max-w-[calc(100vw-1.5rem)] sm:max-w-md',
    lg: 'max-w-[calc(100vw-1.5rem)] sm:max-w-lg',
    xl: 'max-w-[calc(100vw-1.5rem)] sm:max-w-xl',
    '2xl': 'max-w-[calc(100vw-1.5rem)] sm:max-w-2xl',
    '4xl': 'max-w-[calc(100vw-1.5rem)] sm:max-w-4xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-x-hidden overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      {/* Backdrop click listener */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative z-10 w-full rounded-2xl bg-white text-left shadow-2xl border border-[#E5E7EB] transition-all my-auto max-h-[92dvh] flex flex-col animate-in zoom-in-95 duration-150 overflow-hidden box-border',
          maxWidths[maxWidth]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-3.5 sm:px-6 pt-3.5 sm:pt-5 pb-2.5 sm:pb-4 border-b border-[#E5E7EB] shrink-0">
            <div className="min-w-0 pr-2">
              {title && <h3 className="text-sm sm:text-lg font-bold text-[#111111] leading-snug">{title}</h3>}
              {description && <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5 leading-tight sm:leading-relaxed">{description}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-3.5 py-3 sm:px-6 sm:py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
};
