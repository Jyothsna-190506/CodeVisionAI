import React from 'react';
import { Eye, Code2, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentScreen: 'welcome' | 'visualizer';
  onNavigate: (screen: 'welcome' | 'visualizer') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 w-full pearl-dock border-b border-border-pearl bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo & tagline */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-terracotta to-orange-warm p-0.5 shadow-pearl-sm group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-ivory rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-terracotta" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-charcoal tracking-tight">
                CodeVision <span className="text-terracotta">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-terracotta-light text-terracotta border border-terracotta/20 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-terracotta" /> v1.0
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted font-medium hidden sm:block">
              Understand Code, Step by Step.
            </p>
          </div>
        </button>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('welcome')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentScreen === 'welcome'
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-ivory-warm'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('visualizer')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-pearl-sm ${
                currentScreen === 'visualizer'
                  ? 'bg-terracotta text-white'
                  : 'bg-white text-charcoal border border-border-pearl hover:border-terracotta'
              }`}
            >
              <Code2 className="w-4 h-4 text-terracotta" />
              <span>Visualizer</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
