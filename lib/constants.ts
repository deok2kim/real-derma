export const SITE_NAME = '리얼더마';
export const SITE_DESCRIPTION = '건강보험 진료 데이터 기반으로 검증된 진짜 피부과를 찾아보세요.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://realderma.kr';

export const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }; // Seoul
export const DEFAULT_ZOOM = 12;

export const SPECIALTIES = [
  '아토피',
  '건선',
  '여드름',
  '습진',
  '피부암',
  '대상포진',
  '사마귀',
  '무좀',
  '두드러기',
  '탈모',
] as const;

export const REPORT_TYPES = {
  wrong_info: '잘못된 정보',
  closed: '폐업',
  not_real_derma: '진짜 피부과 아님',
  cosmetic_only: '미용 전문',
  other: '기타',
} as const;

export const RATE_LIMIT = {
  reports: { max: 5, windowHours: 1 },
  submissions: { max: 3, windowHours: 1 },
} as const;
