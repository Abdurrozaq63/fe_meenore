import { useState } from 'react';

import { signOut } from '../services/auth.service';

export const useSignOut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logout = async () => {
    try {
      setLoading(true);
      setError('');

      await signOut();
    } catch (err: any) {
      console.error('Sign out failed:', err);

      const message = err?.response?.data?.message || 'Failed to sign out.';

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  return {
    logout,
    loading,
    error,
    clearError,
  };
};
