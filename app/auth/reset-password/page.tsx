'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ResetPasswordPage() {
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has a valid session (Supabase automatically handles the hash fragment)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
      setIsChecking(false);
    };

    checkSession();
  }, []);

  if (isChecking) {
    return (
      <AuthLayout mode="reset">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Checking session...</p>
        </div>
      </AuthLayout>
    );
  }

  if (!isValidSession) {
    return (
      <AuthLayout mode="reset">
        <div className="w-full space-y-8 text-center">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-50">
            Invalid or expired link
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/auth/forgot-password"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Request new reset link
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout mode="reset">
      <AuthForm mode="reset" />
    </AuthLayout>
  );
}

