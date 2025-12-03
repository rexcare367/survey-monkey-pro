'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';
import { User } from '@supabase/supabase-js';

interface SidebarProps {
  user: User | null;
}

interface MenuItem {
  name: string;
  href: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Surveys', href: '/surveys', icon: '📝' },
  { name: 'Responses', href: '/responses', icon: '📋' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

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
    <div className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Survey Monkey Pro"
            width={100}
            height={20}
            priority
          />
        </Link>
      </div>

      {/* Menu List */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-black dark:bg-zinc-800 dark:text-zinc-50'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
                  }`}
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section at Bottom */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
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
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </Link>
          <div className="px-4">
            <LogoutButton compact />
          </div>
        </div>
      </div>
    </div>
  );
}

