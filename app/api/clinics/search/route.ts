import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  const sanitized = q.trim().slice(0, 100);
  const pattern = `%${sanitized}%`;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .or(`name.ilike.${pattern},address.ilike.${pattern}`)
    .order('real_derma_score', { ascending: false })
    .limit(20);

  if (error) {
    console.error('[search] Query failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data);
}
