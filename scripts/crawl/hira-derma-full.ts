/**
 * HIRA 피부과 크롤러 (수정본)
 *
 * - clCd=31 (의원) 으로 올바르게 수집
 * - yadmNm에 "피부" 포함된 의원만 저장 (빠른 1차 수집)
 * - getDgsbjtInfo API가 활성화되면 2차로 specialty 필터 추가 가능
 *
 * Usage:
 *   npx tsx scripts/crawl/hira-derma-full.ts
 */

const BASE_HOSP = 'http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';

// 시도 코드 전국
const SIDO_CODES = [
  '110000', // 서울
  '210000', // 부산
  '220000', // 대구
  '230000', // 인천
  '240000', // 광주
  '250000', // 대전
  '260000', // 울산
  '290000', // 세종
  '310000', // 경기
  '320000', // 강원
  '330000', // 충북
  '340000', // 충남
  '350000', // 전북
  '360000', // 전남
  '370000', // 경북
  '380000', // 경남
  '390000', // 제주
];

interface HiraClinic {
  yadmNm: string;
  addr: string;
  telno: string;
  XPos: number | string;
  YPos: number | string;
  ykiho: string;
}

async function fetchHospPage(sidoCd: string, page: number): Promise<{ items: HiraClinic[]; totalPages: number }> {
  const apiKey = process.env.HIRA_API_KEY!;
  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: String(page),
    numOfRows: '100',
    sidoCd,
    clCd: '31', // 의원 (올바른 코드)
    _type: 'json',
  });

  const res = await fetch(`${BASE_HOSP}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json() as any;

  const body = data?.response?.body;
  const totalCount = Number(body?.totalCount ?? 0);
  const totalPages = Math.ceil(totalCount / 100);
  const raw = body?.items?.item;

  if (!raw) return { items: [], totalPages };
  const items = Array.isArray(raw) ? raw : [raw];
  return { items, totalPages };
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function upsertClinic(supabaseUrl: string, serviceKey: string, clinic: {
  name: string; address: string; phone: string | null;
  latitude: number; longitude: number;
}) {
  const body = JSON.stringify({
    name: clinic.name,
    address: clinic.address,
    phone: clinic.phone,
    latitude: clinic.latitude,
    longitude: clinic.longitude,
    location: `POINT(${clinic.longitude} ${clinic.latitude})`,
    has_insurance: true,
    is_real_derma: true,
    real_derma_score: 0.7,
    data_source: 'hira_v2',
  });

  const res = await fetch(`${supabaseUrl}/rest/v1/clinics?on_conflict=name`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status}: ${err}`);
  }
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  console.log('HIRA 피부과 의원 크롤링 시작 (clCd=31, "피부" 포함)...\n');

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const sidoCd of SIDO_CODES) {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const result = await fetchHospPage(sidoCd, page);
      totalPages = result.totalPages;

      if (result.items.length === 0) break;

      // 이름에 "피부" 포함된 것만 필터
      const derma = result.items.filter((c) => c.yadmNm.includes('피부'));

      for (const clinic of derma) {
        const lat = parseFloat(String(clinic.YPos));
        const lng = parseFloat(String(clinic.XPos));
        if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
          skipped++;
          continue;
        }

        try {
          await upsertClinic(supabaseUrl, serviceKey, {
            name: clinic.yadmNm,
            address: clinic.addr,
            phone: clinic.telno || null,
            latitude: lat,
            longitude: lng,
          });
          inserted++;
        } catch (e) {
          console.error(`  ERROR ${clinic.yadmNm}: ${e}`);
          errors++;
        }
      }

      skipped += result.items.length - derma.length;
      console.log(`sido=${sidoCd} page=${page}/${totalPages} | 피부과 ${derma.length}/${result.items.length} | 누적: ${inserted}`);
      page++;
      await sleep(200);
    }
  }

  console.log(`\n완료`);
  console.log(`  삽입: ${inserted}`);
  console.log(`  스킵: ${skipped}`);
  console.log(`  에러: ${errors}`);
}

main().catch(console.error);
