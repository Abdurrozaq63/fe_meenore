import { api } from '../../lib/api';

import type { GetSessionsList } from '../types/get-sessions-list.type';

export const getSessions = async (): Promise<GetSessionsList> => {
  const response = await api.get<GetSessionsList>('/sessions');

  return response.data;
};
