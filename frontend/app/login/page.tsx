import { LoginView } from '@/components/auth/LoginView';

export const metadata = {
  title: 'Sign In — Neuronotes',
  description: 'Authenticate as Elena Rostova (New Learner) or Vikrant Kolse (Calibrated Profile) into the Neuronotes Psychometric Engine.',
};

export default function LoginPage() {
  return <LoginView />;
}
