'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SearchBar } from '@/components/search-bar';
import { useFavoritesStore } from '@/store/favorites-store';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button
      onClick={() => setTheme(next)}
      className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="테마 변경"
      title={`현재: ${theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '시스템'}`}
    >
      <Icon size={18} />
    </button>
  );
}

export { Header };
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useFavoritesStore((s) => s.favorites.length);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600 tracking-tight">리얼더마</span>
            <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500 font-medium">진짜 피부 치료를 위한 플랫폼</span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
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
            <ThemeToggle />
            <Link
              href="/report"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              제보하기
            </Link>
          </nav>

          {/* Mobile theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="메뉴 열기"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          </div>
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
