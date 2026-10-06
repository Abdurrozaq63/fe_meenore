import { useState } from 'react';
import axios from 'axios';
import { type SignUpPayload, type SignUpResponse } from '../types/sign-up.type';

export const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const registerUser = async (payload: SignUpPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // fetch api create user
      console.log('payload', payload);
      const response = await axios.post<SignUpResponse>(
        'http://localhost:3000/users',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setSuccess(true);
      return response.data;
    } catch (err: any) {
      // Menangkap pesan error dari Axios atau pesan default jika server mati
      const errorMessage =
        err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.';
      setError(errorMessage);
      throw err; // Lempar kembali error jika ingin ditangani di komponen UI
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
};
