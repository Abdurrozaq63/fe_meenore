import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  addSessionToTag,
  getAvailableSessions,
  getSessionsByTag,
  removeSessionFromTag,
} from '../services/tag-sessions.service';

import type { SessionRecord } from '../../sessions/types/get-sessions-list.type';

export const useTagSessions = (tagId: string | null) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  const [availableSessions, setAvailableSessions] = useState<SessionRecord[]>(
    [],
  );

  const [loading, setLoading] = useState(false);

  const [mutationLoading, setMutationLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!tagId) {
      setSessions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getSessionsByTag(tagId);

      setSessions(response.data);
    } catch (err: any) {
      console.error('Failed to fetch tag sessions:', err);

      const message =
        err.response?.data?.message || 'Gagal mengambil sessions dalam tag.';

      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  }, [tagId]);

  const fetchAvailableSessions = useCallback(async () => {
    try {
      const response = await getAvailableSessions();

      if (!tagId) {
        setAvailableSessions(response.data);
        return;
      }

      setAvailableSessions(
        response.data.filter((session) => session.tagId !== tagId),
      );
    } catch (err) {
      console.error('Failed to fetch available sessions:', err);
    }
  }, [tagId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    fetchAvailableSessions();
  }, [fetchAvailableSessions]);

  const addSession = async (sessionId: string): Promise<boolean> => {
    if (!tagId) return false;

    try {
      setMutationLoading(true);
      setError(null);

      await addSessionToTag(sessionId, tagId);

      await Promise.all([fetchSessions(), fetchAvailableSessions()]);

      return true;
    } catch (err: any) {
      console.error('Failed to add session to tag:', err);

      const message =
        err.response?.data?.message || 'Gagal menambahkan session ke tag.';

      setError(Array.isArray(message) ? message.join(', ') : message);

      return false;
    } finally {
      setMutationLoading(false);
    }
  };

  const removeSession = async (sessionId: string): Promise<boolean> => {
    try {
      setMutationLoading(true);
      setError(null);

      await removeSessionFromTag(sessionId);

      await Promise.all([fetchSessions(), fetchAvailableSessions()]);

      return true;
    } catch (err: any) {
      console.error('Failed to remove session from tag:', err);

      const message =
        err.response?.data?.message || 'Gagal menghapus session dari tag.';

      setError(Array.isArray(message) ? message.join(', ') : message);

      return false;
    } finally {
      setMutationLoading(false);
    }
  };

  const available = useMemo(() => availableSessions, [availableSessions]);

  return {
    sessions,
    availableSessions: available,
    loading,
    mutationLoading,
    error,
    addSession,
    removeSession,
    refetch: fetchSessions,
    clearError: () => setError(null),
  };
};
