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
} from 'lucide-react';

interface AIExplanationViewProps {
  explanation?: AIExplanationData;
  language?: string;
  onAskAIAboutSection?: (prompt: string) => void;
}

export const AIExplanationView: React.FC<AIExplanationViewProps> = ({
  explanation,
  language = 'cpp',
}) => {
  if (!explanation) {
    return (
      <div className="p-8 rounded-3xl border border-border-pearl bg-white text-center text-xs text-secondary-text shadow-sm">
        <Sparkles className="w-8 h-8 text-terracotta mx-auto mb-2" />
        <p>No structured AI explanation available. Please run code analysis in the editor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Code Overview Card */}
      <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-terracotta/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <h3 className="text-sm font-black text-charcoal flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span>1. Code Overview</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] uppercase font-bold font-mono border border-terracotta/20">
            {language}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-secondary-text leading-relaxed font-normal relative z-10">
          {explanation.overview}
        </p>
      </div>

      {/* 2. How the Code Works */}
      <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-terracotta" />
          <span>2. How the Code Works (Execution Flow)</span>
        </h3>
        <p className="text-xs text-secondary-text leading-relaxed">{explanation.howItWorks}</p>
      </div>

      {/* 3. Step-by-Step Explanation */}
      <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-warm" />
            <span>3. Step-by-Step Logic Breakdown</span>
          </h3>
          <span className="text-[10px] text-secondary-text font-mono">
            {explanation.stepByStep?.length || 0} Key Milestones
          </span>
        </div>

        <div className="space-y-3">
          {explanation.stepByStep?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-secondary-card/60 border border-border-pearl flex items-start gap-3 hover:border-terracotta/40 transition-colors"
            >
              <span className="w-6 h-6 rounded-xl bg-terracotta/10 text-terracotta border border-terracotta/20 flex items-center justify-center font-bold font-mono text-[11px] flex-shrink-0 mt-0.5">
                {item.step || idx + 1}
              </span>
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-bold text-charcoal mb-0.5">{item.title}</div>
                <p className="text-secondary-text leading-relaxed">{item.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 & 5. Functions & Key Variables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Functions Card */}
        <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
            <Code2 className="w-4 h-4 text-terracotta" />
            <span>4. Functions & Methods</span>
          </h3>

          <div className="space-y-3">
            {explanation.functions?.map((fn, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-secondary-card/50 border border-border-pearl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-terracotta text-xs">{fn.name}</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-border-pearl font-mono text-[10px] text-charcoal font-semibold">
                    Returns: {fn.returnType || 'void'}
                  </span>
                </div>
                <p className="text-secondary-text leading-snug">{fn.purpose}</p>
                <div className="flex items-center justify-between text-[11px] text-secondary-text pt-1 border-t border-border-pearl">
                  <span>Params: <strong className="text-charcoal">{fn.parameters || 'None'}</strong></span>
                  <span>Complexity: <strong className="text-lime-700 font-mono font-bold">{fn.complexity || 'O(1)'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variables Card */}
        <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
            <Database className="w-4 h-4 text-orange-warm" />
            <span>5. Key Variables & State</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {explanation.variables?.map((v, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-secondary-card/50 border border-border-pearl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-charcoal">{v.name}</span>
                  <span className="text-[10px] font-mono text-secondary-text">{v.type}</span>
                </div>
                <p className="text-[11px] text-secondary-text leading-snug">{v.purpose}</p>
                <span className="text-[10px] text-terracotta font-semibold block">{v.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6 & 7. Data Structures & Algorithm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-secondary-text uppercase font-mono">6. Data Structures Utilized</h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {explanation.dataStructures?.map((ds, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-secondary-card border border-border-pearl text-xs font-semibold text-charcoal"
              >
                {ds}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-secondary-text uppercase font-mono">7. Algorithm & Pattern</h3>
          <div className="text-base font-extrabold text-terracotta pt-1">
            {explanation.algorithm}
          </div>
        </div>
      </div>

      {/* 8 & 9. Time & Space Complexity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta" />
              <span>8. Time Complexity</span>
            </h3>
            <span className="text-xl font-black text-terracotta font-mono">
              {explanation.timeComplexity?.value || 'O(n)'}
            </span>
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            {explanation.timeComplexity?.reason}
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-warm" />
              <span>9. Space Complexity</span>
            </h3>
            <span className="text-xl font-black text-orange-warm font-mono">
              {explanation.spaceComplexity?.value || 'O(1)'}
            </span>
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            {explanation.spaceComplexity?.reason}
          </p>
        </div>
      </div>

      {/* 10 & 11. Potential Issues & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-terracotta flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-terracotta" />
            <span>10. Potential Issues & Boundary Risks</span>
          </h3>
          <ul className="space-y-2 text-xs text-secondary-text">
            {explanation.potentialIssues?.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-terracotta font-bold">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-lime-600" />
            <span>11. Engineering Suggestions & Modern Idioms</span>
          </h3>
          <ul className="space-y-2 text-xs text-secondary-text">
            {explanation.suggestions?.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 flex-shrink-0 mt-0.5" />
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
