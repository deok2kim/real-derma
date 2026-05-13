import { getScoreBadge } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RealDermaBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RealDermaBadge({ score, size = 'sm', className }: RealDermaBadgeProps) {
  const { label, color } = getScoreBadge(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        color,
        sizeClasses[size],
        className
      )}
    >
      {label}
    </span>
  );
}
