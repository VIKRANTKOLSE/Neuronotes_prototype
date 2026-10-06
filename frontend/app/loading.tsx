import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      <div className="text-center space-y-1">
        <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Neuronotes Engine
        </p>
        <p className="text-sm font-medium text-slate-300">
          Loading diagnostic state...
        </p>
      </div>
    </div>
  );
}
