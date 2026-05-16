'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin, Phone, ExternalLink, Flag, Star, Heart } from 'lucide-react';
import { useMapStore } from '@/store/map-store';
import { useFavoritesStore } from '@/store/favorites-store';
import { RealDermaBadge } from './real-derma-badge';
import { ReportDialog } from '@/components/forms/report-dialog';
import { formatRating } from '@/lib/utils';

const DAY_LABELS: Record<string, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
};

export { ClinicDetail };
export default function ClinicDetail() {
  const { selectedClinic, setSelectedClinic } = useMapStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [reportOpen, setReportOpen] = useState(false);

  if (!selectedClinic) return null;

  const clinic = selectedClinic;
  const saved = isFavorite(clinic.id);

  const kakaoMapUrl = clinic.kakao_place_id
    ? `https://place.map.kakao.com/${clinic.kakao_place_id}`
    : `https://map.kakao.com/link/search/${encodeURIComponent(clinic.name)}`;

  const naverMapUrl = clinic.naver_place_id
    ? `https://m.place.naver.com/place/${clinic.naver_place_id}`
    : `https://map.naver.com/v5/search/${encodeURIComponent(clinic.name)}`;

  const hours = clinic.operating_hours;
  const hourEntries = hours
    ? Object.entries(hours).sort(([a], [b]) => {
        const order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return order.indexOf(a) - order.indexOf(b);
      })
    : [];

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto bg-white dark:bg-gray-900">
        {/* Back button */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-2 z-10">
          <button
            onClick={() => setSelectedClinic(null)}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>목록으로</span>
          </button>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{clinic.name}</h2>
              <RealDermaBadge score={clinic.real_derma_score} size="lg" className="flex-shrink-0" />
            </div>

            {/* Rating */}
            {clinic.average_rating > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{formatRating(clinic.average_rating)}</span>
                {clinic.review_count > 0 && (
                  <span className="text-gray-400 text-xs">({clinic.review_count}개 리뷰)</span>
                )}
              </div>
            )}
          </div>

          {/* Address & Phone */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <MapPin size={15} className="flex-shrink-0 text-gray-400 mt-0.5" />
              <span>{clinic.address}</span>
            </div>
            {clinic.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Phone size={15} className="flex-shrink-0 text-gray-400" />
                <a
                  href={`tel:${clinic.phone.replace(/\s/g, '')}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {clinic.phone}
                </a>
              </div>
            )}
          </div>

          {/* Specialties */}
          {clinic.specialties.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">진료 분야</h3>
              <div className="flex flex-wrap gap-1.5">
                {clinic.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Operating hours */}
          {hourEntries.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">진료 시간</h3>
              <div className="rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {hourEntries.map(([day, time], idx) => (
                      <tr
                        key={day}
                        className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                      >
                        <td className="px-3 py-2 font-medium text-gray-600 dark:text-gray-400 w-10">
                          {DAY_LABELS[day] ?? day}
                        </td>
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Map links */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">지도에서 보기</h3>
            <div className="flex gap-2">
              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg transition-colors"
              >
                <ExternalLink size={13} />
                카카오맵
              </a>
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <ExternalLink size={13} />
                네이버지도
              </a>
            </div>
          </div>

          {/* Highlight tags */}
          {clinic.highlight_tags && clinic.highlight_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {clinic.highlight_tags.map((tag) => (
                <span key={tag} className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-2.5 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Treatment focus ratio */}
          {clinic.insurance_ratio > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">치료 중심도</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.round(clinic.insurance_ratio * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-green-700 dark:text-green-400">
                  {Math.round(clinic.insurance_ratio * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">건강보험 진료 비율 기반</p>
            </div>
          )}

          {/* AI Review Summary */}
          {clinic.review_summary && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">AI</span>
                </div>
                <h3 className="text-xs font-semibold text-blue-800 dark:text-blue-300">AI 분석 요약</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{clinic.review_summary}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">리뷰 데이터를 기반으로 AI가 생성한 요약입니다.</p>
            </div>
          )}

          {/* Sample review */}
          {clinic.sample_review && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
              <h3 className="text-xs font-semibold text-yellow-800 dark:text-yellow-400 mb-2">실제 후기</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                &ldquo;{clinic.sample_review}&rdquo;
              </p>
            </div>
          )}

          {/* Score details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              리얼더마 점수
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.round(clinic.real_derma_score * 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {Math.round(clinic.real_derma_score * 100)}점
              </span>
            </div>
            {clinic.has_insurance && (
              <p className="text-xs text-green-700 dark:text-green-400 mt-2">✓ 건강보험 진료 확인됨</p>
            )}
          </div>

          {/* Save & Report buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => saved ? removeFavorite(clinic.id) : addFavorite(clinic)}
              className={`flex items-center justify-center gap-2 flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                saved
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40'
              }`}
            >
              <Heart size={14} className={saved ? 'fill-red-500' : ''} />
              {saved ? '저장됨' : '저장'}
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 rounded-lg transition-colors"
            >
              <Flag size={14} />
              정보 오류 신고
            </button>
          </div>
        </div>
      </div>

      {reportOpen && (
        <ReportDialog
          clinicId={clinic.id}
          clinicName={clinic.name}
          onClose={() => setReportOpen(false)}
        />
      )}
    </>
  );
}
