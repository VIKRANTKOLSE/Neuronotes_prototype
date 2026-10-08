import { redirect } from 'next/navigation';
import { getActiveUser } from '@/lib/auth';

export default function AuthRedirect() {
  const user = getActiveUser();
  if (!user) {
    redirect('/login');
  }
  redirect('/');
}