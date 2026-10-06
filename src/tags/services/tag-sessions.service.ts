import { api } from '../../lib/api';

import type { GetSessionsList } from '../../sessions/types/get-sessions-list.type';

export const getSessionsByTag = async (
  tagId: string,
): Promise<GetSessionsList> => {
  const response = await api.get<GetSessionsList>('/sessions', {
    params: {
      tagId,
    },
  });

  return response.data;
};

export const getAvailableSessions = async (): Promise<GetSessionsList> => {
  const response = await api.get<GetSessionsList>('/sessions', {
    params: {
      limit: 100,
    },
  });

  return response.data;
};

export const addSessionToTag = async (sessionId: string, tagId: string) => {
  const response = await api.patch(`/sessions/${sessionId}`, {
    tagId,
  });

  return response.data;
};

export const removeSessionFromTag = async (sessionId: string) => {
  const response = await api.patch(`/sessions/${sessionId}`, {
    tagId: null,
  });

  return response.data;
};
