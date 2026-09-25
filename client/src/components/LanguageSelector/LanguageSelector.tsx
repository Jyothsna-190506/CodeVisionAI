import React from 'react';
import { Code } from 'lucide-react';

export type SupportedLanguage = 'cpp' | 'python' | 'java';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
  disabled?: boolean;
}

export const LANGUAGES: { id: SupportedLanguage; label: string; iconColor: string; ext: string }[] = [
  { id: 'cpp', label: 'C++', iconColor: 'text-terracotta', ext: 'main.cpp' },
  { id: 'python', label: 'Python', iconColor: 'text-orange-warm', ext: 'main.py' },
  { id: 'java', label: 'Java', iconColor: 'text-terracotta', ext: 'Main.java' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-bold text-charcoal-muted uppercase tracking-wider flex items-center gap-1.5">
        <Code className="w-3.5 h-3.5 text-terracotta" />
        Language:
      </label>
      <div className="relative flex items-center">
        <select
          value={selectedLanguage}
          onChange={(e) => onChange(e.target.value as SupportedLanguage)}
          disabled={disabled}
          className="bg-white text-charcoal text-xs font-semibold rounded-xl px-3 py-1.5 pr-8 border border-border-pearl hover:border-terracotta focus:outline-none focus:border-terracotta disabled:opacity-50 appearance-none cursor-pointer shadow-pearl-sm"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-white text-charcoal">
              {lang.label} ({lang.ext})
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 pointer-events-none text-charcoal-muted">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
