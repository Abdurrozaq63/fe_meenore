import { useState } from 'react';

import { updateSession } from '../services/record.service';

import type {
  UpdateSessionPayload,
  UpdateSessionResponse,
} from '../types/update-session.type';

export const useUpdateSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    sessionId: string,
    payload: UpdateSessionPayload,
  ): Promise<UpdateSessionResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await updateSession(sessionId, payload);

      return response;
    } catch (err: any) {
      console.error('Failed to update session:', err);

      const message =
        err.response?.data?.message ||
        'Gagal memperbarui session. Silakan coba lagi.';

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
