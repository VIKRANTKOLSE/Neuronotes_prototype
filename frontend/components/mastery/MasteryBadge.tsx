import React from 'react';
import { MasteryStatus } from '@/types';

interface MasteryBadgeProps {
  status: MasteryStatus;
  size?: 'sm' | 'md' | 'lg';
  showDetail?: boolean;
}

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({ 
  status, 
  size = 'md',
  showDetail = false 
}) => {
  const configs: Record<MasteryStatus, { label: string; detail: string; classes: string; dotClass: string }> = {
    strong: {
      label: 'Strong',
      detail: 'Confirmed mastery',
      classes: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
      dotClass: 'bg-emerald-500 dark:bg-emerald-400',
    },
    developing: {
      label: 'Developing',
      detail: 'In progress',
      classes: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
      dotClass: 'bg-amber-500 dark:bg-amber-400',
    },
    uncertain: {
      label: 'Uncertain',
      detail: 'Needs probing',
      classes: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE] dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/35',
      dotClass: 'bg-violet-500 dark:bg-violet-400 animate-pulse',
    },
    weak: {
      label: 'Needs attention',
      detail: 'Diagnosed gap',
      classes: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30',
      dotClass: 'bg-rose-500 dark:bg-rose-400',
    },
    insufficient_evidence: {
      label: 'Insufficient evidence',
      detail: 'Unprobed state',
      classes: 'bg-[#F1F4F8] text-[#526176] border-[#D9E1E8] dark:bg-slate-700/20 dark:text-slate-300 dark:border-slate-600/40',
      dotClass: 'bg-slate-400',
    },
  };

  const current = configs[status] || configs.insufficient_evidence;
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3 py-1 font-medium' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-md font-sans ${current.classes} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass}`}></span>
      <span>{current.label}</span>
      {showDetail && (
        <span className="text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700/60 pl-1.5 text-[11px]">
          {current.detail}
        </span>
      )}
    </span>
  );
};

export default MasteryBadge;
