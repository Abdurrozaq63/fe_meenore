import { useEffect, useState } from 'react';

import InlineEditor from './InlineEditor';

import { useUpdateSession } from '../record/hooks/use-update-session.hook';

export interface KeyPoint {
  id: string;
  text: string;
}

export interface Topic {
  id: string;
  title: string;
  keyPoints: KeyPoint[];
}

interface SummaryContentProps {
  sessionId: string;
  topics: Topic[];
  onUpdateTopics?: (topics: Topic[]) => void;
  editable?: boolean;
}

export default function SummaryContent({
  sessionId,
  topics,
  onUpdateTopics,
  editable = false,
}: SummaryContentProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    topics.reduce(
      (acc, topic) => ({
        ...acc,
        [topic.id]: true,
      }),
      {},
    ),
  );

  const [draftTopics, setDraftTopics] = useState<Topic[]>(topics);
  const [originalTopics, setOriginalTopics] = useState<Topic[]>(topics);

  const { update, loading, error, clearError } = useUpdateSession();

  /*
   * Sinkronisasi data dari parent.

   * Ini penting ketika SummaryContent pertama kali menerima hasil
   * GET /sessions/:id atau ketika session berubah.
   *
   * Jika sedang ada perubahan yang belum disimpan, jangan menimpa
   * draft user.
   */
  useEffect(() => {
    const topicsChanged =
      JSON.stringify(topics) !== JSON.stringify(originalTopics);

    if (!topicsChanged) {
      setDraftTopics(topics);
      setOriginalTopics(topics);
    }
  }, [topics, originalTopics]);

  const isDirty =
    JSON.stringify(draftTopics) !== JSON.stringify(originalTopics);

  const updateTopic = (topicId: string, newTitle: string) => {
    setDraftTopics((currentTopics) =>
      currentTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              title: newTitle,
            }
          : topic,
      ),
    );

    clearError();
  };

  const updateKeyPoint = (
    topicId: string,
    keyPointId: string,
    newText: string,
  ) => {
    setDraftTopics((currentTopics) =>
      currentTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              keyPoints: topic.keyPoints.map((keyPoint) =>
                keyPoint.id === keyPointId
                  ? {
                      ...keyPoint,
                      text: newText,
                    }
                  : keyPoint,
              ),
            }
          : topic,
      ),
    );

    clearError();
  };

  const removeKeyPoint = (topicId: string, keyPointId: string) => {
    setDraftTopics((currentTopics) =>
      currentTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              keyPoints: topic.keyPoints.filter(
                (keyPoint) => keyPoint.id !== keyPointId,
              ),
            }
          : topic,
      ),
    );

    clearError();
  };

  const addKeyPoint = (topicId: string) => {
    const newKeyPoint: KeyPoint = {
      id: crypto.randomUUID(),
      text: 'New key point',
    };

    setDraftTopics((currentTopics) =>
      currentTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              keyPoints: [...topic.keyPoints, newKeyPoint],
            }
          : topic,
      ),
    );

    clearError();
  };

  const handleCancel = () => {
    setDraftTopics(originalTopics);
    clearError();
  };

  const handleSave = async () => {
    if (!isDirty || loading) {
      return;
    }

    /*
     * Backend tidak membutuhkan:
     * - theme.id
     * - theme.order
     * - point.id
     * - point.order
     *
     * Backend akan membuat ulang ID dan menentukan order
     * berdasarkan posisi array.
     */
    const payload = {
      themes: draftTopics.map((topic) => ({
        title: topic.title,
        points: topic.keyPoints.map((keyPoint) => ({
          text: keyPoint.text,
        })),
      })),
    };

    const result = await update(sessionId, payload);
    console.log('payload', payload);
    console.log('session', sessionId);

    if (!result) {
      return;
    }

    /*
     * Update parent setelah database berhasil diperbarui.
     *
     * Kita tetap mempertahankan ID draft di UI.
     * Untuk tampilan tidak ada masalah karena ID tersebut
     * hanya digunakan sebagai React key.
     */
    onUpdateTopics?.(draftTopics);

    setOriginalTopics(draftTopics);
    setDraftTopics(draftTopics);
  };

  /*
   * Kalau mode bukan editable, gunakan data dari parent.
   * Namun ketika editable, kita gunakan draftTopics.
   */
  const displayedTopics = editable ? draftTopics : topics;

  return (
    <div className="space-y-4">
      {displayedTopics.map((topic, topicIdx) => (
        <div
          key={topic.id}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden"
          style={{
            boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset',
          }}>
          <button
            type="button"
            onClick={() =>
              setExpanded((prev) => ({
                ...prev,
                [topic.id]: !prev[topic.id],
              }))
            }
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--secondary)] transition-colors">
            <span className="font-mono text-[10px] text-[var(--muted-foreground)] w-5 flex-shrink-0 text-right">
              {String(topicIdx + 1).padStart(2, '0')}
            </span>

            <div className="flex-1 min-w-0">
              {editable ? (
                <div onClick={(event) => event.stopPropagation()}>
                  <InlineEditor
                    value={topic.title}
                    onSave={(value) => updateTopic(topic.id, value)}
                    className="font-mono font-semibold text-sm"
                  />
                </div>
              ) : (
                <span className="font-mono font-semibold text-sm text-[var(--foreground)]">
                  {topic.title}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                {topic.keyPoints.length} pts
              </span>

              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`text-[var(--muted-foreground)] transition-transform ${
                  expanded[topic.id] ? 'rotate-180' : ''
                }`}>
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {expanded[topic.id] && (
            <div className="border-t border-[var(--border)] px-4 py-3 space-y-2">
              {topic.keyPoints.map((keyPoint) => (
                <div key={keyPoint.id} className="flex items-start gap-3 group">
                  <div className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0 mt-2" />

                  <div className="flex-1 min-w-0">
                    {editable ? (
                      <InlineEditor
                        value={keyPoint.text}
                        onSave={(value) =>
                          updateKeyPoint(topic.id, keyPoint.id, value)
                        }
                        multiline
                        className="text-sm text-[var(--foreground)] leading-relaxed"
                      />
                    ) : (
                      <p className="text-sm text-[var(--foreground)] leading-relaxed">
                        {keyPoint.text}
                      </p>
                    )}
                  </div>

                  {editable && (
                    <button
                      type="button"
                      onClick={() => removeKeyPoint(topic.id, keyPoint.id)}
                      disabled={loading}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400 transition-all disabled:pointer-events-none">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none">
                        <path
                          d="M2 2l8 8M10 2l-8 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              {editable && (
                <button
                  type="button"
                  onClick={() => addKeyPoint(topic.id)}
                  disabled={loading}
                  className="ml-4 mt-1 text-[10px] font-mono text-[var(--muted-foreground)] hover:text-blue-400 flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:pointer-events-none">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M5 1v8M1 5h8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add key point
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {editable && isDirty && (
        <div className="pt-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-[var(--foreground)]">
                  Unsaved changes
                </p>

                <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                  Your summary has been modified.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-md border border-[var(--border)] text-[10px] font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors disabled:opacity-50">
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-[10px] font-mono hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-3 rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2">
                <p className="text-[10px] font-mono text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
