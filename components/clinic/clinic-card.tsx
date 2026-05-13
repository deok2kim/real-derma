import { MapPin, Phone, Star } from 'lucide-react';
import { RealDermaBadge } from './real-derma-badge';
import { cn, formatRating } from '@/lib/utils';
import type { Clinic } from '@/types';

interface ClinicCardProps {
  clinic: Clinic;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ClinicCard({ clinic, isSelected = false, onClick }: ClinicCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-blue-50 transition-colors focus:outline-none focus:bg-blue-50',
        isSelected && 'bg-blue-50 border-l-4 border-l-blue-600'
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">
          {clinic.name}
        </h3>
        <RealDermaBadge score={clinic.real_derma_score} size="sm" className="flex-shrink-0" />
      </div>

      {/* Address */}
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
        <MapPin size={12} className="flex-shrink-0" />
        <span className="line-clamp-1">{clinic.address}</span>
      </div>

      {/* Phone */}
      {clinic.phone && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Phone size={12} className="flex-shrink-0" />
          <span>{clinic.phone}</span>
        </div>
      )}

      {/* Specialties */}
      {clinic.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {clinic.specialties.slice(0, 4).map((s) => (
            <span
              key={s}
              className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full"
            >
              {s}
            </span>
          ))}
          {clinic.specialties.length > 4 && (
            <span className="text-xs text-gray-400">+{clinic.specialties.length - 4}</span>
          )}
        </div>
      )}

      {/* Rating */}
      {clinic.average_rating > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
          <span>{formatRating(clinic.average_rating)}</span>
          {clinic.review_count > 0 && (
            <span className="text-gray-400">({clinic.review_count})</span>
          )}
        </div>
      )}
    </button>
  );
}
