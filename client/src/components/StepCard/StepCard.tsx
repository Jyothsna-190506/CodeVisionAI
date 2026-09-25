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
      <div className="h-full p-6 rounded-3xl border border-border-pearl bg-white shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mb-3 text-terracotta">
          <Bot className="w-7 h-7" />
        </div>
        <h3 className="text-base font-black text-charcoal mb-1">AI Explanation Engine</h3>
        <p className="text-xs text-secondary-text max-w-xs font-medium">
          Step-by-step line explanations and complexity insights powered by CodeVision AI will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-1">
      {/* Top Header Card: Summary & Final Result Output */}
      {summary && (summary.time_complexity || summary.title || summary.final_result) && (
        <div className="p-4 rounded-3xl border border-border-pearl bg-white shadow-sm flex flex-col gap-2">
          <h4 className="text-xs font-black text-charcoal uppercase tracking-wider font-mono">
            {summary.title || 'Algorithm Summary'}
          </h4>
          {summary.description && (
            <p className="text-xs text-secondary-text leading-relaxed font-medium">
              {summary.description}
            </p>
          )}

          {/* Final Calculated Result Output Banner */}
          {summary.final_result && (
            <div className="p-3 rounded-2xl bg-lime-digital/20 border border-lime-digital/40 text-lime-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-700 flex-shrink-0" />
              <span>{summary.final_result}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-[11px] font-mono mt-1">
            {summary.time_complexity && (
              <span className="flex items-center gap-1 text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded-full border border-terracotta/20 font-bold">
                <Clock className="w-3 h-3 text-terracotta" /> Time: {summary.time_complexity}
              </span>
            )}
            {summary.space_complexity && (
              <span className="flex items-center gap-1 text-orange-warm bg-orange-warm/10 px-2.5 py-0.5 rounded-full border border-orange-warm/20 font-bold">
                <HardDrive className="w-3 h-3 text-orange-warm" /> Space: {summary.space_complexity}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main AI Explanation Box */}
      <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm flex-1 flex flex-col gap-3">
        {/* Step Badge & Type */}
        <div className="flex items-center justify-between pb-2 border-b border-border-pearl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-xl bg-terracotta text-white shadow-sm shadow-terracotta/20">
              Step {step.step} of {totalSteps}
            </span>
            <span className="text-xs font-bold text-charcoal uppercase tracking-wide font-mono">
              {step.type || 'Execution'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-secondary-text font-bold">
            Line {step.line}
          </span>
        </div>

        {/* Executed Code Snippet */}
        <div className="bg-pearl p-3 rounded-2xl border border-border-pearl font-mono text-xs text-charcoal">
          <span className="text-secondary-text font-sans mr-2 text-[10px] font-bold">Executing:</span>
          <code className="text-charcoal font-black">{step.code}</code>
        </div>

        {/* AI Detailed Explanation */}
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[11px] font-black text-secondary-text uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Bot className="w-3.5 h-3.5 text-terracotta" />
            AI Breakdown
          </label>
          <div className="bg-ivory p-3.5 rounded-2xl border border-border-pearl text-xs text-charcoal leading-relaxed font-medium">
            {step.explanation}
          </div>
        </div>

        {/* Current Variables Delta Table */}
        <div>
          <label className="text-[11px] font-black text-secondary-text uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-orange-warm" />
            Variable Values
          </label>
          <div className="bg-pearl rounded-2xl border border-border-pearl overflow-hidden">
            {Object.keys(step.variables || {}).length === 0 ? (
              <div className="p-3 text-[11px] text-secondary-text italic text-center font-medium">
                No variables in scope.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-secondary-card text-secondary-text font-bold border-b border-border-pearl">
                  <tr>
                    <th className="p-2 px-3">Variable</th>
                    <th className="p-2 px-3">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-pearl">
                  {Object.entries(step.variables).map(([k, v]) => {
                    const isChanged = step.changed_variables?.includes(k);
                    return (
                      <tr key={k} className={isChanged ? 'bg-terracotta/10 text-charcoal font-black' : 'text-charcoal'}>
                        <td className="p-2 px-3 font-bold">{k}</td>
                        <td className="p-2 px-3">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</td>
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
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2 font-medium">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{step.complexity_note}</span>
          </div>
        )}
      </div>
    </div>
  );
};
