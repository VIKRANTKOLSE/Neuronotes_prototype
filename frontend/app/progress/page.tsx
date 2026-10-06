import { api } from '@/services/api';
import { ProgressView } from '@/components/progress/ProgressView';

export const metadata = {
  title: 'Progress & Telemetry | Neuronotes',
  description: 'Multidimensional Item Response Theory ability tracking and posterior variance',
};

export default async function ProgressPage() {
  const [concepts, activities] = await Promise.all([
    api.getConcepts(),
    api.getRecentActivities(),
  ]);

  return <ProgressView concepts={concepts} activities={activities} />;
}
