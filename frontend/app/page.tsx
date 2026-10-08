import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { getActiveUser } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard | Neuronotes',
  description: 'Learner Diagnostic State and Next Best Action',
};

export default async function HomePage() {
  const activeUser = getActiveUser();

  if (!activeUser) {
    redirect('/login');
  }

  const [concepts, misconceptions, activities] = await Promise.all([
    api.getConcepts(),
    api.getMisconceptions(),
    api.getRecentActivities(),
  ]);

  return (
    <DashboardView
      concepts={concepts}
      misconceptions={misconceptions}
      activities={activities}
    />
  );
}
