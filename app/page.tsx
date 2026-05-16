'use client';

import { useEffect, useCallback, useRef } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MapContainer from '@/components/map/map-container';
import MapControls from '@/components/map/map-controls';
import ClinicList from '@/components/clinic/clinic-list';
import ClinicDetail from '@/components/clinic/clinic-detail';
import { AdBanner } from '@/components/ad-banner';
import { useMapStore } from '@/store/map-store';

export default function HomePage() {
  const {
    bounds,
    realOnly,
    selectedSpecialty,
    selectedClinic,
    setClinics,
    setIsLoading,
  } = useMapStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchClinics = useCallback(async () => {
    if (!bounds) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('bounds', `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`);
      if (realOnly) params.set('realOnly', 'true');
      if (selectedSpecialty) params.set('specialty', selectedSpecialty);
      params.set('limit', '100');

      const res = await fetch(`/api/clinics?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setClinics(data);
      }
    } catch (err) {
      console.error('Failed to fetch clinics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [bounds, realOnly, selectedSpecialty, setClinics, setIsLoading]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchClinics();
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchClinics]);

  return (
    <div className="h-full flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map */}
        <div className="relative flex-1 min-h-[50vh] md:min-h-0">
          <MapContainer />
          <MapControls />
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-[500px] flex flex-col border-l border-gray-200 bg-white overflow-hidden">
          {selectedClinic ? (
            <ClinicDetail />
          ) : (
            <ClinicList />
          )}
          <AdBanner slot="sidebar-bottom" className="p-4 border-t border-gray-100" />
        </aside>
      </main>
      <Footer />
    </div>
  );
}
