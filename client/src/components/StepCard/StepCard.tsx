import React from 'react';
import { Step, Summary } from '../../services/api';
import { Bot, Lightbulb, Zap, Clock, HardDrive, CheckCircle2 } from 'lucide-react';

interface StepCardProps {
  step: Step | null;
  summary?: Summary;
  totalSteps: number;
}

export const StepCard: React.FC<StepCardProps> = ({ step, summary, totalSteps }) => {
  if (!step) {
    return (
      <div className="h-full glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 text-cyan-400">
          <Bot className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-200 mb-1">AI Explanation Engine</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Step-by-step line explanations and complexity insights powered by VisualCode AI will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-1">
      {/* Top Header Card: Summary & Final Result Output */}
      {summary && (summary.time_complexity || summary.title || summary.final_result) && (
        <div className="glass-panel p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 flex flex-col gap-2">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            {summary.title || 'Algorithm Summary'}
          </h4>
          {summary.description && (
            <p className="text-xs text-slate-300 leading-relaxed">
              {summary.description}
            </p>
          )}

          {/* Final Calculated Result Output Banner */}
          {summary.final_result && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{summary.final_result}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-[11px] font-mono mt-1">
            {summary.time_complexity && (
              <span className="flex items-center gap-1 text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                <Clock className="w-3 h-3 text-cyan-400" /> Time: {summary.time_complexity}
              </span>
            )}
            {summary.space_complexity && (
              <span className="flex items-center gap-1 text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                <HardDrive className="w-3 h-3 text-indigo-400" /> Space: {summary.space_complexity}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main AI Explanation Box */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex-1 flex flex-col gap-3">
        {/* Step Badge & Type */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              Step {step.step} of {totalSteps}
            </span>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              {step.type || 'Execution'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Line {step.line}
          </span>
        </div>

        {/* Executed Code Snippet */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs text-indigo-200">
          <span className="text-slate-500 font-sans mr-2 text-[10px]">Executing:</span>
          <code className="text-amber-300 font-bold">{step.code}</code>
        </div>

        {/* AI Detailed Explanation */}
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            AI Breakdown
          </label>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed">
            {step.explanation}
          </div>
        </div>

        {/* Current Variables Delta Table */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Variable Values
          </label>
          <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            {Object.keys(step.variables || {}).length === 0 ? (
              <div className="p-2.5 text-[11px] text-slate-500 italic text-center">
                No variables in scope.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-1.5 px-3">Variable</th>
                    <th className="p-1.5 px-3">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {Object.entries(step.variables).map(([k, v]) => {
                    const isChanged = step.changed_variables?.includes(k);
                    return (
                      <tr key={k} className={isChanged ? 'bg-indigo-950/40 text-amber-300 font-bold' : 'text-slate-300'}>
                        <td className="p-1.5 px-3">{k}</td>
                        <td className="p-1.5 px-3">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Complexity / Memory Note */}
        {step.complexity_note && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{step.complexity_note}</span>
          </div>
        )}
      </div>
    </div>
  );
};
