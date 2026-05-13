'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
}

export function SearchBar({ className, defaultValue = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    inputRef.current?.blur();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex items-center w-full', className)}
    >
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="지역, 병원명으로 검색..."
        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 focus:bg-white border border-transparent focus:border-blue-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
      />
    </form>
  );
}
