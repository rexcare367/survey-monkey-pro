'use client';

import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  title?: string;
  onMenuClick: () => void;
}

export default function Header({ user, title, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  
  // Determine title from pathname if not provided
  const getTitle = () => {
    if (title) return title;
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/surveys')) return 'Surveys';
    if (pathname.startsWith('/responses')) return 'Responses';
    if (pathname.startsWith('/analytics')) return 'Analytics';
    if (pathname.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-zinc-200 bg-white px-4 lg:px-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </button>
          <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
            {getTitle()}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* You can add notifications, search, etc. here */}
        </div>
      </div>
    </header>
  );
}

