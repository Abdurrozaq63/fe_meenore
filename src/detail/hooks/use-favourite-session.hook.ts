import { useState } from 'react';
import { updateFavouriteSession } from '../services/detail.service';

export const useFavouriteSession = () => {
  const [loadingFavourite, setLoading] = useState(false);

  const [errorFavourite, setError] = useState<string | null>(null);

  const updateFavourite = async (
    sessionId: string,
    favourite: boolean,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await updateFavouriteSession(sessionId, favourite);

      return true;
    } catch (err: any) {
      console.error('Failed to Update Favourite Session', err);

      const message =
        err.response?.data?.message ||
        'Failed to Update Favourite. Please, Try again.';

      if (Array.isArray(message)) {
        setError(message.join(', '));
      } else {
        setError(message);
      }

      return false;
    } finally {
      setLoading(false);
    }
  };
  const clearErrorFavourite = () => {
    setError(null);
  };
  return {
    updateFavourite,
    loadingFavourite,
    errorFavourite,
    clearErrorFavourite,
  };
};
