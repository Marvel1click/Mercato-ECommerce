import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col items-end gap-2 sm:left-auto" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex w-full items-center gap-3 rounded-2xl px-4 py-3 shadow-strong sm:min-w-[320px] sm:max-w-md animate-slide-in-right
            ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : ''}
            ${toast.type === 'error' ? 'bg-red-50 border border-red-200' : ''}
            ${toast.type === 'info' ? 'bg-blue-50 border border-blue-200' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />}
          <p className={`flex-1 text-sm font-medium
            ${toast.type === 'success' ? 'text-green-800' : ''}
            ${toast.type === 'error' ? 'text-red-800' : ''}
            ${toast.type === 'info' ? 'text-blue-800' : ''}
          `}>
            {toast.message}
          </p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 hover:bg-black/5 rounded transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
