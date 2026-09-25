import React from 'react';
import { Sparkles, Terminal, Cpu } from 'lucide-react';

interface ThreeUplinkLoaderProps {
  status?: string;
  stage?: string;
  className?: string;
}

export const ThreeUplinkLoader: React.FC<ThreeUplinkLoaderProps> = ({
  status = 'Analyzing source code...',
  stage = 'Parsing → Understanding → Reasoning',
  className = '',
}) => {
  return (
    <div className={`p-6 rounded-2xl bg-slate-950/90 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 space-y-4 max-w-md mx-auto ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-300">
            ✦ CodeVision AI Telemetry
          </span>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30 animate-pulse">
          UPLINK ACTIVE
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">{status}</span>
          <span className="text-[11px] font-mono text-cyan-400 animate-pulse">● ● ●</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 rounded-full w-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
          <span>PIPELINE: {stage}</span>
          <span>LATENCY: 18ms</span>
        </div>
      </div>
    </div>
  );
};
