import { getActiveUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = getActiveUser();
  if (!user) {
    redirect('/login');
  }
  return <>{children}</>;
}