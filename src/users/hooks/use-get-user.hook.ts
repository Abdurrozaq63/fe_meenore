import { useCallback, useEffect, useState } from 'react';

import { getUser } from '../services/users.service';

import type { User } from '../types/user.type';

export const useGetUser = (userId: string | undefined) => {
  const [data, setData] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setData(null);
      setLoading(false);
      setError('User ID tidak ditemukan.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getUser(userId);

      setData(result);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);

      const message =
        err.response?.data?.message ||
        'Gagal mengambil data profile. Silakan coba lagi.';

      if (Array.isArray(message)) {
        setError(message.join(', '));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    data,
    loading,
    error,
    refetch: fetchUser,
  };
};
