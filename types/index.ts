export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  latitude: number;
  longitude: number;
  is_real_derma: boolean;
  has_insurance: boolean;
  specialties: string[];
  naver_place_id: string | null;
  kakao_place_id: string | null;
  website_url: string | null;
  thumbnail_url: string | null;
  operating_hours: Record<string, string> | null;
  review_count: number;
  average_rating: number;
  insurance_ratio: number;
  real_derma_score: number;
  data_source: 'crawl' | 'manual' | 'submission';
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  clinic_id: string;
  report_type: 'wrong_info' | 'closed' | 'not_real_derma' | 'cosmetic_only' | 'other';
  description: string | null;
  contact: string | null;
  ip_hash: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface Submission {
  id: string;
  clinic_name: string;
  address: string;
  phone: string | null;
  reason: string | null;
  contact: string | null;
  ip_hash: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface ClinicsQuery {
  bounds?: string;
  realOnly?: string;
  specialty?: string;
  page?: string;
  limit?: string;
}

export interface NearbyQuery {
  lat: string;
  lng: string;
  radius?: string;
}
