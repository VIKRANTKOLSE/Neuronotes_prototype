import { QuizView } from '@/components/quiz/QuizView';

export const metadata = {
  title: 'Diagnostic Evaluation & Adaptive Quiz | Neuronotes',
  description: '2-Phase MIRT diagnostic testing with real-time 58-concept theta vector calibration.',
};

interface QuizPageProps {
  searchParams?: {
    conceptId?: string;
    topic?: string;
    phase?: string;
    mode?: string;
  };
}

export default function QuizPage({ searchParams }: QuizPageProps) {
  const initialConceptId = searchParams?.conceptId || 'effective-nuclear-charge';
  const initialTopic = searchParams?.topic || 'Effective Nuclear Charge';
  const initialPhase = searchParams?.phase ? parseInt(searchParams.phase, 10) : 1;
  const isAi = searchParams?.mode === 'ai';

  return (
    <QuizView 
      initialConceptId={initialConceptId}
      initialTopic={initialTopic}
      initialPhase={initialPhase}
      isAiGenerated={isAi}
    />
  );
}
