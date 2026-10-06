import { api } from '../../lib/api';

import type {
  ProcessSessionPayload,
  ProcessSessionResponse,
} from '../types/process-session.type';

import type { GetSessionDetailResponse } from '../types/get-session-detail.type';
import type {
  UpdateSessionPayload,
  UpdateSessionResponse,
} from '../types/update-session.type';

export const processSession = async (
  payload: ProcessSessionPayload,
): Promise<ProcessSessionResponse> => {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('tagId', payload.tagId);
  formData.append('audioDurationSeconds', String(payload.audioDurationSeconds));
  formData.append('audio', payload.audio);

  const response = await api.post<ProcessSessionResponse>(
    '/sessions/process',
    formData,
  );

  return response.data;
};

export const getSessionDetail = async (
  sessionId: string,
): Promise<GetSessionDetailResponse> => {
  const response = await api.get<GetSessionDetailResponse>(
    `/sessions/${sessionId}`,
  );

  return response.data;
};
export const updateSession = async (
  sessionId: string,
  payload: UpdateSessionPayload,
): Promise<UpdateSessionResponse> => {
  const response = await api.patch<UpdateSessionResponse>(
    `/sessions/${sessionId}`,
    payload,
  );

  return response.data;
};
