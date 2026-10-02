import React from 'react';
import { X, Calendar, Briefcase, Layout, Globe, Trash2, Sparkles, Check } from 'lucide-react';
import type { DisplayFormat, PaydaySettings, SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';
import { firePaydayConfetti } from '../utils/confetti';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PaydaySettings;
  onUpdateSettings: (newSettings: Partial<PaydaySettings>) => void;
  onReset: () => void;
}

const LANGUAGES: Array<{ code: SupportedLanguage; label: string; flag: string }> = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English (UK)', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onReset,
}) => {
  if (!isOpen) return null;

  const dict = getTranslation(settings.language);

  const handleResetClick = () => {
    if (window.confirm(dict.resetConfirm)) {
      onReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {dict.settingsTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={dict.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-6">
          {/* Section 1: Regular Pay Day */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {dict.settingsPayDayLabel}
            </label>
            <div className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <input
                type="range"
                min="1"
                max="31"
                value={settings.payDay}
                onChange={(e) => onUpdateSettings({ payDay: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="shrink-0 w-12 text-center font-bold font-mono text-emerald-400 text-lg bg-slate-900 border border-slate-700 py-1 rounded-xl">
                {settings.payDay}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {dict.settingsPayDayHelper}
            </p>
          </div>

          {/* Section 2: Non-working day rule */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              {dict.settingsWeekendRuleLabel}
            </label>
            <p className="text-xs text-slate-400 mb-2.5">
              {dict.settingsWeekendRuleHelper}
            </p>

            <div className="space-y-2">
              {/* Next working day */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ weekendRule: 'next-working-day' })}
                className={`w-full flex items-start justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  settings.weekendRule === 'next-working-day'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">
                    {dict.weekendRuleNext}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {dict.weekendRuleNextDesc}
                  </div>
                </div>
                {settings.weekendRule === 'next-working-day' && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
              </button>

              {/* Previous working day */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ weekendRule: 'previous-working-day' })}
                className={`w-full flex items-start justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  settings.weekendRule === 'previous-working-day'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">
                    {dict.weekendRulePrev}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {dict.weekendRulePrevDesc}
                  </div>
                </div>
                {settings.weekendRule === 'previous-working-day' && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
              </button>

              {/* Exact day */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ weekendRule: 'exact-day' })}
                className={`w-full flex items-start justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  settings.weekendRule === 'exact-day'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">
                    {dict.weekendRuleExact}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {dict.weekendRuleExactDesc}
                  </div>
                </div>
                {settings.weekendRule === 'exact-day' && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Section 3: Display Format */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <Layout className="w-4 h-4 text-emerald-400" />
              {dict.displayFormatLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['days', 'weeks-days', 'detailed'] as DisplayFormat[]).map((fmt) => {
                const label =
                  fmt === 'days'
                    ? dict.displayFormatDays
                    : fmt === 'weeks-days'
                    ? dict.displayFormatWeeks
                    : dict.displayFormatDetailed;

                const isSelected = settings.displayFormat === fmt;

                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => onUpdateSettings({ displayFormat: fmt })}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Language */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              {dict.languageLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onUpdateSettings({ language: l.code })}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    settings.language === l.code
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {settings.language === l.code && (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Confetti trigger preview */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => firePaydayConfetti()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Tester les confettis de célébration 🎉
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleResetClick}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:underline transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {dict.resetLabel}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            {dict.close}
          </button>
        </div>
      </div>
    </div>
  );
};
