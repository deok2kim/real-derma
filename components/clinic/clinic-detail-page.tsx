'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ExternalLink, Flag } from 'lucide-react';
import { RealDermaBadge } from './real-derma-badge';
import { ReportDialog } from '@/components/forms/report-dialog';
import type { Clinic } from '@/types';

interface Props {
  clinic: Clinic;
}

export function ClinicDetailPage({ clinic }: Props) {
  const [showReport, setShowReport] = useState(false);

  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(clinic.name)},${clinic.latitude},${clinic.longitude}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(clinic.name)}`;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{clinic.name}</h1>
            <RealDermaBadge score={clinic.real_derma_score} size="lg" />
          </div>
          {clinic.has_insurance && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded">
              건강보험 진료
            </span>
          )}
        </div>
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <Flag className="w-4 h-4" />
          신고
        </button>
      </div>

      {/* Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
          <span className="text-gray-700">{clinic.address}</span>
        </div>
        {clinic.phone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400 shrink-0" />
            <a href={`tel:${clinic.phone}`} className="text-blue-600 hover:underline">
              {clinic.phone}
            </a>
          </div>
        )}
        {clinic.operating_hours && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-700">
              {Object.entries(clinic.operating_hours).map(([day, hours]) => (
                <div key={day} className="flex gap-4">
                  <span className="w-8 font-medium">{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Specialties */}
      {clinic.specialties.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">진료 분야</h2>
          <div className="flex flex-wrap gap-2">
            {clinic.specialties.map((s) => (
              <span
                key={s}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Score breakdown */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">리얼더마 점수</h2>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-blue-600">
            {(clinic.real_derma_score * 100).toFixed(0)}
            <span className="text-lg text-gray-400">점</span>
          </div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${clinic.real_derma_score * 100}%` }}
              />
            </div>
          </div>
        </div>
        {clinic.review_count > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            리뷰 {clinic.review_count}개 · 평점 {clinic.average_rating}
          </p>
        )}
      </div>

      {/* External links */}
      <div className="flex gap-3 mb-6">
        <a
          href={kakaoMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          카카오맵에서 보기
        </a>
        <a
          href={naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          네이버지도에서 보기
        </a>
      </div>

      {/* Back */}
      <Link
        href="/"
        className="inline-block text-sm text-blue-600 hover:underline"
      >
        ← 지도로 돌아가기
      </Link>

      {/* Report dialog */}
      {showReport && (
        <ReportDialog
          clinicId={clinic.id}
          clinicName={clinic.name}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
