import React from 'react';
import { Code, Check } from 'lucide-react';

export type SupportedLanguage = 'cpp' | 'python' | 'java';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
  disabled?: boolean;
}

export const LANGUAGES: { id: SupportedLanguage; label: string; iconColor: string; ext: string }[] = [
  { id: 'cpp', label: 'C++', iconColor: 'text-blue-400', ext: 'main.cpp' },
  { id: 'python', label: 'Python', iconColor: 'text-amber-400', ext: 'main.py' },
  { id: 'java', label: 'Java', iconColor: 'text-orange-400', ext: 'Main.java' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Code className="w-3.5 h-3.5 text-indigo-400" />
        Language:
      </label>
      <div className="relative flex items-center">
        <select
          value={selectedLanguage}
          onChange={(e) => onChange(e.target.value as SupportedLanguage)}
          disabled={disabled}
          className="bg-slate-900/90 text-slate-100 text-sm font-semibold rounded-lg px-3 py-1.5 pr-8 border border-slate-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 appearance-none cursor-pointer shadow-inner"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-slate-900 text-slate-200">
              {lang.label} ({lang.ext})
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
