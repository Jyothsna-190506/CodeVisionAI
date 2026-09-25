import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Code2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Activity,
  GitFork,
  Binary,
  Network,
  Bug,
  Lock,
  GitBranch,
  Play,
  FileCode,
  Check,
  ChevronRight,
  MessageSquare,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { ThreeBackground } from '../../components/ThreeUI/ThreeBackground';
import { GlassAIButton } from '../../components/ThreeUI/GlassAIButton';
import { CodeIntelligenceCore } from '../../components/Three3D/CodeIntelligenceCore';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activePerspective, setActivePerspective] = useState<number>(0);

  const pipelineStages = [
    { name: 'SOURCE CODE', desc: 'Raw C++, Python, Java or JS file parsing', status: 'ready', color: 'border-charcoal-muted/30 text-charcoal' },
    { name: 'AI ENGINE', desc: 'Multi-provider LLM token reasoning', status: 'processing', color: 'border-terracotta bg-terracotta-light text-terracotta' },
    { name: 'ANALYSIS', desc: 'Cyclomatic complexity & bug audit', status: 'success', color: 'border-lime-digital bg-lime-soft text-charcoal' },
    { name: 'VISUALIZATION', desc: 'AST tree & control flow generation', status: 'success', color: 'border-lime-digital bg-lime-soft text-charcoal' },
    { name: 'INSIGHT', desc: 'Actionable Big-O and refactoring report', status: 'complete', color: 'border-terracotta text-terracotta' },
  ];

  const perspectives = [
    { title: 'AI Explanation', desc: '11-section architectural breakdown explaining loops, functions, variables, and Big-O bounds.', icon: Sparkles },
    { title: 'Execution Flow', desc: 'Interactive step-by-step trace observing stack variables and memory allocations.', icon: Terminal },
    { title: 'Complexity', desc: 'Mathematical proof of asymptotic time and space upper bounds.', icon: Activity },
    { title: 'Bug Detection', desc: 'Static pattern matching for bounds overflows, leakage, and unhandled branches.', icon: Bug },
    { title: 'Optimization', desc: 'Side-by-side refactoring proposals leveraging modern idioms and SIMD reduction.', icon: Zap },
    { title: 'AST Visualizer', desc: 'Hierarchical syntax parse tree with node inspector and JSON export.', icon: Binary },
    { title: 'Call Graph', desc: 'Caller/callee invocation networks and recursion trees.', icon: Network },
    { title: 'Test Cases', desc: 'Automated unit test suite with normal, boundary, and edge assertions.', icon: CheckCircle2 },
  ];

  const languages = [
    { name: 'C++', icon: '⚡' },
    { name: 'Python', icon: '🐍' },
    { name: 'Java', icon: '☕' },
    { name: 'JavaScript', icon: '🟨' },
    { name: 'TypeScript', icon: '🔷' },
    { name: 'Go', icon: '🐹' },
    { name: 'Rust', icon: '🦀' },
    { name: 'C#', icon: '🟣' },
    { name: 'SQL', icon: '🗄️' },
    { name: 'Kotlin', icon: '🎯' },
    { name: 'Swift', icon: '🕊️' },
    { name: 'PHP', icon: '🐘' },
    { name: 'Ruby', icon: '💎' },
  ];

  const howItWorks = [
    {
      num: '01',
      title: 'PASTE CODE',
      desc: 'Import or paste source code in any major programming language into our clean, light Monaco IDE.',
      tag: 'Input Layer',
    },
    {
      num: '02',
      title: 'AI ANALYZES',
      desc: 'Our dual-engine pipeline runs AST lexical parsing alongside real LLM reasoning models.',
      tag: 'Intelligence Core',
    },
    {
      num: '03',
      title: 'UNDERSTAND & IMPROVE',
      desc: 'Read structured explanations, step through memory traces, view flowcharts, and ask the AI follow-up questions.',
      tag: 'Actionable Mastery',
    },
  ];

  return (
    <div className="min-h-screen bg-pearl text-charcoal flex flex-col font-sans relative overflow-x-hidden selection:bg-terracotta/20 selection:text-terracotta">
      {/* ThreeUI Subtle Pearl Background Particles */}
      <ThreeBackground opacity={0.5} />

      {/* 1. FLOATING PEARL GLASS NAVBAR */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto w-[94%] pearl-dock rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-terracotta to-orange-warm p-0.5 shadow-pearl-sm flex items-center justify-center">
            <div className="w-full h-full bg-ivory rounded-[9px] flex items-center justify-center">
              <Code2 className="w-4 h-4 text-terracotta" />
            </div>
          </div>
          <span className="text-sm font-black tracking-tight text-charcoal flex items-center gap-1">
            CodeVision <span className="text-terracotta font-extrabold">AI</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-charcoal-muted">
          <a href="#pipeline" className="hover:text-terracotta transition-colors">Pipeline</a>
          <a href="#perspectives" className="hover:text-terracotta transition-colors">Perspectives</a>
          <a href="#explanation" className="hover:text-terracotta transition-colors">AI Explanation</a>
          <a href="#assistant" className="hover:text-terracotta transition-colors">AI Assistant</a>
          <a href="#languages" className="hover:text-terracotta transition-colors">Languages</a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-charcoal hover:bg-ivory-warm transition-colors"
          >
            Sign In
          </Link>
          <Link to="/register">
            <GlassAIButton size="sm" variant="primary">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </GlassAIButton>
          </Link>
        </div>
      </header>

      {/* 2. HERO: PEARL CODE LAB SPACIOUS 3D HERO */}
      <section className="relative z-10 pt-16 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border-pearl shadow-pearl-sm text-terracotta text-xs font-mono font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>AI CODE INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-charcoal">
              Understand Code.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta via-orange-warm to-terracotta block">
                See It Think.
              </span>
            </h1>

            <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              CodeVision AI transforms source code into explanations, execution flows, visual structures, quality insights, and actionable improvements.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link to="/editor">
                <GlassAIButton size="lg" variant="primary">
                  <Play className="w-4 h-4 fill-white" />
                  <span>Analyze Your Code</span>
                </GlassAIButton>
              </Link>
              <Link to="/login">
                <GlassAIButton size="lg" variant="subtle">
                  <span>Explore Platform</span>
                  <ChevronRight className="w-4 h-4 text-charcoal-muted" />
                </GlassAIButton>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs font-mono text-charcoal-muted">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-lime-digital" /> Multi-Language AST
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-terracotta" /> Real Memory Traces
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-orange-warm" /> Zero Mock Data
              </div>
            </div>
          </div>

          {/* Right Hero: 3D Code Intelligence Core */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <CodeIntelligenceCore />
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: FROM CODE TO UNDERSTANDING (3D PIPELINE) */}
      <section id="pipeline" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-border-pearl">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono uppercase font-bold text-terracotta tracking-wider">
            Execution Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal">From Code to Understanding.</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            A continuous computational pipeline turning static characters into dynamic multidimensional insight.
          </p>
        </div>

        {/* 5-Stage Floating Node Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className={`pearl-card p-5 rounded-2xl border ${stage.color} space-y-2 hover:scale-105 transition-all shadow-pearl-sm`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal-muted">
                  0{idx + 1}
                </span>
                <span className="w-2 h-2 rounded-full bg-current opacity-75 animate-pulse" />
              </div>
              <h3 className="text-sm font-black tracking-tight">{stage.name}</h3>
              <p className="text-xs opacity-80 leading-relaxed font-normal">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECTION 3: ONE CODEBASE. EVERY PERSPECTIVE. */}
      <section id="perspectives" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-border-pearl">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono uppercase font-bold text-orange-warm tracking-wider">
            Complete Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal">One Codebase. Every Perspective.</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            Inspect your software through 8 synchronized structural lenses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perspectives.map((p, idx) => {
            const Icon = p.icon;
            const isHovered = activePerspective === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActivePerspective(idx)}
                className={`pearl-card p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isHovered ? 'border-terracotta shadow-pearl-md scale-[1.02] bg-white' : 'border-border-pearl hover:border-border-warm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHovered ? 'bg-terracotta text-white' : 'bg-ivory-warm text-charcoal'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-charcoal-muted font-bold">0{idx + 1}</span>
                </div>
                <h3 className="text-sm font-bold text-charcoal">{p.title}</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SECTION 4: AI CODE EXPLANATION (LIGHT SPLIT INTERFACE) */}
      <section id="explanation" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-border-pearl">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase font-bold text-terracotta tracking-wider">
            Natural Language Reasoning
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal">AI Code Explanation</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            Translates complex logic, nested loops, and memory boundaries into structured human comprehension.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Light Monaco-Style Code Editor Preview */}
          <div className="lg:col-span-6 pearl-card p-5 rounded-2xl border border-border-warm shadow-pearl-md flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-pearl text-xs font-mono text-charcoal-muted">
              <span className="font-bold text-charcoal">calculateTotal.js</span>
              <span className="text-terracotta">JavaScript / TypeScript</span>
            </div>

            <pre className="font-mono text-xs text-charcoal leading-relaxed p-4 rounded-xl bg-ivory-warm border border-border-pearl overflow-x-auto">
              <span className="text-terracotta font-bold">function</span> <span className="text-charcoal font-bold">calculateTotal</span>(items) &#123;{'\n'}
              {'    '}<span className="text-terracotta font-bold">let</span> total = <span className="text-orange-warm">0</span>;{'\n\n'}
              {'    '}<span className="text-terracotta font-bold">for</span> (<span className="text-terracotta font-bold">const</span> item <span className="text-terracotta font-bold">of</span> items) &#123;{'\n'}
              {'        '}total += item.price;{'\n'}
              {'    '}&#125;{'\n\n'}
              {'    '}<span className="text-terracotta font-bold">return</span> total;{'\n'}
              &#125;
            </pre>

            <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-muted">
              <span>Lines: 9</span>
              <span>Memory: 1 Scalar Register</span>
            </div>
          </div>

          {/* Right: AI Explanation Panel */}
          <div className="lg:col-span-6 pearl-glass p-6 rounded-2xl border border-border-warm shadow-pearl-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border-pearl">
                <span className="text-xs font-bold text-terracotta font-mono uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI EXPLANATION
                </span>
                <span className="px-2 py-0.5 rounded-full bg-lime-soft text-charcoal text-[10px] font-bold">
                  Verified Analysis
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold font-mono text-charcoal uppercase tracking-wider">Overview</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  The function iterates linearly across an array of objects, aggregating individual numeric <code className="text-terracotta font-mono font-bold">price</code> properties into an accumulator.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-ivory-warm border border-border-pearl space-y-0.5">
                  <span className="text-[10px] font-mono text-charcoal-muted uppercase block">Time Complexity</span>
                  <span className="text-sm font-black font-mono text-terracotta">O(n) Linear</span>
                </div>
                <div className="p-3 rounded-xl bg-ivory-warm border border-border-pearl space-y-0.5">
                  <span className="text-[10px] font-mono text-charcoal-muted uppercase block">Auxiliary Space</span>
                  <span className="text-sm font-black font-mono text-charcoal">O(1) Constant</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/editor">
                <GlassAIButton size="sm" variant="primary" className="w-full">
                  <span>Test with your own source code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </GlassAIButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 5: VISUAL EXECUTION FLOWCHART */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-border-pearl">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase font-bold text-lime-digital tracking-wider">
            Flow Visualizer
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal">Visual Execution Architecture</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            Live flowcharts tracking sequential instruction pulses.
          </p>
        </div>

        <div className="pearl-glass p-8 rounded-3xl border border-border-warm shadow-pearl-lg max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold text-charcoal">
            <div className="px-4 py-2.5 rounded-xl bg-white border border-border-pearl shadow-pearl-sm">
              INPUT (items)
            </div>
            <span className="text-terracotta font-bold text-base">→</span>
            <div className="px-4 py-2.5 rounded-xl bg-white border border-border-pearl shadow-pearl-sm">
              INITIALIZE (total = 0)
            </div>
            <span className="text-terracotta font-bold text-base">→</span>
            <div className="px-4 py-2.5 rounded-xl bg-terracotta-light border border-terracotta text-terracotta shadow-pearl-sm">
              ITERATE (for item of items)
            </div>
            <span className="text-terracotta font-bold text-base">→</span>
            <div className="px-4 py-2.5 rounded-xl bg-white border border-border-pearl shadow-pearl-sm">
              PROCESS (total += price)
            </div>
            <span className="text-terracotta font-bold text-base">→</span>
            <div className="px-4 py-2.5 rounded-xl bg-lime-soft border border-lime-digital text-charcoal shadow-pearl-sm">
              OUTPUT (return total)
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 6: CODE QUALITY (LARGE EDITORIAL STATISTICS) */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-border-pearl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="pearl-card p-8 rounded-3xl border border-border-pearl space-y-2 shadow-pearl-sm">
            <div className="text-5xl sm:text-6xl font-black font-mono text-terracotta">92</div>
            <div className="text-xs font-bold font-mono tracking-widest text-charcoal-muted uppercase">
              QUALITY SCORE
            </div>
          </div>

          <div className="pearl-card p-8 rounded-3xl border border-border-pearl space-y-2 shadow-pearl-sm">
            <div className="text-5xl sm:text-6xl font-black font-mono text-charcoal">O(n)</div>
            <div className="text-xs font-bold font-mono tracking-widest text-charcoal-muted uppercase">
              COMPLEXITY BOUND
            </div>
          </div>

          <div className="pearl-card p-8 rounded-3xl border border-border-pearl space-y-2 shadow-pearl-sm">
            <div className="text-5xl sm:text-6xl font-black font-mono text-orange-warm">01</div>
            <div className="text-xs font-bold font-mono tracking-widest text-charcoal-muted uppercase">
              AUDIT WARNING
            </div>
          </div>

          <div className="pearl-card p-8 rounded-3xl border border-border-pearl space-y-2 shadow-pearl-sm">
            <div className="text-5xl sm:text-6xl font-black font-mono text-charcoal">24</div>
            <div className="text-xs font-bold font-mono tracking-widest text-charcoal-muted uppercase">
              AST FUNCTIONS
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION 7: AI ASSISTANT (LIGHT GLASS CHAT INTERFACE) */}
      <section id="assistant" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-border-pearl">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase font-bold text-terracotta tracking-wider">
            Conversational Co-Pilot
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal">Project-Aware AI Assistant</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            Maintains multi-turn context across your entire project and active source code.
          </p>
        </div>

        <div className="pearl-glass p-6 rounded-3xl border border-border-warm shadow-pearl-lg max-w-2xl mx-auto space-y-4">
          {/* Chat Messages */}
          <div className="space-y-3">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="p-3.5 rounded-2xl rounded-tr-sm bg-terracotta text-white text-xs max-w-md shadow-pearl-sm font-medium">
                Why is this loop O(n)?
              </div>
            </div>

            {/* AI Assistant Message */}
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl rounded-tl-sm bg-white border border-border-pearl text-xs max-w-md shadow-pearl-sm text-charcoal space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-terracotta uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> CodeVision AI Assistant
                </div>
                <p className="leading-relaxed">
                  The loop visits each element in <code className="font-mono text-terracotta bg-ivory-warm px-1 rounded">items</code> exactly once, executing constant-time $O(1)$ addition on each cycle. The operation count scales directly in proportion to array size $n$.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border-pearl text-[11px] font-mono">
            {['Explain Code', 'Find Bugs', 'Optimize', 'Complexity', 'Generate Tests'].map((chip, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-ivory-warm border border-border-pearl text-charcoal-muted hover:text-terracotta cursor-pointer transition-colors"
              >
                "{chip}"
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SECTION 8: LANGUAGE CONSTELLATION */}
      <section id="languages" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-border-pearl">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase font-bold text-orange-warm tracking-wider">
            Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal">Multi-Language Constellation</h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {languages.map((lang, idx) => (
            <div
              key={idx}
              className="px-5 py-3 rounded-2xl pearl-card border border-border-pearl shadow-pearl-sm text-xs font-bold text-charcoal hover:border-terracotta hover:scale-105 transition-all flex items-center gap-2 cursor-default"
            >
              <span>{lang.icon}</span>
              <span>{lang.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 10. SECTION 9: HOW IT WORKS (3 HUGE 3D STAGES) */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-border-pearl">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono uppercase font-bold text-terracotta tracking-wider">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal">Three Simple Stages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorks.map((hw, idx) => (
            <div
              key={idx}
              className="pearl-card p-8 rounded-3xl border border-border-pearl shadow-pearl-md space-y-4 hover:scale-105 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black font-mono text-terracotta">{hw.num}</span>
                <span className="text-[10px] font-mono text-charcoal-muted uppercase bg-ivory-warm px-2 py-0.5 rounded border border-border-pearl">
                  {hw.tag}
                </span>
              </div>
              <h3 className="text-lg font-black text-charcoal">{hw.title}</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">{hw.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto w-full text-center space-y-6">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-charcoal">
          Your Code Has More to Say.
        </h2>
        <p className="text-sm sm:text-base text-charcoal-muted max-w-lg mx-auto">
          Let AI turn source code into deep, actionable understanding.
        </p>
        <div className="pt-2">
          <Link to="/register">
            <GlassAIButton size="lg" variant="primary">
              <Play className="w-4 h-4 fill-white" />
              <span>START ANALYZING</span>
            </GlassAIButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-pearl py-12 px-6 bg-ivory">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-terracotta" />
            <span className="font-bold text-charcoal">CodeVision AI</span>
            <span>— Pearl Code Lab Release</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-terracotta">Sign In</Link>
            <Link to="/register" className="hover:text-terracotta">Register</Link>
            <Link to="/editor" className="hover:text-terracotta">IDE</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
