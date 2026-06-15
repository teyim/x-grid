import { Suspense } from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';

export const metadata = {
  title: 'Admin Login',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
