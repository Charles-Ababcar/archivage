import { baseApi } from "./baseApi";
import { Transaction } from "../types";

export interface PaginatedTransactions {
  total: number;
  results: Transaction[];
}
export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => "/transactions/stats/summary",
      providesTags: ["Transaction"],
    }),
    getMonthlyFlow: builder.query<any, void>({
      query: () => "/transactions/stats/monthly-flow",
    }),
    getBankDistribution: builder.query<any[], void>({
      query: () => "/transactions/stats/bank-distribution",
      providesTags: ["Transaction"],
    }),
    // Récupérer les transactions avec filtres optionnels
   // 2. MISE À JOUR : On utilise PaginatedTransactions au lieu de Transaction[]
    getTransactions: builder.query<
      PaginatedTransactions, 
      { 
        min_m?: number; 
        max_m?: number; 
        start_date?: string; 
        end_date?: string; 
        page?: number; 
        size?: number 
      }
    >({
      query: (params) => ({
        url: "/transactions/",
        // On fusionne les filtres de montant et de date avec la pagination
        params: { 
          ...params, 
          page: params.page ?? 1, 
          size: params.size ?? 20 
        },
      }),
      providesTags: ["Transaction"],
    }),

    // Ajouter une transaction (Utilise FormData pour le PDF)
    addTransaction: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/transactions/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Transaction"],
    }),

    addLeveling: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/transactions/leveling",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Transaction"],
    }),

    // Supprimer une transaction
    deleteTransaction: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useGetDashboardStatsQuery,
  useGetMonthlyFlowQuery,
  useGetBankDistributionQuery,
  useAddLevelingMutation,
} = transactionApi;
