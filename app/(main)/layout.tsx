import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to signin if not authenticated
  if (!user) {
    redirect('/auth/signin');
  }

  return <MainLayout user={user}>{children}</MainLayout>;
}

