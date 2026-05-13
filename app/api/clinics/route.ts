import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bounds = searchParams.get('bounds');
  const realOnly = searchParams.get('realOnly') === 'true';
  const specialty = searchParams.get('specialty');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

  const supabase = createServerClient();
  let query = supabase.from('clinics').select('*');

  if (bounds) {
    const [south, west, north, east] = bounds.split(',').map(Number);
    query = query
      .gte('latitude', south)
      .lte('latitude', north)
      .gte('longitude', west)
      .lte('longitude', east);
  }

  if (realOnly) query = query.eq('is_real_derma', true);
  if (specialty) query = query.contains('specialties', [specialty]);

  query = query
    .order('real_derma_score', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
