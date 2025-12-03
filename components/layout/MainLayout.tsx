'use client';

import { useState, useCallback } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black">
      {/* Sidebar */}
      <Sidebar user={user} isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <Header user={user} title={title} onMenuClick={toggleSidebar} />

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-black">
          <div className="h-full p-4 lg:p-6">{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

