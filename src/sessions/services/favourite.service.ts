import { api } from '../../lib/api';

import type { GetFavouritesResponse } from '../types/get-favourite.type';

export const getFavourites = async (): Promise<GetFavouritesResponse> => {
  const response = await api.get<GetFavouritesResponse>('/sessions', {
    params: {
      favourite: true,
    },
  });

  return response.data;
};
