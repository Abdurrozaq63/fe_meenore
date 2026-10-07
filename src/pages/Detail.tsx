import { useEffect, useState } from 'react';

import { useNavigate, useParams, Link } from 'react-router-dom';

import Layout from '../components/Layout';
import AudioPlayer from '../components/AudioPlayer';
import SummaryContent from '../components/SummaryContent';
import Button from '../components/Button';
import ModalConfirmation from '../components/ModalConfirmation';

import type { Topic } from '../components/SummaryContent';

import { useGetSessionDetail } from '../detail/hooks/use-get-session-detail.hook';

import { useFavouriteSession } from '../detail/hooks/use-favourite-session.hook';

import { useDeleteSession } from '../detail/hooks/use-delete-session.hook';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: session, loading, error } = useGetSessionDetail(id);

  const [favouriteState, setFavouriteState] = useState(session?.isFavourite);

  const { updateFavourite, loadingFavourite } = useFavouriteSession();

  const { remove, loading: deleting, error: deleteError } = useDeleteSession();

  const [editable, setEditable] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [topics, setTopics] = useState<Topic[]>([]);

  /*
   * Mapping response API:
   *
   * themes
   *   ↓
   * Topic[]
   *
   * Kita juga sort berdasarkan order agar frontend
   * mengikuti urutan dari database.
   */
  useEffect(() => {
    if (!session) {
      return;
    }

    const mappedTopics: Topic[] = [...session.themes]
      .sort((a, b) => a.order - b.order)
      .map((theme) => ({
        id: theme.id,
        title: theme.title,
        keyPoints: [...theme.points]
          .sort((a, b) => a.order - b.order)
          .map((point) => ({
            id: point.id,
            text: point.text,
          })),
      }));

    setTopics(mappedTopics);
  }, [session]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '00:00';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0',
      )}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  const handleAddFavourite = async () => {
    if (!id) {
      return;
    }
    const update = await updateFavourite(id, !favouriteState);
    console.log('Session.UPDATE', session?.isFavourite);
    console.log('UPDATE STATE', favouriteState);
    if (!update) {
      console.log('Favourite false');
      return;
    }
    setFavouriteState((prev) => !prev);
  };

  const handleDelete = async () => {
    if (!id || deleting) {
      return;
    }

    const success = await remove(id);

    if (!success) {
      return;
    }

    setShowDelete(false);

    navigate('/archives', {
      replace: true,
    });
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
              style={{
                animationDelay: '150ms',
              }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
              style={{
                animationDelay: '300ms',
              }}
            />
          </div>

          <p className="text-[10px] mt-3">Loading session...</p>
        </div>
      </Layout>
    );
  }

  /*
   * Error / session tidak ditemukan
   */
  if (error || !session) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)] font-mono px-6 text-center">
          <p className="text-lg mb-2">Session not found.</p>

          {error && (
            <p className="text-[10px] text-red-400 mb-4 max-w-md">{error}</p>
          )}

          <Button
            title="Back to Archives"
            action={() => navigate('/archives')}
            type="ghost"
          />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="px-8 py-8 max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted-foreground)] mb-6">
            <Link
              to="/archives"
              className="hover:text-[var(--foreground)] transition-colors">
              Archives
            </Link>

            <span>/</span>

            <span className="text-[var(--foreground)] truncate max-w-xs">
              {session.title}
            </span>
          </div>

          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="font-mono font-bold text-xl text-[var(--foreground)] leading-tight">
              {session.title}
            </h1>

            {session.isFavourite && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="text-amber-400 flex-shrink-0 mt-1">
                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
              </svg>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--muted-foreground)] mb-6 flex-wrap">
            <span>{formatDate(session.createdAt)}</span>

            <span className="text-[var(--border)]">·</span>

            <span>{formatDuration(session.audioDurationSeconds)}</span>

            <span className="text-[var(--border)]">·</span>

            <span>{session.themes.length} topics</span>
          </div>

          {/* Audio player */}
          <div className="mb-6">
            <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              Recording
            </p>

            <AudioPlayer
              title={session.title}
              src={session.audioUrl}
              duration={session.audioDurationSeconds}
            />
          </div>

          {/* Summary header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
              Summary
            </p>

            <div className="flex gap-2">
              <Button
                title={favouriteState ? 'Add Favourite' : 'Remove Favourite'}
                action={handleAddFavourite}
                type="edit"
                size="sm"
                disabled={loadingFavourite}
                icon={
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="text-amber-400 flex-shrink-0 mt-1">
                    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                  </svg>
                }
              />

              <Button
                title={editable ? 'Done editing' : 'Edit summary'}
                action={() => setEditable((value) => !value)}
                type="edit"
                size="sm"
                icon={
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M8.5 1.5a1.5 1.5 0 012.121 2.121L4.5 9.743 2 10.5l.757-2.5L8.5 1.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />

              <Button
                title="Delete session"
                action={() => setShowDelete(true)}
                type="delete"
                size="sm"
                icon={
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M4 2h4M1.5 3h9M2.5 3l.5 6.5A1 1 0 004 10.5h4a1 1 0 001-.25L9.5 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Summary */}
          <SummaryContent
            sessionId={session.id}
            topics={topics}
            onUpdateTopics={setTopics}
            editable={editable}
          />

          {/* Delete error */}
          {deleteError && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-[10px] font-mono text-red-400">
                {deleteError}
              </p>
            </div>
          )}
        </div>
      </Layout>

      {/* Delete confirmation */}
      <ModalConfirmation
        isOpen={showDelete}
        title="Delete Session"
        message={`"${session.title}" and its summary will be permanently deleted. This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete Session'}
        confirmType="delete"
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) {
            setShowDelete(false);
          }
        }}
      />
    </>
  );
}
