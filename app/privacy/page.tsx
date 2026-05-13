import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: '개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. 수집하는 개인정보</h2>
            <p>리얼더마는 회원가입을 요구하지 않으며, 최소한의 정보만 수집합니다.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>신고/제보 시: 연락처(선택), IP 주소의 해시값(보안 목적)</li>
              <li>자동 수집: 방문 기록, 브라우저 정보 (Google Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. 개인정보의 이용 목적</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>서비스 제공 및 개선</li>
              <li>스팸 및 악용 방지 (IP 해시 기반 요청 제한)</li>
              <li>서비스 이용 통계 분석</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. 개인정보의 보유 기간</h2>
            <p>수집된 정보는 수집 목적 달성 시까지 보유하며, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보유합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. 개인정보의 제3자 제공</h2>
            <p>리얼더마는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 경우는 예외로 합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. 쿠키 및 광고</h2>
            <p>Google AdSense를 통해 광고를 제공하며, 이 과정에서 쿠키가 사용될 수 있습니다. 브라우저 설정에서 쿠키를 관리할 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. 문의</h2>
            <p>개인정보 관련 문의: contact@realderma.kr</p>
          </section>
        </div>

        <p className="text-sm text-gray-400 mt-12">최종 수정일: 2024-01-01</p>
      </main>
      <Footer />
    </div>
  );
}
