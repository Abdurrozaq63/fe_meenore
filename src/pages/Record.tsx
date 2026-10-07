import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Layout from '../components/Layout';
import Button from '../components/Button';
import SummaryContent from '../components/SummaryContent';
import ModalConfirmation from '../components/ModalConfirmation';

import type { Topic } from '../components/SummaryContent';

import { useProcessSession } from '../record/hooks/use-process-session.hook';

import { getTags } from '../tags/services/tags.service';
import type { Tag } from '../tags/types/tag.type';

type Stage = 'input' | 'processing' | 'done';

function ProcessingDots() {
  return (
    <div className="flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
          style={{
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');

    const objectUrl = URL.createObjectURL(file);

    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);

      if (!Number.isFinite(audio.duration)) {
        reject(new Error('Unable to determine audio duration.'));

        return;
      }

      resolve(Math.round(audio.duration));
    };

    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(new Error('Unable to read audio file.'));
    };

    audio.src = objectUrl;
  });
}

function mapThemesToTopics(
  themes: {
    id: string;
    title: string;
    order: number;
    points: {
      id: string;
      text: string;
      order: number;
    }[];
  }[],
): Topic[] {
  return [...themes]
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
}

export default function Record() {
  const navigate = useNavigate();

  const { process, loading, error, clearError } = useProcessSession();

  const [stage, setStage] = useState<Stage>('input');

  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagError, setTagError] = useState('');

  const [showCancel, setShowCancel] = useState(false);

  const [topics, setTopics] = useState<Topic[]>([]);

  const [sessionId, setSessionId] = useState('');

  const [recording, setRecording] = useState(false);

  const [seconds, setSeconds] = useState(0);

  const [dragOver, setDragOver] = useState(false);

  const [fileName, setFileName] = useState('');

  const [title, setTitle] = useState('');

  const [tagId, setTagId] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopMediaStream = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    mediaStreamRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopTimer();
      stopMediaStream();
    };
  }, []);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoadingTags(true);
        setTagError('');

        const result = await getTags();

        setTags(result);
      } catch (err) {
        console.error('Failed to load tags:', err);

        setTagError('Failed to load tags.');
      } finally {
        setLoadingTags(false);
      }
    };

    void loadTags();
  }, []);

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);

    const sec = value % 60;

    return `${String(minutes).padStart(
      2,
      '0',
    )}:${String(sec).padStart(2, '0')}`;
  };

  const validateSessionInput = () => {
    clearError();

    if (!title.trim()) {
      return 'Judul sesi wajib diisi.';
    }

    if (!tagId) {
      return 'Tag wajib dipilih.';
    }

    return null;
  };

  const processAudioFile = async (file: File, duration?: number) => {
    const validationError = validateSessionInput();

    if (validationError) {
      return;
    }

    try {
      setStage('processing');

      setFileName(file.name);

      const audioDurationSeconds = duration ?? (await getAudioDuration(file));

      const result = await process({
        title: title.trim(),
        tagId,
        audioDurationSeconds,
        audio: file,
      });

      if (!result) {
        setStage('input');
        return;
      }

      setSessionId(result.id);

      const mappedTopics = mapThemesToTopics(result.themes);

      setTopics(mappedTopics);

      setStage('done');
    } catch (err) {
      console.error('Failed to process audio:', err);

      setStage('input');
    }
  };

  const handleFile = async (file: File) => {
    clearError();

    if (!file.type.startsWith('audio/')) {
      return;
    }

    setFileName(file.name);

    await processAudioFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setDragOver(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      void handleFile(file);
    }
  };

  const startRecording = async () => {
    clearError();

    const validationError = validateSessionInput();

    if (validationError) {
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          'Microphone recording is not supported by this browser.',
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      let mimeType = '';

      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
          })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
      };

      mediaRecorderRef.current = recorder;

      mediaStreamRef.current = stream;

      recorder.start();

      setRecording(true);

      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((value) => value + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Failed to start microphone:', err);

      stopMediaStream();

      const message =
        err?.name === 'NotAllowedError'
          ? 'Izin microphone ditolak. Silakan izinkan akses microphone pada browser.'
          : err?.message || 'Gagal mengakses microphone.';

      // error dari hook tidak bisa kita set
      // secara langsung, sehingga ditampilkan
      // melalui state lokal pada bagian berikutnya.
      console.error(message);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    stopTimer();

    setRecording(false);

    recorder.onstop = () => {
      stopMediaStream();

      mediaRecorderRef.current = null;

      const mimeType = recorder.mimeType || 'audio/webm';

      const blob = new Blob(audioChunksRef.current, {
        type: mimeType,
      });

      audioChunksRef.current = [];

      if (blob.size === 0) {
        setStage('input');

        return;
      }

      const extension = mimeType.includes('mp4') ? 'm4a' : 'webm';

      const file = new File([blob], `recording-${Date.now()}.${extension}`, {
        type: mimeType,
      });

      const duration = seconds;

      void processAudioFile(file, duration);
    };

    recorder.stop();
  };

  const handleCancel = () => {
    stopTimer();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    stopMediaStream();

    audioChunksRef.current = [];

    mediaRecorderRef.current = null;

    setRecording(false);

    setStage('input');

    setTopics([]);

    setFileName('');

    setTitle('');

    setTagId('');

    setSeconds(0);

    clearError();
  };

  const handleSaveToArchive = () => {
    navigate('/archives');
  };

  console.log('TAGS RECORD', tags);

  return (
    <>
      <Layout>
        <div className="px-8 py-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-mono font-bold text-xl text-[var(--foreground)] mb-1">
                New Session
              </h1>

              <p className="text-xs font-mono text-[var(--muted-foreground)]">
                Choose an input method to generate a summary
              </p>
            </div>

            {stage !== 'input' && (
              <Button
                title="Cancel"
                action={() => setShowCancel(true)}
                type="cancel"
              />
            )}
          </div>

          {stage === 'input' && (
            <div className="space-y-5">
              {/* Session information */}

              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="mb-4">
                  <p className="font-mono font-semibold text-sm text-[var(--foreground)] mb-1">
                    Session information
                  </p>

                  <p className="text-xs font-mono text-[var(--muted-foreground)]">
                    Add a title and tag before processing your audio.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="session-title"
                      className="block text-[10px] font-mono text-[var(--muted-foreground)] mb-1.5">
                      Title
                    </label>

                    <input
                      id="session-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Meeting project meenore"
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="session-tag"
                      className="block text-[10px] font-mono text-[var(--muted-foreground)] mb-1.5">
                      Tag
                    </label>

                    <select
                      id="session-tag"
                      value={tagId}
                      onChange={(e) => setTagId(e.target.value)}
                      disabled={loadingTags || tags.length === 0}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-xs font-mono text-[var(--foreground)] outline-none transition-colors focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">
                        {loadingTags
                          ? 'Loading tags...'
                          : tags.length === 0
                            ? 'No tags available'
                            : 'Select a tag'}
                      </option>

                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.title} ({tag.type})
                        </option>
                      ))}
                    </select>

                    {tagError && (
                      <p className="mt-1.5 text-[10px] font-mono text-red-400">
                        {tagError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* API error */}

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3">
                  <p className="text-xs font-mono text-red-400">{error}</p>
                </div>
              )}

              {/* Upload */}

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-lg border-2 border-dashed p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                  dragOver
                    ? 'border-blue-500/60 bg-blue-500/5'
                    : 'border-[var(--border)] hover:border-[var(--muted-foreground)]/40 hover:bg-[var(--secondary)]'
                }`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      void handleFile(file);
                    }

                    e.target.value = '';
                  }}
                />

                <div className="w-12 h-12 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2v10M6 6l4-4 4 4M4 14a3 3 0 006 0v-2M10 14a3 3 0 006 0v-2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M3 17h14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="text-center">
                  <p className="font-mono font-medium text-sm text-[var(--foreground)] mb-0.5">
                    Upload audio file
                  </p>

                  <p className="text-xs font-mono text-[var(--muted-foreground)]">
                    MP3, WAV, M4A, OGG — drag & drop or click
                  </p>
                </div>
              </div>

              {/* Microphone */}

              <button
                onClick={() => void startRecording()}
                disabled={loading}
                className="group w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col items-center gap-3 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset',
                }}>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/15 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2a3 3 0 00-3 3v5a3 3 0 006 0V5a3 3 0 00-3-3z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />

                    <path
                      d="M5 10a5 5 0 0010 0M10 15v3M8 18h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-mono font-semibold text-sm text-[var(--foreground)] mb-0.5">
                    Live Microphone
                  </p>

                  <p className="text-xs font-mono text-[var(--muted-foreground)]">
                    Record via your device mic
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Recording UI */}

          {stage === 'input' && recording && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/5 p-6 flex items-center gap-6">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />

                <div className="w-10 h-10 rounded-full bg-red-500/30 border border-red-500/40 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                </div>
              </div>

              <div className="flex-1">
                <p className="font-mono font-semibold text-sm text-[var(--foreground)] mb-1">
                  Microphone recording
                </p>

                <p className="font-mono text-2xl text-red-400 tracking-widest">
                  {formatTime(seconds)}
                </p>
              </div>

              <Button
                title="Stop & Summarize"
                action={stopRecording}
                type="create"
              />
            </div>
          )}

          {/* Processing */}

          {stage === 'processing' && (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ProcessingDots />
              </div>

              <div className="text-center">
                <p className="font-mono font-semibold text-sm text-[var(--foreground)] mb-1">
                  Generating summary
                </p>

                <p className="text-xs font-mono text-[var(--muted-foreground)]">
                  {fileName
                    ? `Processing ${fileName}`
                    : 'Transcribing and extracting topics...'}
                </p>

                {loading && (
                  <p className="text-[10px] font-mono text-[var(--muted-foreground)]/70 mt-2">
                    Uploading audio and generating summary...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Done */}

          {stage === 'done' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2 2L8 2"
                      stroke="#34d399"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="font-mono text-sm text-[var(--foreground)]">
                  Summary generated — {topics.length} topics extracted
                </p>

                <div className="ml-auto">
                  <Button
                    title="Back to archive"
                    action={handleSaveToArchive}
                    type="create"
                    size="sm"
                  />
                </div>
              </div>

              <SummaryContent
                sessionId={sessionId}
                topics={topics}
                onUpdateTopics={setTopics}
                editable
              />
            </div>
          )}
        </div>
      </Layout>

      <ModalConfirmation
        isOpen={showCancel}
        title="Cancel Session"
        message="All progress and any generated summary will be lost. Are you sure you want to cancel?"
        confirmLabel="Cancel session"
        confirmType="delete"
        onConfirm={() => {
          setShowCancel(false);
          handleCancel();
        }}
        onCancel={() => setShowCancel(false)}
      />
    </>
  );
}
