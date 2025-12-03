'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';
import { User } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  BarChart3, 
  Settings,
  X,
  User as UserIcon
} from 'lucide-react';
import { MENU_ITEMS, ROUTES } from '@/lib/constants';

interface SidebarProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FileText,
  ClipboardList,
  BarChart3,
};

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Only close when pathname changes, not when isOpen changes

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 transform flex-col justify-between flex border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo and Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2" onClick={() => window.innerWidth < 1024 && onClose()}>
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Survey Monkey Pro"
              width={100}
              height={20}
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>


        {/* Menu List */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const IconComponent = iconMap[item.icon];
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-100 text-black dark:bg-zinc-800 dark:text-zinc-50'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
                    }`}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section at Bottom */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          {/* User Info */}
          <div className="mb-4 flex items-center gap-3 px-2">
            {/* User Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={getUserDisplayName()}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                getUserInitials()
              )}
            </div>
            {/* User Name */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-black dark:text-zinc-50">
                {getUserDisplayName()}
              </p>
              {user?.email && (
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Settings and Logout */}
          <div className="flex flex-col gap-2">
            <Link
              href={ROUTES.SETTINGS}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
              <LogoutButton compact />
          </div>
        </div>
      </aside>
    </>
  );
}
