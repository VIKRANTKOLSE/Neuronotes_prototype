import { api } from '@/services/api';
import { QuizView } from '@/components/quiz/QuizView';

export const metadata = {
  title: 'Adaptive Practice Session | Neuronotes',
  description: 'Real-time Item Response Measurement and explainable item selection',
};

interface QuizPageProps {
  searchParams?: {
    conceptId?: string;
    topic?: string;
    difficulty?: string;
    count?: string;
  };
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const initialQuestion = await api.getAdaptiveQuestion({
    conceptId: searchParams?.conceptId,
  });

  return <QuizView initialQuestion={initialQuestion} />;
}
