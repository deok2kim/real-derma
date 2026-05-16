'use client';

import { useMapStore } from '@/store/map-store';
import { ClinicCard } from './clinic-card';
import { AdBanner } from '@/components/ad-banner';
import { SPECIALTIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

function SkeletonCard() {
  return (
    <div className="px-4 py-4 border-b border-gray-100 animate-pulse">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded-full w-16 flex-shrink-0" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-1.5" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="flex gap-1">
        <div className="h-4 bg-gray-200 rounded-full w-10" />
        <div className="h-4 bg-gray-200 rounded-full w-12" />
        <div className="h-4 bg-gray-200 rounded-full w-8" />
      </div>
    </div>
  );
}

export { ClinicList };
export default function ClinicList() {
  const { clinics, selectedClinic, setSelectedClinic, isLoading, selectedSpecialty, setSelectedSpecialty, realOnly, setRealOnly } = useMapStore();

  const sorted = [...clinics].sort((a, b) => b.real_derma_score - a.real_derma_score);

  const filterBar = (
    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 space-y-2 flex-shrink-0">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setRealOnly(!realOnly)}
          className={cn(
            'text-xs px-2.5 py-1 rounded-full font-medium transition-colors border',
            realOnly
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
          )}
        >
          진짜 피부과만
        </button>
        {SPECIALTIES.slice(0, 8).map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSpecialty(selectedSpecialty === s ? null : s)}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium transition-colors border',
              selectedSpecialty === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        <span className="font-semibold text-gray-700">{sorted.length}</span>개의 피부과
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        {filterBar}
        <div className="overflow-y-auto flex-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col h-full">
        {filterBar}
        <div className="flex flex-col items-center justify-center flex-1 py-16 px-4 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">검색 결과가 없습니다</p>
          <p className="text-xs text-gray-500">다른 지역을 검색하거나 필터를 조정해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {filterBar}
      <div className="overflow-y-auto flex-1">
        {sorted.flatMap((clinic, idx) => {
          const items = [
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              isSelected={selectedClinic?.id === clinic.id}
              onClick={() => setSelectedClinic(clinic)}
            />,
          ];
          if ((idx + 1) % 5 === 0) {
            items.push(
              <AdBanner
                key={`ad-${idx}`}
                slot="list-inline"
                format="rectangle"
                className="px-4 py-2 bg-gray-50 border-b border-gray-100"
              />
            );
          }
          return items;
        })}
      </div>
    </div>
  );
}
