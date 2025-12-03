import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Dashboard</h1>
            <LogoutButton />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">Welcome back!</h2>
              <p className="text-gray-600 dark:text-gray-400">You are successfully authenticated.</p>
            </div>
            
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <h3 className="text-md font-semibold text-black dark:text-zinc-50 mb-2">User Information</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Email:</strong> {user.email}
              </p>
              {user.user_metadata?.full_name && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Name:</strong> {user.user_metadata.full_name}
                </p>
              )}
              {user.app_metadata?.provider && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Provider:</strong> {user.app_metadata.provider}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

