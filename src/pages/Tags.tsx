import { useState } from 'react';

import Layout from '../components/Layout';
import TagComponent from '../components/TagComponent';
import TagModal from '../components/TagModal';
import TagDetailModal from '../components/TagDetailModal';
import Button from '../components/Button';

import type { Tag, TagType } from '../tags/types/tag.type';

import { useGetTags } from '../tags/hooks/use-get-tags.hook';
import { useTagMutation } from '../tags/hooks/use-tag-mutation.hook';

export default function Tags() {
  const { tags, setTags, loading, error, refetch } = useGetTags();

  const {
    create,
    update,
    remove,
    loading: mutationLoading,
    error: mutationError,
  } = useTagMutation();

  const [modalOpen, setModalOpen] = useState(false);

  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const [filter, setFilter] = useState<'all' | TagType>('all');

  const filtered =
    filter === 'all' ? tags : tags.filter((tag) => tag.type === filter);

  const handleSave = async (data: Omit<Tag, 'id'>) => {
    if (editingTag) {
      const result = await update(editingTag.id, {
        title: data.title,
        type: data.type,
      });

      if (!result) {
        return;
      }

      setTags((previous) =>
        previous.map((tag) =>
          tag.id === editingTag.id
            ? {
                ...tag,
                title: result.title,
                type: result.type,
              }
            : tag,
        ),
      );
    } else {
      const result = await create({
        title: data.title,
        type: data.type,
      });

      if (!result) {
        return;
      }

      setTags((previous) => [
        ...previous,
        {
          id: result.id,
          title: result.title,
          type: result.type,
          sessionCount: 0,
        },
      ]);
    }

    setEditingTag(null);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    const success = await remove(id);

    if (!success) {
      return;
    }

    setTags((previous) => previous.filter((tag) => tag.id !== id));

    if (selectedTag?.id === id) {
      setSelectedTag(null);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setModalOpen(true);
  };

  const handleOpen = (tag: Tag) => {
    setSelectedTag(tag);
  };

  const openCreate = () => {
    setEditingTag(null);
    setModalOpen(true);
  };
  console.log('TAGS', tags);

  return (
    <>
      <Layout>
        <div className="px-8 py-8 max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-mono font-bold text-xl text-[var(--foreground)] mb-1">
                Tags
              </h1>

              <p className="text-xs font-mono text-[var(--muted-foreground)]">
                {tags.length} tag
                {tags.length !== 1 ? 's' : ''} across all sessions
              </p>
            </div>

            <Button
              title="Create Tag"
              action={openCreate}
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

          <div className="flex gap-2 mb-6">
            {(
              [
                {
                  value: 'all',
                  label: 'All',
                },
                {
                  value: 'work',
                  label: '💼 Work',
                },
                {
                  value: 'class',
                  label: '📚 Class',
                },
                {
                  value: 'personal',
                  label: '🏠 Personal',
                },
              ] as {
                value: 'all' | TagType;
                label: string;
              }[]
            ).map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  filter === item.value
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--muted-foreground)]/30'
                }`}>
                {item.label}
              </button>
            ))}
          </div>

          {(error || mutationError) && (
            <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 px-3 py-2 flex items-center justify-between gap-3">
              <p className="text-xs font-mono text-red-400">
                {error || mutationError}
              </p>

              {error && (
                <button
                  type="button"
                  onClick={refetch}
                  className="text-xs font-mono text-red-300 underline">
                  Retry
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <p className="text-xs font-mono text-[var(--muted-foreground)]">
                Loading tags...
              </p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((tag) => (
                <TagComponent
                  key={tag.id}
                  tag={tag}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[var(--muted-foreground)] font-mono">
              <p className="text-sm">No tags found.</p>
            </div>
          )}
        </div>
      </Layout>

      <TagModal
        isOpen={modalOpen}
        tag={editingTag}
        loading={mutationLoading}
        onSave={handleSave}
        onClose={() => {
          if (mutationLoading) {
            return;
          }

          setModalOpen(false);
          setEditingTag(null);
        }}
      />

      <TagDetailModal
        isOpen={selectedTag !== null}
        tag={selectedTag}
        onClose={() => setSelectedTag(null)}
      />
    </>
  );
}
