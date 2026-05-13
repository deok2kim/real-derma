'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin, Phone, ExternalLink, Flag, Star } from 'lucide-react';
import { useMapStore } from '@/store/map-store';
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
  const [reportOpen, setReportOpen] = useState(false);

  if (!selectedClinic) return null;

  const clinic = selectedClinic;

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
      <div className="flex flex-col h-full overflow-y-auto bg-white">
        {/* Back button */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2 z-10">
          <button
            onClick={() => setSelectedClinic(null)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>목록으로</span>
          </button>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">{clinic.name}</h2>
              <RealDermaBadge score={clinic.real_derma_score} size="lg" className="flex-shrink-0" />
            </div>

            {/* Rating */}
            {clinic.average_rating > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
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
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin size={15} className="flex-shrink-0 text-gray-400 mt-0.5" />
              <span>{clinic.address}</span>
            </div>
            {clinic.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone size={15} className="flex-shrink-0 text-gray-400" />
                <a
                  href={`tel:${clinic.phone.replace(/\s/g, '')}`}
                  className="text-blue-600 hover:underline"
                >
                  {clinic.phone}
                </a>
              </div>
            )}
          </div>

          {/* Specialties */}
          {clinic.specialties.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">진료 분야</h3>
              <div className="flex flex-wrap gap-1.5">
                {clinic.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
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
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">진료 시간</h3>
              <div className="rounded-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {hourEntries.map(([day, time], idx) => (
                      <tr
                        key={day}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-3 py-2 font-medium text-gray-600 w-10">
                          {DAY_LABELS[day] ?? day}
                        </td>
                        <td className="px-3 py-2 text-gray-700">{time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Map links */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">지도에서 보기</h3>
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

          {/* Score details */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              리얼더마 점수
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.round(clinic.real_derma_score * 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700">
                {Math.round(clinic.real_derma_score * 100)}점
              </span>
            </div>
            {clinic.has_insurance && (
              <p className="text-xs text-green-700 mt-2">✓ 건강보험 진료 확인됨</p>
            )}
          </div>

          {/* Report button */}
          <button
            onClick={() => setReportOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg transition-colors"
          >
            <Flag size={14} />
            정보 오류 신고
          </button>
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
