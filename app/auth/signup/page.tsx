import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';

export default function SignUpPage() {
  return (
    <AuthLayout mode="signup">
      <AuthForm mode="signup" />
    </AuthLayout>
  );
}

