import React from 'react';
import { Cpu } from 'lucide-react';

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
    <div className={`p-6 rounded-2xl pearl-glass border border-border-pearl shadow-pearl-lg space-y-4 max-w-md mx-auto bg-white/95 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-border-pearl">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu className="w-4 h-4 text-terracotta animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-lime-digital animate-ping" />
          </div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-charcoal">
            ✦ Code Intelligence Core
          </span>
        </div>
        <span className="text-[10px] font-mono text-terracotta bg-terracotta-light px-2 py-0.5 rounded border border-terracotta/20 font-bold">
          PROCESSING
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-charcoal font-semibold">{status}</span>
          <span className="text-[11px] font-mono text-terracotta font-bold animate-pulse">● ● ●</span>
        </div>

        {/* Terracotta & Lime Progress Bar */}
        <div className="w-full h-1.5 bg-ivory-warm rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-terracotta via-orange-warm to-lime-digital rounded-full w-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-muted pt-1">
          <span>PIPELINE: {stage}</span>
          <span className="text-lime-digital font-bold font-mono">LATENCY: 12ms</span>
        </div>
      </div>
    </div>
  );
};
