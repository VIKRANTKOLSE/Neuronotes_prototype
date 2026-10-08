import React from 'react';
import { 
  X, 
  ArrowRight, 
  ShieldAlert, 
} from 'lucide-react';
import { MisconceptionItem } from '@/types';

interface MisconceptionModalProps {
  misconception: MisconceptionItem | null;
  onClose: () => void;
  onStartTargetedDrill: (misconception: MisconceptionItem) => void;
  theme?: 'dark' | 'light';
}

export const MisconceptionModal: React.FC<MisconceptionModalProps> = ({
  misconception,
  onClose,
  onStartTargetedDrill,
  theme = 'dark',
}) => {
  if (!misconception) return null;
  const isLight = theme === 'light';

  const confidenceBadgeColor: Record<string, string> = {
    'Moderate': isLight ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Emerging pattern': isLight ? 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]' : 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    'Strong evidence': isLight ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]' : 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    'Insufficient evidence': isLight ? 'bg-[#F1F4F8] text-[#526176] border-[#D9E1E8]' : 'bg-slate-700/20 text-slate-300 border-slate-600/40',
  };

  const badgeStyle = confidenceBadgeColor[misconception.confidence] || confidenceBadgeColor['Moderate'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`w-full max-w-xl rounded-xl shadow-elevated overflow-hidden border ${
        isLight ? 'bg-white border-[#D7DEE7] shadow-[0_4px_20px_rgba(15,23,42,0.06)]' : 'bg-slate-900 border-slate-700/80'
      }`}>
        {/* Diagnostic Top Banner */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isLight 
            ? 'bg-[#FFFDF9] border-[#FED7AA]' 
            : 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900 border-amber-500/30'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border ${
              isLight ? 'bg-[#FFF7ED] border-[#FED7AA] text-[#C2410C]' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[11px] font-mono uppercase tracking-widest font-bold block ${
                isLight ? 'text-[#C2410C]' : 'text-amber-400'
              }`}>
                DIAGNOSTIC PATTERN DETECTED
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-[#718096]' : 'text-slate-300'}`}>
                Probabilistic Evaluation Engine
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isLight ? 'text-[#718096] hover:text-[#172033] hover:bg-[#F1F4F8]' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Main Title & Non-Punitive Phrasing */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono uppercase tracking-wider ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
                POSSIBLE MISCONCEPTION
              </span>
              <span className="text-slate-400 font-mono">•</span>
              <span className="text-xs font-mono text-[#2563EB] dark:text-blue-400">
                {misconception.conceptName}
              </span>
            </div>
            <h3 className={`text-xl font-bold font-sans leading-snug ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
              &ldquo;{misconception.statement}&rdquo;
            </h3>
          </div>

          {/* Evidence and Confidence Indicators */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl font-mono text-xs border ${
            isLight ? 'bg-[#F7F9FB] border-[#D9E1E8]' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="space-y-1">
              <span className={`text-[11px] uppercase block ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>EVIDENCE</span>
              <p className={`font-sans font-medium text-xs leading-relaxed ${isLight ? 'text-[#172033]' : 'text-slate-200'}`}>
                {misconception.evidence}
              </p>
            </div>
            <div className={`space-y-1 sm:border-l sm:pl-3 ${isLight ? 'border-[#E2E8F0]' : 'border-slate-800/80'}`}>
              <span className={`text-[11px] uppercase block ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>CONFIDENCE</span>
              <span className={`inline-block px-2.5 py-0.5 rounded text-xs border font-medium ${badgeStyle}`}>
                {misconception.confidence}
              </span>
              <p className={`text-[10px] font-sans mt-0.5 ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
                Evaluated from Bayesian response weights
              </p>
            </div>
          </div>

          {/* Recommended Action */}
          <div className={`p-4 rounded-xl space-y-1.5 border ${
            isLight ? 'bg-[#F7F9FB] border-[#D9E1E8]' : 'bg-slate-950/60 border-slate-800/80'
          }`}>
            <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold block ${
              isLight ? 'text-[#1D4ED8]' : 'text-blue-400'
            }`}>
              RECOMMENDED ACTION
            </span>
            <p className={`text-sm font-medium ${isLight ? 'text-[#172033]' : 'text-slate-200'}`}>
              {misconception.recommendedAction}
            </p>
            <p className={`text-xs ${isLight ? 'text-[#526176]' : 'text-slate-400'}`}>
              Neuronotes avoids penalizing early exploration. Targeted drills isolate this specific relationship to build robust conceptual anchors.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-mono transition ${
                isLight ? 'text-[#526176] hover:text-[#172033] hover:bg-[#F1F4F8]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Acknowledge & Continue
            </button>
            <button
              onClick={() => onStartTargetedDrill(misconception)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Try {misconception.targetedQuestionsCount} Targeted Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisconceptionModal;
