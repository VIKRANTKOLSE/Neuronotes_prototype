import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
        <Compass className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-100 font-sans">
          Route Not Found
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested diagnostic module is outside the current curriculum graph.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-medium transition shadow-md"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
