// features/auth/services/auth.service.ts

import { api } from '../../lib/api';

interface SignInPayload {
  email: string;
  password: string;
}

export async function signIn(payload: SignInPayload) {
  const response = await api.post('/auth/login', payload);

  return response.data;
}

export const signOut = async (): Promise<void> => {
  await api.post('/auth/sign-out');
};
