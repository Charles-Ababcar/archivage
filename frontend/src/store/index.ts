import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../api/baseApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    // On ajoute le reducer de l'API généré par RTK Query
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // Ajout du middleware pour le cache, l'invalidation et le polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Nécessaire pour manipuler les fichiers/FormData
    }).concat(baseApi.middleware),
});

// Optionnel : permet le refetch au focus de la fenêtre
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;