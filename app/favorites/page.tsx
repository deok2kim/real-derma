'use client';

import Link from 'next/link';
import { Heart, Trash2, MapPin, Star } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { RealDermaBadge } from '@/components/clinic/real-derma-badge';
import { useFavoritesStore } from '@/store/favorites-store';
import { formatRating } from '@/lib/utils';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoritesStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Heart size={24} className="text-red-500 fill-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">저장한 피부과</h1>
          {favorites.length > 0 && (
            <span className="text-sm text-gray-500 ml-1">({favorites.length})</span>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-700 font-medium mb-1">저장한 피부과가 없습니다</p>
            <p className="text-sm text-gray-500 mb-6">
              마음에 드는 피부과를 하트 버튼으로 저장해보세요.
            </p>
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              피부과 찾으러 가기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favorites.map((clinic) => (
              <div
                key={clinic.id}
                className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link
                      href={`/clinic/${clinic.id}`}
                      className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {clinic.name}
                    </Link>
                    <RealDermaBadge score={clinic.real_derma_score} size="sm" className="flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <MapPin size={13} className="flex-shrink-0" />
                    <span className="line-clamp-1">{clinic.address}</span>
                  </div>
                  {clinic.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {clinic.specialties.slice(0, 5).map((s) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {clinic.average_rating > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span>{formatRating(clinic.average_rating)}</span>
                      {clinic.review_count > 0 && <span>({clinic.review_count})</span>}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFavorite(clinic.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="저장 취소"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
