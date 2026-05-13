import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: '이용약관',
};

export default function TermsPage() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. 서비스 개요</h2>
            <p>리얼더마는 공공데이터를 기반으로 피부과 의원 정보를 제공하는 웹 서비스입니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. 면책 조항</h2>
            <p>리얼더마에서 제공하는 정보는 참고용이며, 의료 조언을 대체하지 않습니다. 정확한 진단과 치료를 위해서는 반드시 전문의와 상담하세요.</p>
            <p>클리닉 정보의 정확성을 위해 노력하지만, 실시간 정보와 차이가 있을 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. 금지 행위</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>허위 신고 또는 제보</li>
              <li>서비스의 자동화된 접근 (크롤링, 스크래핑)</li>
              <li>서비스 운영을 방해하는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. 지적재산권</h2>
            <p>서비스의 디자인, 코드, 콘텐츠에 대한 권리는 리얼더마에 있습니다. 클리닉 데이터는 공공데이터를 기반으로 하며, 원 데이터의 라이선스를 따릅니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. 서비스 변경 및 중단</h2>
            <p>리얼더마는 사전 통보 없이 서비스를 변경하거나 중단할 수 있습니다.</p>
          </section>
        </div>

        <p className="text-sm text-gray-400 mt-12">최종 수정일: 2024-01-01</p>
      </main>
      <Footer />
    </div>
  );
}
