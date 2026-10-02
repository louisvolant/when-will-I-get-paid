import React, { useState, useRef, useEffect } from 'react';
import { Settings, Globe, Download, Sparkles, Check } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenSettings: () => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
}

const LANGUAGE_OPTIONS: Array<{ code: SupportedLanguage; label: string; flag: string }> = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English (UK)', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenSettings,
  canInstallPwa,
  onInstallPwa,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dict = getTranslation(currentLanguage);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = LANGUAGE_OPTIONS.find((o) => o.code === currentLanguage) || LANGUAGE_OPTIONS[0];

  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-20 relative">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <span className="text-xl font-black text-emerald-400">€</span>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            {dict.appTitle}
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse hidden sm:inline" />
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">{dict.appSubtitle}</p>
        </div>
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-2">
        {/* PWA Install Button */}
        {canInstallPwa && (
          <button
            onClick={onInstallPwa}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer"
            title={dict.installApp}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{dict.installApp}</span>
          </button>
        )}

        {/* Language selector dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700/60 hover:border-slate-600 transition-colors cursor-pointer"
            aria-label={dict.languageLabel}
          >
            <span className="text-sm">{activeOption.flag}</span>
            <span className="font-semibold uppercase tracking-wider">{activeOption.code}</span>
            <Globe className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => {
                    onLanguageChange(opt.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                    opt.code === currentLanguage
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </span>
                  {opt.code === currentLanguage && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
          title={dict.settingsTitle}
          aria-label={dict.settingsTitle}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
