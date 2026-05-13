import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { hashIP } from '@/lib/utils';
import { RATE_LIMIT } from '@/lib/constants';

const reportSchema = z.object({
  clinicId: z.string().uuid('Invalid clinic ID'),
  reportType: z.enum(['wrong_info', 'closed', 'not_real_derma', 'cosmetic_only', 'other']),
  description: z.string().max(1000).optional(),
  contact: z.string().max(255).optional(),
});

function getIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { clinicId, reportType, description, contact } = parsed.data;

  const ip = getIP(request);
  const ipHash = await hashIP(ip);

  const supabase = createServerClient();

  // Rate limit: max 5 reports per IP per hour
  const windowStart = new Date(
    Date.now() - RATE_LIMIT.reports.windowHours * 60 * 60 * 1000
  ).toISOString();

  const { count, error: countError } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart);

  if (countError) {
    console.error('[reports] Rate limit check failed:', countError);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  if ((count ?? 0) >= RATE_LIMIT.reports.max) {
    return NextResponse.json(
      { error: 'Too many reports. Please try again later.' },
      { status: 429 }
    );
  }

  const { data, error } = await supabase
    .from('reports')
    .insert({
      clinic_id: clinicId,
      report_type: reportType,
      description: description ?? null,
      contact: contact ?? null,
      ip_hash: ipHash,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[reports] Insert failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
