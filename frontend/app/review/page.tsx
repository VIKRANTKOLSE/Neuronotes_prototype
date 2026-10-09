import { api } from '@/services/api';
import { ReviewView } from '@/components/review/ReviewView';

export const metadata = {
  title: 'Misconceptions & Review | Neuronotes',
  description: 'Bayesian misconception pattern detector and diagnostic targeted drills',
};

export default async function ReviewPage() {
  const [misconceptions, pastTests] = await Promise.all([
    api.getMisconceptions(),
    api.getPastTests()
  ]);

  return <ReviewView misconceptions={misconceptions} initialTests={pastTests} />;
}

