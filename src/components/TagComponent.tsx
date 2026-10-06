import { useState } from 'react';
import { Link } from 'react-router-dom';

import ModalConfirmation from './ModalConfirmation';

import type { Tag } from '../tags/types/tag.type';

interface TagComponentProps {
  tag: Tag;
  onEdit?: (tag: Tag) => void;
  onDelete?: (id: string) => void;
}

const TYPE_CONFIG = {
  work: {
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
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    label: 'Work',
  },

  class: {
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
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    label: 'Class',
  },

  personal: {
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
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    label: 'Personal',
  },
};

export default function TagComponent({
  tag,
  onEdit,
  onDelete,
}: TagComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const config = TYPE_CONFIG[tag.type];

  return (
    <>
      <div
        className="group relative flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 hover:bg-[var(--secondary)] transition-all"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset',
        }}>
        {/* Tag content */}
        <Link
          to={`/tags/${tag.id}`}
          className="flex items-center gap-3 flex-1 min-w-0"
          onClick={() => setMenuOpen(false)}>
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-md border flex items-center justify-center ${config.bg} ${config.color}`}>
            {config.icon}
          </div>

          {/* Information */}
          <div className="flex-1 min-w-0">
            <p className="font-mono font-medium text-sm text-[var(--foreground)] truncate">
              {tag.title}
            </p>

            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-mono ${config.color}`}>
                {config.label}
              </span>

              {tag.sessionCount !== undefined && (
                <>
                  <span className="text-[var(--border)] text-[10px]">·</span>

                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                    {tag.sessionCount} session
                    {tag.sessionCount !== 1 ? 's' : ''}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Action menu */}
        <div
          className="relative flex-shrink-0"
          onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            aria-label={`Actions for ${tag.title}`}
            onClick={() => setMenuOpen((value) => !value)}
            className="w-7 h-7 flex items-center justify-center rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <circle cx="7" cy="2.5" r="1" />
              <circle cx="7" cy="7" r="1" />
              <circle cx="7" cy="11.5" r="1" />
            </svg>
          </button>

          {menuOpen && (
            <>
              {/* Outside click layer */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xl py-1 overflow-hidden">
                {/* Open */}
                <Link
                  to={`/tags/${tag.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-xs font-mono text-[var(--foreground)] hover:bg-[var(--muted)] flex items-center gap-2 transition-colors">
                  <span className="text-blue-400">→</span>
                  Open
                </Link>

                {/* Edit */}
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(tag);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-mono text-[var(--foreground)] hover:bg-[var(--muted)] flex items-center gap-2 transition-colors">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-amber-400">
                      <path
                        d="M11.5 2.5a1.5 1.5 0 012.121 2.121L5.5 12.743 2 14l1.257-3.5L11.5 2.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Edit
                  </button>
                )}

                {/* Delete */}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-mono text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5 2h6M2 4h12M3.333 4l.667 8.667A1 1 0 005 13.667h6a1 1 0 001-.333L12.667 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <ModalConfirmation
        isOpen={showDeleteModal}
        title="Delete Tag"
        message={`"${tag.title}" will be removed from all sessions. This cannot be undone.`}
        confirmLabel="Delete Tag"
        confirmType="delete"
        onConfirm={() => {
          onDelete?.(tag.id);
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
