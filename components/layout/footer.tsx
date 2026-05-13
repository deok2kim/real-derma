import Link from 'next/link';

export { Footer };
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand + disclaimer */}
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-blue-600">리얼더마</span>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              본 서비스는 건강보험 진료 데이터 및 공개 정보를 기반으로 제공됩니다.
              의료 정보의 정확성을 보장하지 않으며, 최종 판단은 사용자에게 있습니다.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              소개
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              이용약관
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center md:text-left">
          © 2024 리얼더마. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
