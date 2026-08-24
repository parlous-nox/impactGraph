import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Dialog({ open, onClose, title, children, maxWidth = 'max-w-lg' }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} rounded-xl border border-base-700 bg-base-850 shadow-2xl animate-scale-in`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-base-700 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-100">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-base-800 hover:text-gray-300 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
