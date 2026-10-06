import { LogOut, X } from 'lucide-react';

interface ConfirmSignOutProps {
  open: boolean;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmSignOut({
  open,
  loading = false,
  error = '',
  onClose,
  onConfirm,
}: ConfirmSignOutProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}>
      <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <LogOut size={19} className="text-red-500" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Sign Out
              </h2>

              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                End your current session
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close">
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          Are you sure you want to sign out of your account?
        </p>

        {error && (
          <div className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2.5">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50">
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50">
            <LogOut size={14} />

            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
