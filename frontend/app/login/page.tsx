'use client';

import { ToastContainer } from '@/components/Toast';
import { LoginForm } from '@/components/AuthForms';
import { useToast } from '@/lib/useToast';

export default function LoginPage() {
  const { toasts } = useToast();

  return (
    <>
      <LoginForm />
      <ToastContainer toasts={toasts} />
    </>
  );
}
