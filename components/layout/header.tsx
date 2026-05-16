'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Heart } from 'lucide-react';
import { SearchBar } from '@/components/search-bar';
import { useFavoritesStore } from '@/store/favorites-store';

export { Header };
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useFavoritesStore((s) => s.favorites.length);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600 tracking-tight">리얼더마</span>
            <span className="hidden sm:inline text-xs text-gray-400 font-medium">진짜 피부 치료를 위한 플랫폼</span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/favorites"
              className="relative text-sm font-medium text-gray-600 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Heart size={16} />
              저장목록
              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              소개
            </Link>
            <Link
              href="/report"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              제보하기
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="메뉴 열기"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile search (always visible below bar) */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <Link
            href="/favorites"
            className="text-sm font-medium text-gray-700 hover:text-red-500 py-2 flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <Heart size={16} />
            저장목록 {count > 0 && `(${count})`}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
            onClick={() => setMobileOpen(false)}
          >
            소개
          </Link>
          <Link
            href="/report"
            className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-center transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            제보하기
          </Link>
        </div>
      )}
    </header>
  );
}
