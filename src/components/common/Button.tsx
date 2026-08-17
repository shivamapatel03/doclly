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
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none rounded-lg';

    const variants = {
      primary:
        'bg-[#FFC800] text-[#111111] font-semibold hover:bg-[#E6B400] active:bg-[#CCA000] border border-[#E5E5E5] shadow-2xs focus-visible:ring-2 focus-visible:ring-[#FFC800] focus-visible:ring-offset-1',
      secondary:
        'bg-[#F5F5F5] text-[#111111] border border-[#E5E5E5] hover:bg-[#EAEAEA] active:bg-[#E0E0E0] focus-visible:ring-2 focus-visible:ring-gray-300',
      outline:
        'bg-transparent text-[#111111] border border-[#E5E5E5] hover:bg-[#F5F5F5] active:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-300',
      ghost:
        'bg-transparent text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5] active:bg-gray-100',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-500',
      dark:
        'bg-[#111111] text-white hover:bg-black active:bg-neutral-900 border border-transparent shadow-2xs',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
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
