'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout, setLoading } from '@/lib/store/slices/authSlice';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  compact?: boolean;
}

export default function LogoutButton({ compact = false }: LogoutButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    dispatch(setLoading(true));
    await supabase.auth.signOut();
    dispatch(logout());
    router.push('/auth/signin');
    router.refresh();
  };

  if (compact) {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogOut className="h-5 w-5" />
        <span>{loading ? 'Signing out...' : 'Logout'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span>{loading ? 'Signing out...' : 'Sign out'}</span>
    </button>
  );
}

