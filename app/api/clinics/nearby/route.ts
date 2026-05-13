import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

const MAX_RADIUS = 10000;
const DEFAULT_RADIUS = 3000;

// Approximate degrees per meter at mid-latitudes
const METERS_PER_DEGREE_LAT = 111320;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  if (!latParam || !lngParam) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const lat = parseFloat(latParam);
  const lng = parseFloat(lngParam);
  const radius = Math.min(
    parseInt(searchParams.get('radius') || String(DEFAULT_RADIUS)),
    MAX_RADIUS
  );

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat and lng must be valid numbers' }, { status: 400 });
  }

  // Bounding box approximation
  const latDelta = radius / METERS_PER_DEGREE_LAT;
  const lngDelta = radius / (METERS_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180));

  const south = lat - latDelta;
  const north = lat + latDelta;
  const west = lng - lngDelta;
  const east = lng + lngDelta;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .gte('latitude', south)
    .lte('latitude', north)
    .gte('longitude', west)
    .lte('longitude', east)
    .order('real_derma_score', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sort by actual distance (Haversine approximation)
  const results = (data ?? [])
    .map((clinic) => {
      const dLat = ((clinic.latitude - lat) * Math.PI) / 180;
      const dLng = ((clinic.longitude - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((clinic.latitude * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371000;
      return { ...clinic, distance_meters: Math.round(distance) };
    })
    .filter((clinic) => clinic.distance_meters <= radius)
    .sort((a, b) => a.distance_meters - b.distance_meters);

  return NextResponse.json(results);
}
