'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ClinicCard } from '@/components/clinic/clinic-card';
import { AdBanner } from '@/components/ad-banner';
import type { Clinic } from '@/types';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    fetch(`/api/clinics/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setClinics(data))
      .catch(() => setClinics([]))
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">
        &quot;{query}&quot; 검색 결과
      </h1>
      <p className="text-gray-500 mb-6">
        {isLoading ? '검색 중...' : `${clinics.length}개의 결과`}
      </p>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">검색 결과가 없습니다</p>
          <p className="mt-2">다른 검색어로 시도해보세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clinics.map((clinic, index) => (
            <div key={clinic.id}>
              <ClinicCard clinic={clinic} />
              {index === 2 && (
                <AdBanner slot="search-mid" className="my-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <Suspense fallback={<div className="animate-pulse h-8 bg-gray-100 rounded w-64" />}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
