import { api } from '../../lib/api';

import type {
  UpdatePasswordPayload,
  UpdateUserPayload,
  UpdateUserResponse,
  User,
} from '../types/user.type';

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');

  return response.data;
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload,
): Promise<UpdateUserResponse> => {
  const response = await api.patch<UpdateUserResponse>(
    `/users/${userId}`,
    payload,
  );

  return response.data;
};

export const updatePassword = async (
  userId: string,
  payload: UpdatePasswordPayload,
): Promise<void> => {
  await api.patch(`/users/${userId}/password`, payload);
};
