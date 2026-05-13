import { create } from 'zustand';
import type { Clinic, MapBounds } from '@/types';

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  bounds: MapBounds | null;
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  realOnly: boolean;
  selectedSpecialty: string | null;
  searchQuery: string;
  isLoading: boolean;

  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds) => void;
  setClinics: (clinics: Clinic[]) => void;
  setSelectedClinic: (clinic: Clinic | null) => void;
  setRealOnly: (realOnly: boolean) => void;
  setSelectedSpecialty: (specialty: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: 37.5665, lng: 126.978 },
  zoom: 12,
  bounds: null,
  clinics: [],
  selectedClinic: null,
  realOnly: true,
  selectedSpecialty: null,
  searchQuery: '',
  isLoading: false,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  setClinics: (clinics) => set({ clinics }),
  setSelectedClinic: (clinic) => set({ selectedClinic: clinic }),
  setRealOnly: (realOnly) => set({ realOnly }),
  setSelectedSpecialty: (specialty) => set({ selectedSpecialty: specialty }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
