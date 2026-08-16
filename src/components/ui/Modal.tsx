import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-wine-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${sizes[size]} overflow-hidden rounded-[1.75rem] border border-white/80 bg-cream-50 shadow-strong animate-scale-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <h2 className="font-display text-2xl font-semibold text-wine-950">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-stone-100"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {!title && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full border border-stone-200 bg-white/90 p-2 shadow-sm transition-colors hover:bg-stone-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className={title ? 'p-6' : 'p-6 pt-12'}>{children}</div>
        </div>
      </div>
    </div>
  );
}
