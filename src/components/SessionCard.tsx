import { useNavigate } from 'react-router-dom';

export interface SessionRecord {
  id: string;
  title: string;
  audioDurationSeconds: number;
  isFavourite: boolean;
  tagId: string | null;
  tagTitle: string | null;
  tagType: string | null;
  createdAt: string;
}
export interface SessionsPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetSessionsList {
  data: SessionRecord;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function SessionCard({ data }: GetSessionsList) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/detail/${data.id}`)}
      className="group w-full text-left rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-150 hover:border-[var(--muted-foreground)]/40 hover:bg-[var(--secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)] cursor-pointer"
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset',
      }}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-md bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mt-0.5 group-hover:bg-blue-600/15 transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-blue-400">
            <path
              d="M8 1a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0V3a2 2 0 0 0-2-2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M4 7a4 4 0 0 0 8 0M8 11v3M6 14h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="font-mono font-medium text-sm text-[var(--foreground)] truncate mb-0.5 group-hover:text-white transition-colors">
            {data.title}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--muted-foreground)]">
            <span>{formatDate(data.createdAt)}</span>

            <span className="text-[var(--border)]">·</span>

            <span>{formatDuration(data.audioDurationSeconds)}</span>
          </div>

          {/* Tag */}
          {data.tagTitle && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]">
                {data.tagTitle}
              </span>
            </div>
          )}
        </div>

        {/* Favourite */}
        {data.isFavourite && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="text-amber-400 flex-shrink-0 mt-1">
            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
          </svg>
        )}
      </div>
    </button>
  );
}
