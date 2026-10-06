import { useCallback, useEffect, useState } from 'react';

import { getSessionDetail } from '../services/detail.service';

import type { GetSessionDetailResponse } from '../types/get-session-detail.type';

export const useGetSessionDetail = (sessionId: string | undefined) => {
  const [data, setData] = useState<GetSessionDetailResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!sessionId) {
      setData(null);
      setLoading(false);
      setError('Session ID tidak ditemukan.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getSessionDetail(sessionId);

      setData(result);
    } catch (err: any) {
      console.error('Failed to fetch session detail:', err);

      const message =
        err.response?.data?.message ||
        'Gagal mengambil detail session. Silakan coba lagi.';

      if (Array.isArray(message)) {
        setError(message.join(', '));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetail,
  };
};
