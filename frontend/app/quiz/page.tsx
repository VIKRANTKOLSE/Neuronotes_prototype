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
    mode?: string;
  };
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const isAi = searchParams?.mode === 'ai';
  let initialQuestion;

  if (isAi) {
    const aiQuestions = await api.generateAiTest({
      conceptIds: searchParams?.conceptId ? [searchParams.conceptId] : undefined,
      numQuestions: 5
    });
    initialQuestion = aiQuestions[0];
  } else {
    initialQuestion = await api.getAdaptiveQuestion({
      conceptId: searchParams?.conceptId,
    });
  }

  return <QuizView initialQuestion={initialQuestion} isAiGenerated={isAi} />;
}
