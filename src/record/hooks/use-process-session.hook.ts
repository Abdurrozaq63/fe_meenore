import { useState } from 'react';

import { getSessionDetail, processSession } from '../services/record.service';

import type { ProcessSessionPayload } from '../types/process-session.type';

import type { GetSessionDetailResponse } from '../types/get-session-detail.type';

export const useProcessSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const process = async (
    payload: ProcessSessionPayload,
  ): Promise<GetSessionDetailResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const processedSession = await processSession(payload);

      const sessionDetail = await getSessionDetail(processedSession.id);
      console.log('sessionhook', sessionDetail);

      return sessionDetail;
    } catch (err: any) {
      console.error('Failed to process session:', err);

      const message =
        err.response?.data?.message ||
        'Gagal memproses audio. Silakan coba lagi.';

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
    process,
    loading,
    error,
    clearError,
  };
};
