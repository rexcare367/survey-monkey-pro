import { User } from '@supabase/supabase-js';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  user: User | null;
  title?: string;
}

export default function MainLayout({
  children,
  user,
  title,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header user={user} title={title} />

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-black">
          <div className="h-full p-6">{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

