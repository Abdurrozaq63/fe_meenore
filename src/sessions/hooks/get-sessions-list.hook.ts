import { useEffect, useState } from 'react';
import type {
  SessionRecord,
  GetSessionsList,
} from '../types/get-sessions-list.type';
import { api } from '../../lib/api';

export const useSessions = () => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get<GetSessionsList>('/sessions');

        setSessions(response.data.data);
      } catch (err: any) {
        console.error('Failed to fetch sessions:', err);
        const errMsg =
          err.response?.data?.message || 'Gagal memuat daftar sesi.';
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);
  return { sessions, loading, error };
};
