import { useEffect } from 'react';
import Button from './Button';

interface ModalConfirmationProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmType?: 'delete' | 'create';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalConfirmation({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmType = 'delete',
  onConfirm,
  onCancel,
}: ModalConfirmationProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        className="relative z-10 w-full max-w-sm mx-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"
        style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset' }}>
        <div className="flex items-start gap-4 mb-5">
          {confirmType === 'delete' ? (
            <div className="flex-shrink-0 w-9 h-9 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-red-400">
                <path
                  d="M6 2h4M2 4h12M3.333 4l.667 8.667A1 1 0 005 13.667h6a1 1 0 001-.333L12.667 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="flex-shrink-0 w-9 h-9 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-amber-400">
                <path
                  d="M8 1.5L1.5 13.5h13L8 1.5zM8 6v3.5M8 11h.01"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          <div>
            <h3 className="font-mono font-semibold text-sm text-[var(--foreground)] mb-1">
              {title}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button title="Cancel" action={onCancel} type="cancel" size="sm" />
          <Button
            title={confirmLabel}
            action={onConfirm}
            type={confirmType === 'delete' ? 'delete' : 'create'}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
