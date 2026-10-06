import { useState } from 'react';

import { updatePassword } from '../services/users.service';

import type { UpdatePasswordPayload } from '../types/user.type';

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const update = async (
    userId: string,
    payload: UpdatePasswordPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await updatePassword(userId, payload);

      return true;
    } catch (err: any) {
      console.error('Failed to update password:', err);

      const message =
        err.response?.data?.message ||
        'Gagal memperbarui password. Silakan coba lagi.';

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
    update,
    loading,
    error,
    clearError,
  };
};
