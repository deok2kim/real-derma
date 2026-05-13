import type { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://realderma.kr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let clinics: { id: string; updated_at: string }[] | null = null;
  try {
    const supabase = createServerClient();
    const result = await supabase
      .from('clinics')
      .select('id, updated_at')
      .eq('is_real_derma', true);
    clinics = result.data;
  } catch {
    clinics = null;
  }

  const clinicEntries: MetadataRoute.Sitemap = (clinics || []).map((clinic) => ({
    url: `${SITE_URL}/clinic/${clinic.id}`,
    lastModified: clinic.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/report`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    ...clinicEntries,
  ];
}
