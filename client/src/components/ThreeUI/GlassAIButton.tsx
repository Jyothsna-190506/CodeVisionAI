import React from 'react';

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
  icon,
  glow = true,
  className = '',
  disabled,
  style = {},
  ...props
}) => {
  let baseStyle: React.CSSProperties = {};
  let variantClasses = '';

  if (variant === 'primary') {
    variantClasses = 'bg-[#D85C32] hover:bg-[#B94722] text-white border border-transparent shadow-md shadow-[#D85C32]/30';
    baseStyle = {
      backgroundColor: '#D85C32',
      color: '#FFFFFF',
      border: '1px solid transparent',
      boxShadow: '0 4px 14px rgba(216, 92, 50, 0.35)',
    };
  } else if (variant === 'lime') {
    variantClasses = 'bg-[#B7D94B] hover:bg-[#a6c73e] text-[#242321] font-bold border border-transparent shadow-sm shadow-[#B7D94B]/30';
    baseStyle = {
      backgroundColor: '#B7D94B',
      color: '#242321',
      border: '1px solid transparent',
    };
  } else if (variant === 'subtle') {
    variantClasses = 'bg-white hover:bg-[#F2EEE5] text-[#242321] border border-[#D5CEBF] shadow-sm';
    baseStyle = {
      backgroundColor: '#FFFFFF',
      color: '#242321',
      border: '1.5px solid #D5CEBF',
      boxShadow: '0 2px 8px rgba(36, 35, 33, 0.08)',
    };
  } else if (variant === 'ghost') {
    variantClasses = 'bg-transparent hover:bg-[#F2EEE5] text-[#625E57] hover:text-[#242321] border border-transparent';
    baseStyle = {
      backgroundColor: 'transparent',
      color: '#625E57',
    };
  }

  let sizeClasses = 'px-4 py-2 text-xs';
  if (size === 'sm') sizeClasses = 'px-3.5 py-1.5 text-[11px]';
  if (size === 'lg') sizeClasses = 'px-6 py-3 text-sm font-bold tracking-tight';

  return (
    <button
      disabled={disabled}
      style={{ ...baseStyle, ...style }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="inline-flex items-center gap-2">{children}</span>
    </button>
  );
};
