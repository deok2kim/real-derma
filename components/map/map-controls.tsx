'use client';

import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { useMapStore } from '@/store/map-store';
import { cn } from '@/lib/utils';

export { MapControls };
export default function MapControls() {
  const { setCenter, setMyLocation } = useMapStore();
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocError('위치 정보를 지원하지 않는 브라우저입니다.');
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(loc);
        setMyLocation(loc);
        setLocating(false);
      },
      () => {
        setLocError('위치를 가져올 수 없습니다.');
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="absolute bottom-6 right-4 z-10 flex flex-col items-end gap-2">
      {locError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg shadow-md max-w-[180px]">
          {locError}
        </div>
      )}
      <button
        onClick={handleCurrentLocation}
        disabled={locating}
        className={cn(
          'w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors border',
          locating
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600'
        )}
        title="현재 위치"
      >
        <Crosshair size={20} className={locating ? 'animate-pulse' : ''} />
      </button>
    </div>
  );
}
