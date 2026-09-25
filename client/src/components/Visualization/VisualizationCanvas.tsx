import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step } from '../../services/api';
import { ArrowRight, Layers, Cpu, Sparkles, Terminal, Variable, Database } from 'lucide-react';

interface VisualizationCanvasProps {
  currentStep: Step | null;
  totalSteps: number;
  isAnalyzing: boolean;
}

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  currentStep,
  totalSteps,
  isAnalyzing
}) => {
  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl border border-slate-800 bg-slate-900/90">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-1">VisualCode AI Analyzing Execution...</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Simulating real-time memory state transitions, variable updates, and step-by-step logic.
        </p>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/90">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
          <Cpu className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-200 mb-2">Ready to Visualize</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Select code from the editor on the left or load a sample program, then click <strong className="text-indigo-400">Visualize</strong> to watch live step-by-step tracing.
        </p>
      </div>
    );
  }

  const variables = currentStep.variables || {};
  const variableEntries = Object.entries(variables);
  const changedVars = currentStep.changed_variables || [];
  const stack = currentStep.stack || ['main()'];

  // Extract array variables for interactive array view
  const arrayEntries = variableEntries.filter(([_, val]) => Array.isArray(val));
  
  // Find active loop index variable e.g. 'i' or 'j'
  const activeLoopIndexVar = variableEntries.find(([k, v]) => typeof v === 'number' && ['i', 'j', 'k', 'idx', 'index'].includes(k));
  const activeIndexVal = activeLoopIndexVar ? Number(activeLoopIndexVar[1]) : null;

  return (
    <div className="h-full flex flex-col gap-3.5 overflow-y-auto pr-1">
      {/* 1. Active Executing Line Banner */}
      <motion.div
        key={`pointer-${currentStep.step}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-3.5 rounded-2xl border-l-4 border-indigo-500 relative overflow-hidden bg-slate-900/95 shadow-xl flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Line {currentStep.line} Executing
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentStep.type || 'statement'}
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              Step {currentStep.step} of {totalSteps}
            </span>
          </div>
        </div>
        <div className="font-mono text-sm bg-slate-950 text-cyan-300 p-3 rounded-xl border border-slate-800 overflow-x-auto shadow-inner">
          <span className="text-slate-500 select-none mr-2 font-bold">{currentStep.line} |</span>
          <code className="font-semibold">{currentStep.code}</code>
        </div>
      </motion.div>

      {/* 2. Interactive Array Visualizer Grid */}
      {arrayEntries.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 shadow-lg flex-shrink-0">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            Array Data Structure View
          </h4>
          <div className="flex flex-col gap-4">
            {arrayEntries.map(([arrName, arrVal]) => (
              <div key={arrName} className="flex flex-col gap-1.5">
                <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-indigo-400 font-extrabold">{arrName}[]</span>
                  <span className="text-[10px] text-slate-400 font-semibold">(length: {(arrVal as any[]).length})</span>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-2 pb-1">
                  {(arrVal as any[]).map((elem, idx) => {
                    const isElementActive = activeIndexVal === idx;
                    return (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`relative flex flex-col items-center justify-between min-w-[54px] h-14 rounded-xl border font-mono transition-all duration-200 ${
                          isElementActive
                            ? 'bg-gradient-to-b from-indigo-600 to-cyan-600 border-cyan-300 text-white font-extrabold shadow-xl shadow-cyan-500/30 scale-105 ring-2 ring-cyan-400'
                            : 'bg-slate-950 border-slate-800 text-slate-200'
                        }`}
                      >
                        <span className="text-base font-bold my-auto">{String(elem)}</span>
                        <span className="text-[9px] font-bold text-slate-400 border-t border-slate-800/80 w-full text-center py-0.5 bg-slate-900/80 rounded-b-xl">
                          [{idx}]
                        </span>

                        {/* Active Pointer Arrow */}
                        {isElementActive && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-sans font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-lg animate-bounce flex items-center gap-0.5">
                            <span>{activeLoopIndexVar ? activeLoopIndexVar[0] : 'ptr'} = {idx}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Memory Scope Variables Panel (Spacious Vertical Layout) */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex-1 flex flex-col min-h-[220px] bg-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800 flex-shrink-0">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Variable className="w-4 h-4 text-cyan-400" />
            Memory State Scope ({variableEntries.length} Variables)
          </h4>
          {changedVars.length > 0 && (
            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
              Modified: {changedVars.join(', ')}
            </span>
          )}
        </div>

        {variableEntries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-400 italic py-8">
            <Database className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
            <span>No active variables declared in memory scope at this step.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1">
            <AnimatePresence mode="popLayout">
              {variableEntries.map(([key, value]) => {
                const isChanged = changedVars.includes(key);
                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      isChanged
                        ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border-indigo-400 shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-mono font-extrabold text-slate-200">{key}</span>
                      {isChanged && (
                        <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 bg-indigo-500 text-white rounded shadow-sm">
                          UPDATED
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm font-extrabold text-cyan-300 truncate">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 4. Live Console Print Output Banner */}
      {currentStep.output && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 text-xs flex items-center justify-between shadow-xl flex-shrink-0"
        >
          <div className="flex items-center gap-2 overflow-x-auto">
            <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-bold text-emerald-300 flex-shrink-0">Console Output:</span>
            <code className="font-mono bg-slate-950 px-3 py-1 rounded-lg text-emerald-300 font-extrabold border border-emerald-800/50">
              {currentStep.output}
            </code>
          </div>
        </motion.div>
      )}

      {/* 5. Call Stack & Next Action Indicator Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-shrink-0">
        {/* Call Stack Frame */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800 bg-slate-900/90">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Call Stack Frame
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stack.map((frame, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-bold"
              >
                {frame}
              </span>
            ))}
          </div>
        </div>

        {/* Next Action Indicator */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800 bg-slate-900/90">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            Next Action
          </div>
          <p className="text-xs font-semibold text-slate-200 line-clamp-1">
            {currentStep.next_action || 'Proceeding to next statement execution.'}
          </p>
        </div>
      </div>
    </div>
  );
};
