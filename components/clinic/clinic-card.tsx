import { MapPin, Phone, Star, Heart } from 'lucide-react';
import { RealDermaBadge } from './real-derma-badge';
import { cn, formatRating } from '@/lib/utils';
import { useFavoritesStore } from '@/store/favorites-store';
import type { Clinic } from '@/types';

interface ClinicCardProps {
  clinic: Clinic;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ClinicCard({ clinic, isSelected = false, onClick }: ClinicCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const saved = isFavorite(clinic.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) removeFavorite(clinic.id);
    else addFavorite(clinic);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:bg-blue-50 dark:focus:bg-gray-800',
        isSelected && 'bg-blue-50 dark:bg-gray-800 border-l-4 border-l-blue-600'
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-1 flex-1">
          {clinic.name}
        </h3>
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="flex-shrink-0 p-1 -m-1 hover:scale-110 transition-transform"
          title={saved ? '저장 취소' : '저장'}
        >
          <Heart size={16} className={saved ? 'text-red-500 fill-red-500' : 'text-gray-300'} />
        </button>
        <RealDermaBadge score={clinic.real_derma_score} size="sm" className="flex-shrink-0" />
      </div>

      {/* Address */}
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
        <MapPin size={12} className="flex-shrink-0" />
        <span className="line-clamp-1">{clinic.address}</span>
      </div>

      {/* Phone */}
      {clinic.phone && (
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
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
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full"
            >
              {s}
            </span>
          ))}
          {clinic.specialties.length > 4 && (
            <span className="text-xs text-gray-400">+{clinic.specialties.length - 4}</span>
          )}
        </div>
      )}

      {/* Highlight tags */}
      {clinic.highlight_tags && clinic.highlight_tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {clinic.highlight_tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[11px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
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
