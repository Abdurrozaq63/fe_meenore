import { useState } from 'react';
import { type SignInPayload } from '../types/sign-in.type';
import { signIn } from '../services/auth.service';

export const useSignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (payload: SignInPayload) => {
    setLoading(true);
    setError(null);

    try {
      // NestJS biasanya mengembalikan object seperti { accessToken: 'xyz...' }
      const response = await signIn(payload);

      return response.data;
    } catch (err: any) {
      // Menangkap pesan error dari NestJS (misal: "Unauthorized" atau "Wrong password")
      const errorMessage =
        err.response?.data?.message ||
        'Login gagal. Periksa kembali email dan password Anda.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};
