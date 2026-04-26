import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const variants = {
      primary: 'bg-terracotta-600 text-white shadow-sm hover:-translate-y-0.5 hover:bg-terracotta-700 hover:shadow-medium active:translate-y-0 active:bg-terracotta-800',
      secondary: 'bg-olive-600 text-white shadow-sm hover:-translate-y-0.5 hover:bg-olive-700 hover:shadow-medium active:translate-y-0 active:bg-olive-800',
      outline: 'border border-terracotta-500 text-terracotta-700 hover:-translate-y-0.5 hover:bg-terracotta-50 active:translate-y-0 active:bg-terracotta-100',
      ghost: 'text-stone-700 hover:bg-stone-100 active:bg-stone-200',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
