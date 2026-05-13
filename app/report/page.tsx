import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { SubmissionForm } from '@/components/forms/submission-form';

export const metadata: Metadata = {
  title: '클리닉 제보',
  description: '등록되지 않은 진짜 피부과를 제보해주세요. 여러분의 제보가 더 정확한 정보를 만듭니다.',
};

export default function ReportPage() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-2">클리닉 제보하기</h1>
        <p className="text-gray-600 mb-8">
          등록되지 않은 진짜 피부과를 알고 계신가요? 아래 양식을 작성해주시면
          검토 후 등록하겠습니다.
        </p>
        <SubmissionForm />
      </main>
      <Footer />
    </div>
  );
}
