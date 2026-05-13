import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { hashIP } from '@/lib/utils';
import { RATE_LIMIT } from '@/lib/constants';

const submissionSchema = z.object({
  clinicName: z.string().min(1, 'Clinic name is required').max(255),
  address: z.string().min(1, 'Address is required').max(500),
  phone: z.string().max(50).optional(),
  reason: z.string().max(1000).optional(),
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

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { clinicName, address, phone, reason, contact } = parsed.data;

  const ip = getIP(request);
  const ipHash = await hashIP(ip);

  const supabase = createServerClient();

  // Rate limit: max 3 submissions per IP per hour
  const windowStart = new Date(
    Date.now() - RATE_LIMIT.submissions.windowHours * 60 * 60 * 1000
  ).toISOString();

  const { count, error: countError } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart);

  if (countError) {
    console.error('[submissions] Rate limit check failed:', countError);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  if ((count ?? 0) >= RATE_LIMIT.submissions.max) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      clinic_name: clinicName,
      address,
      phone: phone ?? null,
      reason: reason ?? null,
      contact: contact ?? null,
      ip_hash: ipHash,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[submissions] Insert failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
