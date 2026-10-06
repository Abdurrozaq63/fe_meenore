import { useState } from 'react';

import { deleteSession } from '../services/detail.service';

export const useDeleteSession = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const remove = async (sessionId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteSession(sessionId);

      return true;
    } catch (err: any) {
      console.error('Failed to delete session:', err);

      const message =
        err.response?.data?.message ||
        'Gagal menghapus session. Silakan coba lagi.';

      if (Array.isArray(message)) {
        setError(message.join(', '));
      } else {
        setError(message);
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    remove,
    loading,
    error,
    clearError,
  };
};
