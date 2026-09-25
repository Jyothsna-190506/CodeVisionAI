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
      <div className="h-full flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-border-pearl bg-white shadow-sm">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-terracotta/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-terracotta border-r-orange-warm border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-terracotta animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg font-black text-charcoal mb-1">VisualCode AI Analyzing Execution...</h3>
        <p className="text-xs text-secondary-text max-w-xs font-medium">
          Simulating real-time memory state transitions, variable updates, and step-by-step logic.
        </p>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-border-pearl bg-white shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mb-4 text-terracotta">
          <Cpu className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-charcoal mb-2">Ready to Visualize</h3>
        <p className="text-xs text-secondary-text max-w-sm mb-4 font-medium leading-relaxed">
          Select code from the editor on the left or load a sample program, then click <strong className="text-terracotta">Visualize</strong> to watch live step-by-step tracing.
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
        className="p-4 rounded-3xl border-l-4 border-terracotta relative overflow-hidden bg-white border border-border-pearl shadow-sm flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-terracotta flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-terracotta" />
            Line {currentStep.line} Executing
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20 font-mono">
              {currentStep.type || 'statement'}
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-secondary-card text-charcoal border border-border-pearl">
              Step {currentStep.step} of {totalSteps}
            </span>
          </div>
        </div>
        <div className="font-mono text-sm bg-pearl text-charcoal p-3 rounded-2xl border border-border-pearl overflow-x-auto shadow-inner">
          <span className="text-secondary-text select-none mr-2 font-bold">{currentStep.line} |</span>
          <code className="font-bold">{currentStep.code}</code>
        </div>
      </motion.div>

      {/* 2. Interactive Array Visualizer Grid */}
      {arrayEntries.length > 0 && (
        <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm flex-shrink-0">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-charcoal mb-3 flex items-center gap-1.5 font-mono">
            <Layers className="w-4 h-4 text-terracotta" />
            Array Data Structure View
          </h4>
          <div className="flex flex-col gap-4">
            {arrayEntries.map(([arrName, arrVal]) => (
              <div key={arrName} className="flex flex-col gap-1.5">
                <div className="text-xs font-mono font-bold text-charcoal flex items-center gap-2">
                  <span className="text-terracotta font-black">{arrName}[]</span>
                  <span className="text-[10px] text-secondary-text font-semibold">(length: {(arrVal as any[]).length})</span>
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
                        className={`relative flex flex-col items-center justify-between min-w-[54px] h-14 rounded-2xl border font-mono transition-all duration-200 ${
                          isElementActive
                            ? 'bg-terracotta border-terracotta text-white font-black shadow-md shadow-terracotta/20 scale-105'
                            : 'bg-pearl border-border-pearl text-charcoal font-bold'
                        }`}
                      >
                        <span className="text-base font-black my-auto">{String(elem)}</span>
                        <span className={`text-[9px] font-bold border-t w-full text-center py-0.5 rounded-b-2xl ${
                          isElementActive ? 'border-white/20 text-white/80 bg-black/10' : 'border-border-pearl text-secondary-text bg-secondary-card'
                        }`}>
                          [{idx}]
                        </span>

                        {/* Active Pointer Arrow */}
                        {isElementActive && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime-digital text-charcoal font-sans font-black text-[9px] px-2 py-0.5 rounded-full shadow-md animate-bounce flex items-center gap-0.5 border border-lime-700/20">
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
      <div className="p-5 rounded-3xl border border-border-pearl flex-1 flex flex-col min-h-[220px] bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-border-pearl flex-shrink-0">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-charcoal flex items-center gap-2 font-mono">
            <Variable className="w-4 h-4 text-terracotta" />
            Memory State Scope ({variableEntries.length} Variables)
          </h4>
          {changedVars.length > 0 && (
            <span className="text-[10px] font-black text-lime-800 bg-lime-digital/25 px-2.5 py-0.5 rounded-full border border-lime-digital/40">
              Modified: {changedVars.join(', ')}
            </span>
          )}
        </div>

        {variableEntries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-xs text-secondary-text italic py-8">
            <Database className="w-8 h-8 text-secondary-text mb-2 opacity-30" />
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
                    className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                      isChanged
                        ? 'bg-terracotta/10 border-terracotta text-charcoal shadow-sm'
                        : 'bg-pearl border-border-pearl hover:border-terracotta/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-mono font-black text-charcoal">{key}</span>
                      {isChanged && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-terracotta text-white rounded-full shadow-sm font-mono">
                          UPDATED
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm font-black text-charcoal truncate">
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
          className="p-3.5 rounded-2xl border border-lime-digital/40 bg-lime-digital/15 text-charcoal text-xs flex items-center justify-between shadow-sm flex-shrink-0"
        >
          <div className="flex items-center gap-2 overflow-x-auto">
            <Terminal className="w-4 h-4 text-lime-700 flex-shrink-0" />
            <span className="font-black text-charcoal flex-shrink-0">Console Output:</span>
            <code className="font-mono bg-white px-3 py-1 rounded-xl text-charcoal font-black border border-border-pearl">
              {currentStep.output}
            </code>
          </div>
        </motion.div>
      )}

      {/* 5. Call Stack & Next Action Indicator Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-shrink-0">
        {/* Call Stack Frame */}
        <div className="p-4 rounded-2xl border border-border-pearl bg-white shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-secondary-text mb-1.5 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-terracotta" />
            Call Stack Frame
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stack.map((frame, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary-card border border-border-pearl text-charcoal font-bold"
              >
                {frame}
              </span>
            ))}
          </div>
        </div>

        {/* Next Action Indicator */}
        <div className="p-4 rounded-2xl border border-border-pearl bg-white shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-secondary-text mb-1.5 flex items-center gap-1.5 font-mono">
            <ArrowRight className="w-3.5 h-3.5 text-orange-warm" />
            Next Action
          </div>
          <p className="text-xs font-bold text-charcoal line-clamp-1">
            {currentStep.next_action || 'Proceeding to next statement execution.'}
          </p>
        </div>
      </div>
    </div>
  );
};
