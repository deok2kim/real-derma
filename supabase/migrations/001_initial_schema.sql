-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Clinics table
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_real_derma BOOLEAN NOT NULL DEFAULT false,
  has_insurance BOOLEAN NOT NULL DEFAULT false,
  specialties TEXT[] DEFAULT '{}',
  naver_place_id TEXT UNIQUE,
  kakao_place_id TEXT UNIQUE,
  website_url TEXT,
  thumbnail_url TEXT,
  operating_hours JSONB,
  review_count INTEGER DEFAULT 0,
  average_rating NUMERIC(2,1) DEFAULT 0.0,
  insurance_ratio NUMERIC(3,2) DEFAULT 0.0,
  real_derma_score NUMERIC(3,2) DEFAULT 0.0,
  data_source TEXT NOT NULL DEFAULT 'crawl',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clinics_location ON clinics USING GIST (location);
CREATE INDEX idx_clinics_is_real ON clinics (is_real_derma) WHERE is_real_derma = true;
CREATE INDEX idx_clinics_name_trgm ON clinics USING GIN (name gin_trgm_ops);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('wrong_info', 'closed', 'not_real_derma', 'cosmetic_only', 'other')),
  description TEXT,
  contact TEXT,
  ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_clinic ON reports (clinic_id);
CREATE INDEX idx_reports_status ON reports (status);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  reason TEXT,
  contact TEXT,
  ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row Level Security
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read clinics" ON clinics FOR SELECT USING (true);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert reports" ON reports FOR INSERT WITH CHECK (true);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert submissions" ON submissions FOR INSERT WITH CHECK (true);
