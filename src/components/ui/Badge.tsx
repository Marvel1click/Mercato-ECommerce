import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-terracotta-100 text-terracotta-800 ring-1 ring-terracotta-200',
    secondary: 'bg-olive-100 text-olive-800 ring-1 ring-olive-200',
    success: 'bg-green-100 text-green-800 ring-1 ring-green-200',
    warning: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
    error: 'bg-red-100 text-red-800 ring-1 ring-red-200',
    info: 'bg-marine-100 text-marine-800 ring-1 ring-marine-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
