import React from 'react';
import { Eye, Code2, Sparkles, Heart } from 'lucide-react';

interface NavbarProps {
  currentScreen: 'welcome' | 'visualizer';
  onNavigate: (screen: 'welcome' | 'visualizer') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo & tagline */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
              <Eye className="w-5 h-5 text-cyan-400 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight">
                VisualCode <span className="text-cyan-400">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Understand Code, Step by Step.
            </p>
          </div>
        </button>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('welcome')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentScreen === 'welcome'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('visualizer')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
                currentScreen === 'visualizer'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-indigo-500/20'
                  : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Visualizer</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
