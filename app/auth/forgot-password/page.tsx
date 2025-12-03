import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout mode="forgot">
      <AuthForm mode="forgot" />
    </AuthLayout>
  );
}

