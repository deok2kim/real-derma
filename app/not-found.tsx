import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">페이지를 찾을 수 없습니다</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            지도로 돌아가기
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
