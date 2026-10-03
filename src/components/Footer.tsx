import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface FooterProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const LANGUAGE_OPTIONS: Array<{ code: SupportedLanguage; label: string; flag: string }> = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
];

export const Footer: React.FC<FooterProps> = ({ language, onLanguageChange }) => {
  const dict = getTranslation(language);

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 mt-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-400 sm:flex-row">
        {/* Brand & tagline */}
        <p className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-xs">
            €
          </span>
          <span className="font-semibold text-white">PayDay</span> —
          <span className="text-slate-400">{dict.appSubtitle}</span>
        </p>

        {/* Links & Language */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm">
          {/* Personal navigation */}
          <nav className="flex items-center gap-5" aria-label="Personal">
            <a
              href="https://www.louisvolant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <span>Personal Page</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <a
              href="https://www.louisvolant.com/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <span>Portfolio</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </nav>

          {/* Language selector */}
          <div className="relative inline-flex shrink-0 items-center">
            <Globe className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label={dict.languageLabel}
              className="appearance-none rounded-lg border border-slate-800 bg-slate-900 py-1.5 pr-7 pl-8 text-xs font-medium text-slate-200 shadow-sm transition hover:border-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code} className="bg-slate-900 text-slate-200">
                  {opt.flag} {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 text-[10px] text-slate-400">
              ▼
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
