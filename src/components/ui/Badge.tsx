import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-wine-950 text-white ring-1 ring-wine-950',
    secondary: 'bg-olive-100 text-olive-800 ring-1 ring-olive-200',
    success: 'bg-green-100 text-green-800 ring-1 ring-green-200',
    warning: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
    error: 'bg-red-100 text-red-800 ring-1 ring-red-200',
    info: 'bg-cream-100 text-wine-900 ring-1 ring-cream-300',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase',
    md: 'px-3 py-1.5 text-xs tracking-[0.08em] uppercase',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
