import { useCallback, useEffect, useState } from 'react';

import { getCurrentUser } from '../services/users.service';

import type { User } from '../types/user.type';

export const useGetCurrentUser = () => {
  const [data, setData] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCurrentUser();

      setData(result);
    } catch (err: any) {
      console.error('Failed to fetch current user:', err);

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
  }, []);

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
