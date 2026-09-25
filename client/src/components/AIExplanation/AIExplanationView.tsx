import React from 'react';
import { AIExplanationData } from '../../types';
import {
  Sparkles,
  BookOpen,
  Code2,
  Clock,
  Layers,
  Database,
  Cpu,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface AIExplanationViewProps {
  explanation?: AIExplanationData;
  language?: string;
  onAskAIAboutSection?: (prompt: string) => void;
}

export const AIExplanationView: React.FC<AIExplanationViewProps> = ({
  explanation,
  language = 'cpp',
  onAskAIAboutSection,
}) => {
  if (!explanation) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center text-xs text-slate-400">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
        <p>No structured AI explanation available. Please run code analysis in the editor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Code Overview Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-cyan-950/20 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>1. Code Overview</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-cyan-300 text-[10px] uppercase font-bold font-mono border border-indigo-500/30">
            {language}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          {explanation.overview}
        </p>
      </div>

      {/* 2. How the Code Works */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>2. How the Code Works (Execution Flow)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">{explanation.howItWorks}</p>
      </div>

      {/* 3. Step-by-Step Explanation */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>3. Step-by-Step Logic Breakdown</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">
            {explanation.stepByStep?.length || 0} Key Milestones
          </span>
        </div>

        <div className="space-y-3">
          {explanation.stepByStep?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-indigo-500/40 transition-colors"
            >
              <span className="w-6 h-6 rounded-xl bg-indigo-600/30 text-cyan-300 border border-indigo-500/40 flex items-center justify-center font-bold font-mono text-[11px] flex-shrink-0 mt-0.5">
                {item.step || idx + 1}
              </span>
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-bold text-slate-200 mb-0.5">{item.title}</div>
                <p className="text-slate-400 leading-relaxed">{item.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 & 5. Functions & Key Variables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Functions Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>4. Functions & Methods</span>
          </h3>

          <div className="space-y-3">
            {explanation.functions?.map((fn, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-cyan-300 text-xs">{fn.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-indigo-300">
                    Returns: {fn.returnType || 'void'}
                  </span>
                </div>
                <p className="text-slate-300 leading-snug">{fn.purpose}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                  <span>Params: <strong className="text-slate-300">{fn.parameters || 'None'}</strong></span>
                  <span>Complexity: <strong className="text-emerald-400">{fn.complexity || 'O(1)'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variables Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span>5. Key Variables & State</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {explanation.variables?.map((v, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-amber-300">{v.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{v.type}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{v.purpose}</p>
                <span className="text-[10px] text-indigo-400 font-semibold block">{v.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6 & 7. Data Structures & Algorithm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">6. Data Structures Utilized</h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {explanation.dataStructures?.map((ds, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-300"
              >
                {ds}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">7. Algorithm & Pattern</h3>
          <div className="text-base font-extrabold text-indigo-300 pt-1">
            {explanation.algorithm}
          </div>
        </div>
      </div>

      {/* 8 & 9. Time & Space Complexity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>8. Time Complexity</span>
            </h3>
            <span className="text-xl font-black text-cyan-400 font-mono">
              {explanation.timeComplexity?.value || 'O(n)'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation.timeComplexity?.reason}
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>9. Space Complexity</span>
            </h3>
            <span className="text-xl font-black text-indigo-400 font-mono">
              {explanation.spaceComplexity?.value || 'O(1)'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation.spaceComplexity?.reason}
          </p>
        </div>
      </div>

      {/* 10 & 11. Potential Issues & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>10. Potential Issues & Boundary Risks</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {explanation.potentialIssues?.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            <span>11. Engineering Suggestions & Modern Idioms</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {explanation.suggestions?.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
