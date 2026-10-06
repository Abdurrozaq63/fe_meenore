import { useCallback, useEffect, useState } from 'react';

import { getTags } from '../services/tags.service';

import type { Tag } from '../types/tag.type';

export const useGetTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getTags();
      console.log('TAGS HOOK', response);

      setTags(response);
    } catch (err: any) {
      console.error('Failed to fetch tags:', err);

      const message =
        err.response?.data?.message ||
        'Gagal mengambil tags. Silakan coba lagi.';

      if (Array.isArray(message)) {
        setError(message.join(', '));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    setTags,
    loading,
    error,
    refetch: fetchTags,
  };
};
