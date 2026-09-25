import React from 'react';
import { Sparkles } from 'lucide-react';

interface GlassAIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'lime' | 'subtle' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  glow?: boolean;
}

export const GlassAIButton: React.FC<GlassAIButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon = <Sparkles className="w-3.5 h-3.5" />,
  glow = true,
  className = '',
  disabled,
  ...props
}) => {
  let variantStyles = 'bg-gradient-to-r from-terracotta to-orange-warm hover:from-terracotta-hover hover:to-terracotta text-white border-transparent shadow-terracotta-glow';
  
  if (variant === 'lime') {
    variantStyles = 'bg-lime-digital hover:bg-[#a6c73e] text-charcoal font-bold border-transparent shadow-lime-glow';
  } else if (variant === 'subtle') {
    variantStyles = 'bg-white hover:bg-ivory-warm text-charcoal border border-border-pearl shadow-pearl-sm';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent hover:bg-ivory-warm text-charcoal-muted hover:text-charcoal border border-transparent';
  }

  let sizeStyles = 'px-4 py-2 text-xs';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-[11px]';
  if (size === 'lg') sizeStyles = 'px-6 py-3.5 text-sm font-bold tracking-tight';

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};
