import { useEffect, useState } from 'react';

import Button from './Button';

import type { Tag, TagType } from '../tags/types/tag.type';

interface TagModalProps {
  isOpen: boolean;
  tag?: Tag | null;
  loading?: boolean;
  onSave: (tag: Omit<Tag, 'id'>) => void;
  onClose: () => void;
}

const TYPE_OPTIONS: {
  value: TagType;
  label: string;
  icon: string;
}[] = [
  {
    value: 'work',
    label: 'Work',
    icon: '💼',
  },
  {
    value: 'class',
    label: 'Class',
    icon: '📚',
  },
  {
    value: 'personal',
    label: 'Personal',
    icon: '🏠',
  },
];

export default function TagModal({
  isOpen,
  tag,
  loading = false,
  onSave,
  onClose,
}: TagModalProps) {
  const [title, setTitle] = useState('');

  const [type, setType] = useState<TagType>('work');

  useEffect(() => {
    if (tag) {
      setTitle(tag.title);
      setType(tag.type);
    } else {
      setTitle('');
      setType('work');
    }
  }, [tag, isOpen]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKey);

      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKey);

      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || loading) {
      return;
    }

    onSave({
      title: title.trim(),
      type,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
      />

      <div
        className="relative z-10 w-full max-w-sm mx-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
        }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono font-semibold text-sm text-[var(--foreground)]">
            {tag ? 'Edit Tag' : 'Create Tag'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-6 h-6 flex items-center justify-center rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors disabled:opacity-50">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
              Tag Title
            </label>

            <input
              autoFocus
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={50}
              placeholder="e.g. Sprint Planning"
              disabled={loading}
              className="w-full px-3 py-2 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--ring)] focus:outline-none transition-colors font-[inherit] placeholder:text-[var(--muted-foreground)] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
              Type
            </label>

            <div className="grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={loading}
                  onClick={() => setType(option.value)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded border transition-all text-xs font-mono ${
                    type === option.value
                      ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                      : 'border-[var(--border)] bg-transparent text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]/40 hover:text-[var(--foreground)]'
                  }`}>
                  <span className="text-base">{option.icon}</span>

                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              title="Cancel"
              action={onClose}
              type="cancel"
              fullWidth
              disabled={loading}
            />

            <Button
              title={
                loading ? 'Saving...' : tag ? 'Save Changes' : 'Create Tag'
              }
              action={() =>
                handleSubmit({
                  preventDefault: () => {},
                } as React.FormEvent)
              }
              type="create"
              fullWidth
              disabled={!title.trim() || loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
