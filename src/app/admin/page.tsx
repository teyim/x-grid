import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';
import { adminSessionCookieName, hasValidAdminSessionCookie } from '@/lib/adminSession';

export const metadata = {
  title: 'Admin Usage',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const hasSession = await hasValidAdminSessionCookie(
    cookieStore.get(adminSessionCookieName)?.value
  );

  if (!hasSession) {
    redirect('/admin/login?next=/admin');
  }

  return <AdminDashboard />;
}
