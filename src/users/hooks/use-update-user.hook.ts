import { useState } from 'react';

import { updateUser } from '../services/users.service';

import type { UpdateUserPayload, UpdateUserResponse } from '../types/user.type';

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const update = async (
    userId: string,
    payload: UpdateUserPayload,
  ): Promise<UpdateUserResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await updateUser(userId, payload);

      return response;
    } catch (err: any) {
      console.error('Failed to update user:', err);

      const message =
        err.response?.data?.message ||
        'Gagal memperbarui profile. Silakan coba lagi.';

      if (Array.isArray(message)) {
        setError(message.join(', '));
      } else {
        setError(message);
      }

      return null;
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
