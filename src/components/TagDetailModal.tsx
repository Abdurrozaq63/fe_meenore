import { useEffect, useState } from 'react';

import Button from './Button';
import ModalConfirmation from './ModalConfirmation';

import type { Tag } from '../tags/types/tag.type';

import { useTagSessions } from '../tags/hooks/use-tag-sessions.hook';

import type { SessionRecord } from '../sessions/types/get-sessions-list.type';

interface TagDetailModalProps {
  isOpen: boolean;
  tag: Tag | null;
  onClose: () => void;
}

const TYPE_LABEL: Record<Tag['type'], string> = {
  work: 'Work',
  class: 'Class',
  personal: 'Personal',
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);

  const remaining = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(
    2,
    '0',
  )}`;
};

export default function TagDetailModal({
  isOpen,
  tag,
  onClose,
}: TagDetailModalProps) {
  const [sessionToRemove, setSessionToRemove] = useState<SessionRecord | null>(
    null,
  );

  const [selectedSessionId, setSelectedSessionId] = useState('');

  const {
    sessions,
    availableSessions,
    loading,
    mutationLoading,
    error,
    addSession,
    removeSession,
  } = useTagSessions(isOpen && tag ? tag.id : null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSessionId('');
      setSessionToRemove(null);
    }
  }, [isOpen]);

  if (!isOpen || !tag) {
    return null;
  }

  const handleAddSession = async () => {
    if (!selectedSessionId) {
      return;
    }

    const success = await addSession(selectedSessionId);

    if (success) {
      setSelectedSessionId('');
    }
  };

  const handleRemoveSession = async () => {
    if (!sessionToRemove) {
      return;
    }

    const success = await removeSession(sessionToRemove.id);

    if (success) {
      setSessionToRemove(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <div
          className="relative z-10 w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl"
          style={{
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
          }}>
          <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--border)]">
            <div>
              <h2 className="font-mono font-semibold text-base text-[var(--foreground)]">
                {tag.title}
              </h2>

              <p className="text-[10px] font-mono text-[var(--muted-foreground)] mt-1">
                {TYPE_LABEL[tag.type]} · {sessions.length} session
                {sessions.length !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 2l8 8M10 2l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
            <div className="mb-6">
              <label className="block text-[10px] font-mono text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
                Add Session
              </label>

              <div className="flex gap-2">
                <select
                  value={selectedSessionId}
                  onChange={(event) => setSelectedSessionId(event.target.value)}
                  disabled={mutationLoading || availableSessions.length === 0}
                  className="flex-1 px-3 py-2 rounded text-xs font-mono text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--ring)] focus:outline-none">
                  <option value="">
                    {availableSessions.length === 0
                      ? 'No available sessions'
                      : 'Select a session'}
                  </option>

                  {availableSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title}
                    </option>
                  ))}
                </select>

                <Button
                  title={mutationLoading ? 'Adding...' : 'Add'}
                  action={handleAddSession}
                  type="create"
                  disabled={!selectedSessionId || mutationLoading}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 px-3 py-2">
                <p className="text-xs font-mono text-red-400">{error}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
                  Sessions in this tag
                </p>
              </div>

              {loading ? (
                <div className="py-10 text-center">
                  <p className="text-xs font-mono text-[var(--muted-foreground)]">
                    Loading sessions...
                  </p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-[var(--border)] rounded-lg">
                  <p className="text-xs font-mono text-[var(--muted-foreground)]">
                    No sessions in this tag yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs text-[var(--foreground)] truncate">
                          {session.title}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                            {formatDate(session.createdAt)}
                          </span>

                          <span className="text-[var(--border)] text-[10px]">
                            ·
                          </span>

                          <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                            {formatDuration(session.audioDurationSeconds)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={mutationLoading}
                        onClick={() => setSessionToRemove(session)}
                        className="flex-shrink-0 px-2 py-1.5 rounded text-[10px] font-mono text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmation
        isOpen={sessionToRemove !== null}
        title="Remove Session"
        message={
          sessionToRemove
            ? `"${sessionToRemove.title}" will be removed from "${tag.title}".`
            : ''
        }
        confirmLabel="Remove Session"
        confirmType="delete"
        onConfirm={handleRemoveSession}
        onCancel={() => setSessionToRemove(null)}
      />
    </>
  );
}
