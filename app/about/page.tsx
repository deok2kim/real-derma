import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: '소개',
  description: '리얼더마는 건강보험 진료 데이터를 기반으로 진짜 피부과를 찾아주는 서비스입니다.',
};

export default function AboutPage() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">리얼더마 소개</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">왜 리얼더마인가요?</h2>
          <p className="text-gray-700 leading-relaxed">
            요즘 피부과를 검색하면 미용 시술 위주의 클리닉이 대부분입니다.
            아토피, 건선, 습진 같은 실제 피부 질환을 치료해주는 &quot;진짜 피부과&quot;를
            찾기가 점점 어려워지고 있습니다.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            리얼더마는 건강보험심사평가원(HIRA) 데이터와 실제 환자 리뷰를 분석하여
            의료 피부과로서의 신뢰도를 점수화하고, 지도에서 쉽게 찾을 수 있도록
            도와드립니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">어떻게 평가하나요?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>건강보험 진료 비율 (40%) - 보험 청구 비율이 높을수록 실제 진료 비중이 큼</li>
            <li>리뷰 키워드 분석 (30%) - 아토피, 건선 등 의료 키워드 vs 보톡스, 필러 등 미용 키워드</li>
            <li>HIRA 등록 정보 (20%) - 건강보험심사평가원 피부과 전문 등록 여부</li>
            <li>진료 패턴 (10%) - 일반적인 진료 시간 운영 여부</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">점수 기준</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                인증됨
              </span>
              <span className="text-gray-700">0.7점 이상 - 의료 피부과로 검증됨</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                가능성 높음
              </span>
              <span className="text-gray-700">0.5~0.7점 - 의료 피부과일 가능성이 높음</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-600">
                미확인
              </span>
              <span className="text-gray-700">0.5점 미만 - 아직 충분한 데이터 없음</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">참여하기</h2>
          <p className="text-gray-700 leading-relaxed">
            잘못된 정보를 발견하셨나요? 등록되지 않은 좋은 피부과를 알고 계신가요?
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              href="/report"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              클리닉 제보하기
            </Link>
          </div>
        </section>

        <section className="text-sm text-gray-500">
          <p>
            리얼더마는 공공데이터를 기반으로 한 정보 제공 서비스이며, 의료 조언을
            제공하지 않습니다. 정확한 진단과 치료를 위해서는 반드시 전문의와
            상담하세요.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
