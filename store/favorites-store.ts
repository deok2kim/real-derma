import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Clinic } from '@/types';

interface FavoritesState {
  favorites: Clinic[];
  addFavorite: (clinic: Clinic) => void;
  removeFavorite: (clinicId: string) => void;
  isFavorite: (clinicId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (clinic) =>
        set((state) => {
          if (state.favorites.some((f) => f.id === clinic.id)) return state;
          return { favorites: [...state.favorites, clinic] };
        }),
      removeFavorite: (clinicId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== clinicId),
        })),
      isFavorite: (clinicId) => get().favorites.some((f) => f.id === clinicId),
    }),
    { name: 'real-derma-favorites' }
  )
);
