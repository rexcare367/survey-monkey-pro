import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';

export default function SignInPage() {
  return (
    <AuthLayout mode="signin">
      <AuthForm mode="signin" />
    </AuthLayout>
  );
}

