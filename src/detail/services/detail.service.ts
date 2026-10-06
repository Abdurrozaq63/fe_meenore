import { api } from '../../lib/api';

import type { GetSessionDetailResponse } from '../types/get-session-detail.type';

export const getSessionDetail = async (
  sessionId: string,
): Promise<GetSessionDetailResponse> => {
  const response = await api.get<GetSessionDetailResponse>(
    `/sessions/${sessionId}`,
  );

  return response.data;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await api.delete(`/sessions/${sessionId}`);
};

export const updateFavouriteSession = async (
  sessionId: string,
  favourite: boolean,
): Promise<void> => {
  await api.patch(`/sessions/${sessionId}/favourite`, { favourite });
};
