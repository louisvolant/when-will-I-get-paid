import React, { useState } from 'react';
import { Calendar, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import type { SupportedLanguage, WeekendRule } from '../types';
import { getTranslation } from '../i18n';

interface OnboardingModalProps {
  language: SupportedLanguage;
  onSave: (payDay: number, weekendRule: WeekendRule) => void;
}

const PRESET_DAYS = [25, 27, 28, 30, 31];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  language,
  onSave,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(28);
  const [weekendRule, setWeekendRule] = useState<WeekendRule>('next-working-day');
  const dict = getTranslation(language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedDay, weekendRule);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {dict.onboardingTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {dict.onboardingSubtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Quick preset buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {dict.settingsPayDayLabel}
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_DAYS.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                    selectedDay === day
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Day slider and numeric input */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <input
                type="range"
                min="1"
                max="31"
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="shrink-0 w-10 text-center font-bold font-mono text-emerald-400 text-base">
                {selectedDay}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {dict.onboardingHelper}
            </p>
          </div>

          {/* Weekend adjustment selection */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                {dict.settingsWeekendRuleLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setWeekendRule('next-working-day')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                weekendRule === 'next-working-day'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-medium">
                {dict.weekendRuleNext}
              </span>
              {weekendRule === 'next-working-day' && (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setWeekendRule('exact-day')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                weekendRule === 'exact-day'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-medium">
                {dict.weekendRuleExact}
              </span>
              {weekendRule === 'exact-day' && (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>

          {/* CTA Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all cursor-pointer"
          >
            <span>{dict.saveAndStart}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
