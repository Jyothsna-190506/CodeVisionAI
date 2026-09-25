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
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Full AST & Code Metrics',
      desc: 'Deep multi-language AST parsing extracting cyclomatic complexity, Halstead maintainability index, and nesting depth.',
      icon: Binary,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'AI Step-by-Step Simulation',
      desc: 'Line-by-line runtime execution simulator tracing active memory variables, heap allocations, and call stacks.',
      icon: Sparkles,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Static & AI Bug Detection',
      desc: 'Categorized security and logic audits flagging unhandled exceptions, resource leaks, and infinite loop risks.',
      icon: Bug,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Automated Optimizations',
      desc: 'Algorithmic complexity reduction and modern idioms with side-by-side diffs and expected performance gains.',
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Control Flow & Call Graphs',
      desc: 'Visual node diagrams rendering program branches, condition evaluation paths, and caller/callee graphs.',
      icon: GitFork,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Unit Test Case Generation',
      desc: 'AI-generated test suites covering normal, boundary, edge, invalid, and exception stress scenarios with runnable snippets.',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  const supportedLangs = [
    { name: 'Python', ext: 'py', desc: 'Lists, Functions, Comprehensions & AI logic', badge: '🐍 Python' },
    { name: 'C++', ext: 'cpp', desc: 'Pointers, Arrays, Loops & Recursion', badge: '⚡ C++' },
    { name: 'Java', ext: 'java', desc: 'OOP, Methods, Loops & DSA Structures', badge: '☕ Java' },
    { name: 'JavaScript', ext: 'js', desc: 'Closures, Promises, Arrays & Async flow', badge: '🟨 JavaScript' },
    { name: 'TypeScript', ext: 'ts', desc: 'Static types, interfaces & typed AST', badge: '🔷 TypeScript' },
    { name: 'Go / Rust', ext: 'go', desc: 'Concurrency, struct layouts & safety', badge: '🦀 Rust / Go' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Hero Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-lg font-black tracking-tight text-white">CodeVision AI</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Understand • Analyze • Visualize • Improve Code</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-5xl mb-6">
          Intelligent Full-Stack <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-200">
            Code Analysis & Visualization
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
          Unlock profound insight into your codebases with AI-driven execution simulation, AST trees, complexity calculations, security audits, and automated test generators.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
          <Link
            to="/editor"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base flex items-center gap-3 shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all duration-200"
          >
            <span>Start Analyzing Code</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/register"
            className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
          >
            Create Free Account
          </Link>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="w-full max-w-4xl glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden bg-slate-900/90 text-left">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Real-time Execution Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300">
              <span className="text-slate-500 text-[10px]">1 |</span> def binary_search(arr, target):<br />
              <span className="bg-indigo-600/30 text-amber-300 p-1 rounded block my-1">
                2 | mid = (low + high) // 2
              </span>
              <span className="text-slate-500 text-[10px]">3 |</span> return mid
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="text-cyan-400 font-bold mb-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Memory State & Stack
              </div>
              <div className="font-mono text-slate-200">low = 0, high = 15</div>
              <div className="font-mono text-amber-400 font-bold">mid = 7 (Computed)</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="text-emerald-400 font-bold mb-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Quality Audit: 94/100
              </div>
              <p className="text-slate-300 leading-snug">
                Logarithmic O(log n) time complexity verified. No recursive stack overflow risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
            Engineered for DSA Mastery & Code Quality
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            CodeVision AI breaks down complex algorithmic flows into intuitive step-by-step visual representations and audit reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between bg-slate-900/60"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Languages Section */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/20 bg-slate-900/60">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Multi-Language AST Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-8">
            Specialized parser support across all popular engineering languages.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {supportedLangs.map((lang, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center gap-1 hover:border-indigo-500 transition-colors"
              >
                <span className="text-sm font-bold text-indigo-300">{lang.badge}</span>
                <span className="text-[10px] text-slate-500 font-mono">.{lang.ext}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto glass-panel p-10 rounded-3xl border border-slate-800 bg-gradient-to-b from-indigo-950/40 to-slate-900/80 space-y-6">
          <h2 className="text-3xl font-black text-white">Ready to elevate your code intelligence?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Create an account or jump straight into the editor to experience real-time execution analysis.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25"
            >
              Sign Up Now
            </Link>
            <Link
              to="/editor"
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 hover:bg-slate-700"
            >
              Try Live Editor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 CodeVision AI. Intelligent Full-Stack Code Analysis, Visualization and Learning Platform.</p>
      </footer>
    </div>
  );
};
