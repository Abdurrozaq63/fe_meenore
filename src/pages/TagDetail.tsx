import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Layout from '../components/Layout';
import Button from '../components/Button';
import ModalConfirmation from '../components/ModalConfirmation';

import { useGetTags } from '../tags/hooks/use-get-tags.hook';
import { useTagSessions } from '../tags/hooks/use-tag-sessions.hook';

const TYPE_CONFIG = {
  work: {
    label: 'Work',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 5h12a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zM5 5V4a2 2 0 014 0v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  class: {
    label: 'Class',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M1 4l7-3 7 3-7 3-7-3zM4 6.5v4c0 1.1 1.8 2 4 2s4-.9 4-2v-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 4v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  personal: {
    label: 'Personal',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1a2 2 0 100 4 2 2 0 000-4zM3 13c0-2.761 2.239-5 5-5s5 2.239 5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
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
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;
};

export default function TagDetail() {
  const { id } = useParams<{
    id: string;
  }>();

  const { tags, loading: tagsLoading } = useGetTags();

  const tag = tags.find((item) => item.id === id);

  const {
    sessions,
    availableSessions,
    loading,
    mutationLoading,
    error,
    addSession,
    removeSession,
  } = useTagSessions(id ?? null);

  const [selectedSessionId, setSelectedSessionId] = useState('');

  const [sessionToRemove, setSessionToRemove] = useState<string | null>(null);

  const [showAddSession, setShowAddSession] = useState(false);

  if (!id) {
    return (
      <Layout>
        <div className="px-8 py-8 max-w-5xl mx-auto">
          <p className="text-sm font-mono text-red-400">
            Tag ID tidak ditemukan.
          </p>
        </div>
      </Layout>
    );
  }

  if (tagsLoading) {
    return (
      <Layout>
        <div className="px-8 py-8 max-w-5xl mx-auto">
          <div className="py-20 text-center">
            <p className="text-xs font-mono text-[var(--muted-foreground)]">
              Loading tag...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tag) {
    return (
      <Layout>
        <div className="px-8 py-8 max-w-5xl mx-auto">
          <Link
            to="/tags"
            className="text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            ← Back to Tags
          </Link>

          <div className="py-20 text-center">
            <p className="text-sm font-mono text-[var(--muted-foreground)]">
              Tag not found.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const config = TYPE_CONFIG[tag.type];

  const handleAddSession = async () => {
    if (!selectedSessionId) {
      return;
    }

    const success = await addSession(selectedSessionId);

    if (success) {
      setSelectedSessionId('');
      setShowAddSession(false);
    }
  };

  const handleRemoveSession = async () => {
    if (!sessionToRemove) {
      return;
    }

    const success = await removeSession(sessionToRemove);

    if (success) {
      setSessionToRemove(null);
    }
  };

  return (
    <Layout>
      <div className="px-8 py-8 max-w-5xl mx-auto">
        {/* Back */}
        <Link
          to="/tags"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6">
          <span>←</span>
          <span>Back to Tags</span>
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${config.bg} ${config.color}`}>
              {config.icon}
            </div>

            <div>
              <h1 className="font-mono font-bold text-xl text-[var(--foreground)] mb-1">
                {tag.title}
              </h1>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono ${config.color}`}>
                  {config.label}
                </span>

                <span className="text-[var(--border)]">·</span>

                <span className="text-xs font-mono text-[var(--muted-foreground)]">
                  {sessions.length} session
                  {sessions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <Button
            title="Add Session"
            action={() => setShowAddSession((value) => !value)}
            type="create"
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1v10M1 6h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </div>

        {/* Add session panel */}
        {showAddSession && (
          <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
                Add Session to Tag
              </p>

              <button
                type="button"
                onClick={() => setShowAddSession(false)}
                className="text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                Close
              </button>
            </div>

            {availableSessions.length === 0 ? (
              <p className="text-xs font-mono text-[var(--muted-foreground)]">
                No available sessions.
              </p>
            ) : (
              <div className="flex gap-2">
                <select
                  value={selectedSessionId}
                  onChange={(event) => setSelectedSessionId(event.target.value)}
                  disabled={mutationLoading}
                  className="flex-1 px-3 py-2 rounded text-xs font-mono text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--ring)] focus:outline-none">
                  <option value="">Select a session</option>

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
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 px-3 py-2">
            <p className="text-xs font-mono text-red-400">{error}</p>
          </div>
        )}

        {/* Session list */}
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-xs font-mono text-[var(--muted-foreground)]">
              Loading sessions...
            </p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted-foreground)] font-mono">
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              className="mx-auto mb-4 opacity-20">
              <rect
                x="2"
                y="2"
                width="12"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <path
                d="M5 8h6M8 5v6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <p className="text-sm">No sessions in this tag yet.</p>

            <p className="text-xs mt-1 text-[var(--muted-foreground)]/60">
              Add a session to start organizing your recordings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sessions.map((session) => (
              <div key={session.id} className="group relative">
                <Link
                  to={`/detail/${session.id}`}
                  className="block rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 hover:bg-[var(--secondary)] transition-all">
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md border border-[var(--border)] bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)]">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none">
                          <path
                            d="M4 2.5A1.5 1.5 0 015.5 1h5A1.5 1.5 0 0112 2.5v11a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 014 13.5v-11z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />

                          <path
                            d="M6 4h4M6 7h4M6 10h2"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <p className="font-mono font-medium text-sm text-[var(--foreground)] truncate">
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
                    </div>
                  </div>
                </Link>

                {/* Remove from tag */}
                <button
                  type="button"
                  disabled={mutationLoading}
                  onClick={() => setSessionToRemove(session.id)}
                  className="absolute right-3 top-3 w-7 h-7 flex items-center justify-center rounded text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                  title="Remove from tag">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalConfirmation
        isOpen={sessionToRemove !== null}
        title="Remove Session"
        message="Session ini akan dikeluarkan dari tag. Data session dan rekamannya tidak akan dihapus."
        confirmLabel="Remove Session"
        confirmType="delete"
        onConfirm={handleRemoveSession}
        onCancel={() => setSessionToRemove(null)}
      />
    </Layout>
  );
}
