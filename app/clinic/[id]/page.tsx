import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const dynamic = 'force-dynamic';
import { ClinicDetailPage } from '@/components/clinic/clinic-detail-page';
import { AdBanner } from '@/components/ad-banner';
import { createServerClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/constants';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: clinic } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', id)
    .single();

  if (!clinic) return { title: '클리닉을 찾을 수 없습니다' };

  return {
    title: clinic.name,
    description: `${clinic.name} - ${clinic.address}. 리얼더마 점수: ${clinic.real_derma_score}. ${clinic.specialties?.join(', ') || '피부과'}`,
    openGraph: {
      title: `${clinic.name} | 리얼더마`,
      description: `${clinic.address} | 리얼더마 점수: ${clinic.real_derma_score}`,
      type: 'website',
      url: `${SITE_URL}/clinic/${id}`,
    },
  };
}

export default async function ClinicPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: clinic } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', id)
    .single();

  if (!clinic) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: clinic.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address,
      addressCountry: 'KR',
    },
    telephone: clinic.phone,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: clinic.latitude,
      longitude: clinic.longitude,
    },
    ...(clinic.review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: clinic.average_rating,
        reviewCount: clinic.review_count,
      },
    }),
    medicalSpecialty: 'Dermatology',
  };

  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <ClinicDetailPage clinic={clinic} />
        <AdBanner slot="clinic-detail" className="mt-8" format="horizontal" />
      </main>
      <Footer />
    </div>
  );
}
