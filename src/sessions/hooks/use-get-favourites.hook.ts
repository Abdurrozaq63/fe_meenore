import { useCallback, useEffect, useState } from 'react';

import { getFavourites } from '../services/favourite.service';

import type {
  SessionRecord,
  SessionsPaginationMeta,
} from '../../sessions/types/get-sessions-list.type';

export const useGetFavourites = () => {
  const [favourites, setFavourites] = useState<SessionRecord[]>([]);

  const [meta, setMeta] = useState<SessionsPaginationMeta | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchFavourites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFavourites();

      setFavourites(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      console.error('Failed to fetch favourite sessions:', err);

      const message =
        err.response?.data?.message ||
        'Gagal mengambil favourite sessions. Silakan coba lagi.';

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
    fetchFavourites();
  }, [fetchFavourites]);

  return {
    favourites,
    meta,
    loading,
    error,
    refetch: fetchFavourites,
  };
};
