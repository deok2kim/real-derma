import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '리얼더마 - 진짜 피부과 찾기';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: 'white',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
            }}
          >
            🏥
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>
              리얼더마
            </span>
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 32, margin: 0, textAlign: 'center' }}>
          진짜 피부 치료를 위한 플랫폼
        </p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, margin: '16px 0 0', textAlign: 'center' }}>
          건강보험 데이터로 검증된 피부과 찾기
        </p>
      </div>
    ),
    { ...size }
  );
}
