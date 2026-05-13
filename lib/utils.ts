import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

export async function hashIP(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    throw new Error('IP_HASH_SALT environment variable is required');
  }
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(salt),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function getScoreBadge(score: number): { label: string; color: string } {
  if (score >= 0.7) return { label: '인증됨', color: 'bg-green-100 text-green-800' };
  if (score >= 0.5) return { label: '가능성 높음', color: 'bg-yellow-100 text-yellow-800' };
  return { label: '미확인', color: 'bg-gray-100 text-gray-600' };
}
