/**
 * HIRA (건강보험심사평가원) Open Data Crawler
 *
 * Fetches licensed dermatology clinics from HIRA open data portal.
 * API: https://opendata.hira.or.kr
 *
 * Usage:
 *   npx tsx scripts/crawl/hira-clinics.ts
 *
 * Required env:
 *   HIRA_API_KEY - 공공데이터포털 인증키
 *   SUPABASE_SERVICE_ROLE_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 */

import { createClient } from '@supabase/supabase-js';

const HIRA_API_URL = 'http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';
const DERMA_SPECIALTY_CODE = 'D034'; // 피부과

interface HiraClinic {
  yadmNm: string; // 병원명
  addr: string; // 주소
  telno: string; // 전화번호
  XPos: string; // 경도
  YPos: string; // 위도
  clCd: string; // 종별코드
  dgsbjtCd: string; // 진료과목코드
  ykiho: string; // 요양기관번호
}

async function fetchHiraClinics(page: number = 1, pageSize: number = 100) {
  const apiKey = process.env.HIRA_API_KEY;
  if (!apiKey) throw new Error('HIRA_API_KEY is required');

  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: String(page),
    numOfRows: String(pageSize),
    dgsbjtCd: DERMA_SPECIALTY_CODE,
    _type: 'json',
  });

  const res = await fetch(`${HIRA_API_URL}?${params}`);
  if (!res.ok) throw new Error(`HIRA API error: ${res.status}`);

  const data = await res.json();
  return data.response?.body?.items?.item as HiraClinic[] || [];
}

async function main() {
  console.log('Starting HIRA dermatology clinic crawl...');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let page = 1;
  let total = 0;

  while (true) {
    const clinics = await fetchHiraClinics(page);
    if (clinics.length === 0) break;

    for (const clinic of clinics) {
      const lat = parseFloat(clinic.YPos);
      const lng = parseFloat(clinic.XPos);
      if (isNaN(lat) || isNaN(lng)) continue;

      const { error } = await supabase.from('clinics').upsert(
        {
          name: clinic.yadmNm,
          address: clinic.addr,
          phone: clinic.telno || null,
          latitude: lat,
          longitude: lng,
          location: `POINT(${lng} ${lat})`,
          has_insurance: true,
          is_real_derma: true,
          real_derma_score: 0.7,
          data_source: 'crawl',
        },
        { onConflict: 'name' }
      );

      if (error) {
        console.error(`Failed to upsert ${clinic.yadmNm}:`, error.message);
      } else {
        total++;
      }
    }

    console.log(`Page ${page}: processed ${clinics.length} clinics (total: ${total})`);
    page++;

    // Rate limit
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`Done. Total clinics imported: ${total}`);
}

main().catch(console.error);
