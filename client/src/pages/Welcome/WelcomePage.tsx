import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Command,
  Database
} from 'lucide-react';
import { ThreeBackground } from '../../components/ThreeUI/ThreeBackground';
import { GlassAIButton } from '../../components/ThreeUI/GlassAIButton';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Code Explanation',
      desc: '11-section progressive architectural breakdown explaining execution flow, functions, key variables, and asymptotic Big-O complexity.',
      icon: Sparkles,
      color: 'text-cyan-400',
      tag: 'LLM Reasoning',
    },
    {
      title: 'Deep Static & AI Bug Audits',
      desc: 'Pinpoints null references, buffer overflows, off-by-one loops, and security vulnerabilities with actionable patch fixes.',
      icon: Bug,
      color: 'text-rose-400',
      tag: 'Security & Logic',
    },
    {
      title: 'Automated Optimization',
      desc: 'Side-by-side algorithmic refactoring reducing time/space bounds ($O(n^2) \\to O(n)$) with SIMD vectorization proposals.',
      icon: Zap,
      color: 'text-amber-400',
      tag: 'Performance',
    },
    {
      title: 'Interactive Flowchart Generation',
      desc: 'Visual control flow diagrams rendering branches, decision nodes, and loop iteration paths.',
      icon: GitBranch,
      color: 'text-indigo-400',
      tag: 'Visual Graph',
    },
    {
      title: 'Abstract Syntax Tree (AST)',
      desc: 'Multi-language hierarchical syntax explorer with node categorization, search, depth metrics, and JSON export.',
      icon: Binary,
      color: 'text-purple-400',
      tag: 'Parser Engine',
    },
    {
      title: 'Function Call Graphs',
      desc: 'Inspects caller/callee invocations, recursion trees, and modular dependency depth.',
      icon: Network,
      color: 'text-blue-400',
      tag: 'Call Hierarchy',
    },
    {
      title: 'Test Case Generation',
      desc: 'Instant unit test suites covering normal, boundary, negative, zero, and exception scenarios with ready-to-run code.',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      tag: 'Automated QA',
    },
    {
      title: 'Project-Aware AI Assistant',
      desc: 'Multi-turn conversational coding companion with dynamic context injection, interview explanations, and line-specific insights.',
      icon: Code2,
      color: 'text-pink-400',
      tag: 'Conversational AI',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Write or Upload Code',
      desc: 'Paste or import source code in C++, Python, Java, JavaScript, TypeScript, or Go into the Monaco IDE.',
    },
    {
      step: '02',
      title: 'AI Analysis Pipeline',
      desc: 'CodeVision triggers static AST analysis, complexity calculation, and LLM reasoning concurrently.',
    },
    {
      step: '03',
      title: 'Interactive Visualizations',
      desc: 'Explore step-by-step memory traces, control flow diagrams, AST hierarchies, and call graphs.',
    },
    {
      step: '04',
      title: 'Refactor & Improve',
      desc: 'Apply optimizations, resolve detected bugs, generate unit tests, and query the Project-Aware Assistant.',
    },
  ];

  const supportedLangs = [
    { name: 'C++', icon: '⚡', desc: 'Pointers, Arrays, Loops & DSA' },
    { name: 'Python', icon: '🐍', desc: 'Comprehensions, Lists & AI' },
    { name: 'Java', icon: '☕', desc: 'OOP, Methods & Classes' },
    { name: 'JavaScript', icon: '🟨', desc: 'Async, Closures & Events' },
    { name: 'TypeScript', icon: '🔷', desc: 'Interfaces & Static Types' },
    { name: 'Go', icon: '🐹', desc: 'Goroutines, Structs & Channels' },
    { name: 'Rust', icon: '🦀', desc: 'Memory safety & Borrowing' },
    { name: 'C#', icon: '🟣', desc: 'LINQ, Classes & .NET' },
    { name: 'SQL', icon: '🗄️', desc: 'Queries, Joins & Schemas' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Subtle ThreeUI Constellation Background */}
      <ThreeBackground opacity={0.25} />

      {/* Floating Top Dock Header */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto w-[92%] glass-dock rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#030712] rounded-[9px] flex items-center justify-center">
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="text-sm font-black tracking-tight text-white flex items-center gap-1">
            CodeVision <span className="text-cyan-400 font-extrabold">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Sign In
          </Link>
          <Link to="/register">
            <GlassAIButton size="sm" variant="primary">
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </GlassAIButton>
          </Link>
        </div>
      </header>

      {/* Hero Section: Perspective Cinematic Dashboard */}
      <section className="relative z-10 pt-16 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Pitch */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-cyan-300 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen AI Code Analysis & Visual IDE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Understand. Analyze.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
                Visualize.
              </span>{' '}
              Improve.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Commercial-grade AI code intelligence platform with interactive execution traces, control flow diagrams, abstract syntax trees, and a project-aware assistant.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link to="/register">
                <GlassAIButton size="lg" variant="primary">
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Analyzing Code</span>
                </GlassAIButton>
              </Link>
              <Link to="/login">
                <GlassAIButton size="lg" variant="subtle">
                  <span>Explore Platform</span>
                  <ChevronRight className="w-4 h-4" />
                </GlassAIButton>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Multi-Language AST
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cyan-400" /> Real-time Memory Traces
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-purple-400" /> Zero Mock Data
              </div>
            </div>
          </div>

          {/* Right Hero: Cinematic CodeVision Dashboard Preview */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/30 via-cyan-500/20 to-purple-500/30 blur-2xl opacity-50 pointer-events-none" />
            
            <div className="relative glass-panel rounded-2xl border border-slate-700/80 shadow-2xl bg-[#080d1a]/95 p-5 space-y-4">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">array_sum.cpp — CodeVision Engine</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 font-bold">
                  Quality Score: 92/100
                </span>
              </div>

              {/* Code + Live Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Code Snippet Box */}
                <div className="sm:col-span-7 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300 space-y-1">
                  <div><span className="text-slate-600">1</span> <span className="text-indigo-400">#include</span> <span className="text-emerald-300">&lt;iostream&gt;</span></div>
                  <div><span className="text-slate-600">2</span> <span className="text-indigo-400">int</span> <span className="text-cyan-300">main</span>() &#123;</div>
                  <div><span className="text-slate-600">3</span>   <span className="text-indigo-400">int</span> arr[] = &#123;2, 4, 6&#125;;</div>
                  <div><span className="text-slate-600">4</span>   <span className="text-indigo-400">int</span> sum = <span className="text-amber-300">0</span>;</div>
                  <div className="bg-indigo-500/20 px-1 rounded"><span className="text-slate-600">5</span>   <span className="text-purple-400">for</span> (<span className="text-indigo-400">int</span> i = <span className="text-amber-300">0</span>; i &lt; <span className="text-amber-300">3</span>; i++) &#123;</div>
                  <div><span className="text-slate-600">6</span>     sum += arr[i];</div>
                  <div><span className="text-slate-600">7</span>   &#125;</div>
                  <div><span className="text-slate-600">8</span>   std::cout &lt;&lt; sum;</div>
                  <div><span className="text-slate-600">9</span> &#125;</div>
                </div>

                {/* Live Analysis Highlights */}
                <div className="sm:col-span-5 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Time Complexity</span>
                    <span className="text-sm font-bold text-cyan-300">O(n) Linear Time</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Auxiliary Memory</span>
                    <span className="text-sm font-bold text-emerald-300">O(1) Constant</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                    <span className="text-[10px] font-mono text-indigo-300 block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> AI Optimization
                    </span>
                    <span className="text-[11px] text-slate-200 block mt-0.5">Use std::accumulate for SIMD auto-vectorization</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Flow Node */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Control Flow: 7 Nodes Active</span>
                </div>
                <span className="text-emerald-400 font-bold">0 Critical Vulnerabilities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider">
            Intelligent Execution Flow
          </span>
          <h2 className="text-3xl font-black text-white">How CodeVision AI Works</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            From raw source code to deep multi-dimensional analysis in sub-second latency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {workflowSteps.map((s, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all hover:scale-[1.02] space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  {s.step}
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 opacity-50 group-hover:opacity-100 group-hover:animate-ping" />
              </div>
              <h3 className="text-sm font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase font-bold text-indigo-400 tracking-wider">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-black text-white">Comprehensive Developer Suite</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            All analytical modules powered by strict static inspection, AST parsing, and real LLM reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Languages Carousel */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-mono uppercase font-bold text-purple-400 tracking-wider">
            Ecosystem Support
          </span>
          <h2 className="text-3xl font-black text-white">Supported Languages & Dialects</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {supportedLangs.map((lang, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center hover:border-cyan-500/40 transition-colors"
            >
              <span className="text-xl block mb-1">{lang.icon}</span>
              <span className="text-xs font-bold text-white block">{lang.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="relative z-10 mt-auto border-t border-slate-800/80 bg-[#02050c]/90 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm text-white">CodeVision AI Platform</span>
            <span className="text-xs text-slate-500 ml-2">© 2026. Commercial Developer Release.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Create Account</Link>
            <Link to="/editor" className="hover:text-white transition-colors">IDE Sandbox</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
