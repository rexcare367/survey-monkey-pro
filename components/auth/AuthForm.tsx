'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setUser, setLoading, setError, clearError } from '@/lib/store/slices/authSlice';

interface AuthFormProps {
  mode: 'signin' | 'signup' | 'forgot' | 'reset';
}

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type FormData = SignInFormData | SignUpFormData | ForgotPasswordFormData | ResetPasswordFormData;

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getSchema = () => {
    switch (mode) {
      case 'signin':
        return signInSchema;
      case 'signup':
        return signUpSchema;
      case 'forgot':
        return forgotPasswordSchema;
      case 'reset':
        return resetPasswordSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(getSchema()),
  });

  const onSubmit = async (data: FormData) => {
    dispatch(setLoading(true));
    setMessage(null);
    dispatch(clearError());

    try {
      if (mode === 'signin') {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: (data as SignInFormData).email,
          password: (data as SignInFormData).password,
        });

        if (error) throw error;

        dispatch(setUser(authData.user));
        router.push('/dashboard');
        router.refresh();
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: (data as SignUpFormData).email,
          password: (data as SignUpFormData).password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Check your email to confirm your account!',
        });
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail((data as ForgotPasswordFormData).email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Check your email for the password reset link!',
        });
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.updateUser({
          password: (data as ResetPasswordFormData).password,
        });

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Password updated successfully! Redirecting...',
        });

        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      dispatch(setError(errorMessage));
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleAuth = async () => {
    dispatch(setLoading(true));
    setMessage(null);
    dispatch(clearError());

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred with Google authentication';
      dispatch(setError(errorMessage));
      setMessage({
        type: 'error',
        text: errorMessage,
      });
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {mode !== 'reset' && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                'email' in errors && errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-900/20'
                  : 'border-gray-300 focus:ring-black focus:border-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:ring-white dark:focus:border-white'
              }`}
              placeholder="you@example.com"
            />
            {'email' in errors && errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
        )}

        {(mode === 'signin' || mode === 'signup' || mode === 'reset') && (
          <>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'reset' ? 'new-password' : 'current-password'}
                {...register('password')}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  'password' in errors && errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-900/20'
                    : 'border-gray-300 focus:ring-black focus:border-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:ring-white dark:focus:border-white'
                }`}
                placeholder="••••••••"
              />
              {'password' in errors && errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {(mode === 'signup' || mode === 'reset') && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    'confirmPassword' in errors && errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-900/20'
                      : 'border-gray-300 focus:ring-black focus:border-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:ring-white dark:focus:border-white'
                  }`}
                  placeholder="••••••••"
                />
                {'confirmPassword' in errors && errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}
          </>
        )}

        {mode === 'signin' && (
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="/auth/forgot-password"
                className="font-medium text-black hover:text-gray-700 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                Forgot password?
              </a>
            </div>
          </div>
        )}

        {mode !== 'forgot' && mode !== 'reset' && (
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-zinc-700" />
          </div>
          {mode !== 'forgot' && mode !== 'reset' && (
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 dark:bg-black dark:text-gray-400">Or continue with</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? 'Loading...'
            : mode === 'signin'
              ? 'Sign in'
              : mode === 'signup'
                ? 'Sign up'
                : mode === 'forgot'
                  ? 'Send reset link'
                  : 'Reset password'}
        </button>
      </form>

      <div className="text-center text-sm">
        {mode === 'signin' && (
          <span className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="font-medium text-black hover:text-gray-700 dark:text-zinc-300 dark:hover:text-zinc-100">
              Sign up
            </a>
          </span>
        )}
        {mode === 'signup' && (
          <span className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/auth/signin" className="font-medium text-black hover:text-gray-700 dark:text-zinc-300 dark:hover:text-zinc-100">
              Sign in
            </a>
          </span>
        )}
        {mode === 'forgot' && (
          <span className="text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <a href="/auth/signin" className="font-medium text-black hover:text-gray-700 dark:text-zinc-300 dark:hover:text-zinc-100">
              Sign in
            </a>
          </span>
        )}
      </div>
    </div>
  );
}
