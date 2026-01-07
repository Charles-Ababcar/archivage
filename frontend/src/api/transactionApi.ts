import { baseApi } from './baseApi';
import { Transaction } from '../types';

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => '/transactions/stats/summary',
      providesTags: ['Transaction'],
    }),
    getMonthlyFlow: builder.query<any, void>({
      query: () => '/transactions/stats/monthly-flow',
    }),
    getBankDistribution: builder.query<any[], void>({
  query: () => '/transactions/stats/bank-distribution',
  providesTags: ['Transaction'],
}),
    // Récupérer les transactions avec filtres optionnels
    getTransactions: builder.query<Transaction[], { min_m?: number; max_m?: number }>({
      query: (params) => ({
        url: '/transactions/',
        params, // FastAPI recevra ?min_m=...&max_m=...
      }),
      providesTags: ['Transaction'],
    }),

    // Ajouter une transaction (Utilise FormData pour le PDF)
    addTransaction: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/transactions/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Transaction'],
    }),

    // Supprimer une transaction
    deleteTransaction: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction'],
    }),
  }),
});

export const { 
  useGetTransactionsQuery, 
  useAddTransactionMutation, 
  useDeleteTransactionMutation,
  useGetDashboardStatsQuery, 
  useGetMonthlyFlowQuery,
  useGetBankDistributionQuery
} = transactionApi;