import React from 'react';
import { MasteryStatus } from '@/types';

interface ConfidenceMeterProps {
  mastery: number; // 0-100
  confidence: number; // 0-100
  status: MasteryStatus;
  compact?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  mastery,
  confidence,
  status,
  compact = false,
}) => {
  const intervalSpread = Math.max(4, Math.round((100 - confidence) * 0.35));
  const minInterval = Math.max(0, mastery - intervalSpread);
  const maxInterval = Math.min(100, mastery + intervalSpread);

  if (compact) {
    return (
      <div className="w-full space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-mono">Mastery</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
            {status === 'insufficient_evidence' ? 'Pending' : `${mastery}%`}
          </span>
        </div>
        <div className="relative h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          {status !== 'insufficient_evidence' ? (
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === 'strong'
                  ? 'bg-emerald-500'
                  : status === 'developing'
                  ? 'bg-amber-500'
                  : status === 'uncertain'
                  ? 'bg-violet-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${mastery}%` }}
            />
          ) : (
            <div className="h-full bg-slate-400/50 dark:bg-slate-600/50 w-full animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block">
            Estimated Mastery
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {status === 'insufficient_evidence' ? 'Unrated' : `${mastery}%`}
            </span>
            {status !== 'insufficient_evidence' && (
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                CI: [{minInterval}%, {maxInterval}%]
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block">
            Evidence Confidence
          </span>
          <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
            <span className={`text-base font-semibold font-mono ${
              confidence >= 80 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : confidence >= 50 
                ? 'text-amber-600 dark:text-amber-300' 
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {confidence}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {confidence >= 80 ? 'Reliable' : confidence >= 50 ? 'Moderate' : 'Low Evidence'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden">
          {status !== 'insufficient_evidence' ? (
            <>
              <div 
                className="absolute top-0 bottom-0 bg-slate-300 dark:bg-slate-700/60 transition-all duration-300"
                style={{ 
                  left: `${minInterval}%`, 
                  width: `${Math.max(4, maxInterval - minInterval)}%` 
                }}
              />
              <div
                className={`absolute top-0 bottom-0 rounded-full transition-all duration-500 ${
                  status === 'strong'
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    : status === 'developing'
                    ? 'bg-amber-500'
                    : status === 'uncertain'
                    ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${mastery}%` }}
              />
            </>
          ) : (
            <div className="h-full w-full bg-slate-300 dark:bg-slate-700/40" />
          )}
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
          <span>0%</span>
          {status === 'insufficient_evidence' ? (
            <span className="text-slate-500 italic">Withheld: posterior variance too wide to score</span>
          ) : (
            <span>Margin of error: ±{intervalSpread}%</span>
          )}
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
