'use client';

import { ToastContainer } from '@/components/Toast';
import { RegisterForm } from '@/components/AuthForms';
import { useToast } from '@/lib/useToast';

export default function RegisterPage() {
  const { toasts } = useToast();

  return (
    <>
      <RegisterForm />
      <ToastContainer toasts={toasts} />
    </>
  );
}
