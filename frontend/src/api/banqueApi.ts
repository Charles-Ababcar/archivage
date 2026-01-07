import { baseApi } from './baseApi';
import { Banque } from '../types';

export const banqueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Récupérer toutes les banques
    getBanques: builder.query<Banque[], void>({
      query: () => '/banques/',
      providesTags: ['Banque'],
    }),
    
    // Créer une banque
    addBanque: builder.mutation<Banque, Partial<Banque>>({
      query: (newBanque) => ({
        url: '/banques/',
        method: 'POST',
        body: newBanque,
      }),
      invalidatesTags: ['Banque'], // Force le rafraîchissement de la liste
    }),
  }),
});

export const { useGetBanquesQuery, useAddBanqueMutation } = banqueApi;