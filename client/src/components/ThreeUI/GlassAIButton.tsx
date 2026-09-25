import React from 'react';
import { Sparkles } from 'lucide-react';

interface GlassAIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'cyan' | 'purple' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  glow?: boolean;
}

export const GlassAIButton: React.FC<GlassAIButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon = <Sparkles className="w-4 h-4 text-cyan-300" />,
  glow = true,
  className = '',
  disabled,
  ...props
}) => {
  let variantStyles = 'bg-gradient-to-r from-indigo-600/90 via-indigo-700/80 to-cyan-600/90 hover:from-indigo-500 hover:to-cyan-500 text-white border-indigo-400/40';
  if (variant === 'cyan') {
    variantStyles = 'bg-gradient-to-r from-cyan-600/80 via-blue-600/80 to-indigo-600/80 hover:from-cyan-500 hover:to-indigo-500 text-white border-cyan-400/50';
  } else if (variant === 'purple') {
    variantStyles = 'bg-gradient-to-r from-purple-600/80 via-indigo-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 text-white border-purple-400/50';
  } else if (variant === 'subtle') {
    variantStyles = 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600';
  }

  let sizeStyles = 'px-4 py-2 text-xs';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-[11px]';
  if (size === 'lg') sizeStyles = 'px-6 py-3 text-sm font-bold';

  const glowEffect = glow && !disabled ? 'hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]' : '';

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold border backdrop-blur-md transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${glowEffect} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};
