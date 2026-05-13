'use client';

import { useState } from 'react';
import { MapPin, Filter, ChevronDown } from 'lucide-react';
import { useMapStore } from '@/store/map-store';
import { cn } from '@/lib/utils';
import { SPECIALTIES } from '@/lib/constants';

export { MapControls };
export default function MapControls() {
  const { realOnly, setRealOnly, setCenter, selectedSpecialty, setSelectedSpecialty } = useMapStore();
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
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
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
    <div className="flex flex-col gap-2">
      {/* Current location */}
      <button
        onClick={handleCurrentLocation}
        disabled={locating}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-md transition-colors',
          locating
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
        )}
        title="현재 위치"
      >
        <MapPin size={16} className={locating ? 'animate-pulse' : ''} />
        <span className="hidden sm:inline">현재 위치</span>
      </button>

      {/* Real derma only toggle */}
      <button
        onClick={() => setRealOnly(!realOnly)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-md transition-colors',
          realOnly
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700'
        )}
        title="진짜 피부과만 보기"
      >
        <Filter size={16} />
        <span className="hidden sm:inline">진짜 피부과만</span>
      </button>

      {/* Specialty filter */}
      <div className="relative">
        <select
          value={selectedSpecialty || ''}
          onChange={(e) => setSelectedSpecialty(e.target.value || null)}
          className="appearance-none bg-white text-gray-700 text-sm font-medium pl-3 pr-8 py-2 rounded-lg shadow-md cursor-pointer hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">전체 분야</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Location error */}
      {locError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg shadow-md max-w-[180px]">
          {locError}
        </div>
      )}
    </div>
  );
}
