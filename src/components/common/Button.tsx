import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none rounded-full cursor-pointer';

    const variants = {
      primary:
        'bg-[#FFC800] hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] focus-visible:ring-2 focus-visible:ring-[#FFC800] focus-visible:ring-offset-1',
      secondary:
        'bg-[#F5F5F5] hover:bg-[#EAEAEA] active:bg-[#E0E0E0] text-[#111111] border border-[#D5D5D5] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.08)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-gray-300',
      outline:
        'bg-white hover:bg-gray-50 text-[#111111] border border-[#D5D5D5] shadow-2xs focus-visible:ring-2 focus-visible:ring-gray-300',
      ghost:
        'bg-transparent text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5] active:bg-gray-100 rounded-lg',
      danger:
        'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-rose-500',
      dark:
        'bg-[#111111] hover:bg-black active:bg-neutral-900 text-white border border-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_8px_rgba(0,0,0,0.25)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-xs sm:text-sm px-4 py-2 gap-2',
      lg: 'text-xs sm:text-sm px-5 py-2.5 gap-2 font-bold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
