import React from 'react';
import { Calendar, Clock, AlertCircle, Sparkles, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import type { DisplayFormat, PaydayCalculation, SupportedLanguage } from '../types';
import { formatPaydayDate, formatString, getTranslation } from '../i18n';
import { firePaydayConfetti } from '../utils/confetti';

interface HeroCountdownProps {
  calculation: PaydayCalculation;
  language: SupportedLanguage;
  displayFormat: DisplayFormat;
  onFormatChange: (format: DisplayFormat) => void;
  onOpenSettings: () => void;
  targetDay: number;
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({
  calculation,
  language,
  displayFormat,
  onFormatChange,
  onOpenSettings,
  targetDay,
}) => {
  const dict = getTranslation(language);
  const { isToday, daysRemaining, weeksRemaining, extraDaysRemaining, hoursRemaining, minutesRemaining, secondsRemaining, nextPayDate, nextPaydayInfo } = calculation;

  const formattedDate = formatPaydayDate(nextPayDate, language);

  // Render main headline based on format
  const renderCountdownHeadline = () => {
    if (isToday) {
      return (
        <div className="text-center py-2 animate-bounce">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 tracking-tight">
            {dict.paydayTodayTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-lg text-emerald-200/90 font-medium">
            {dict.paydayTodaySubtitle}
          </p>
        </div>
      );
    }

    if (displayFormat === 'weeks-days') {
      const text =
        extraDaysRemaining === 0
          ? formatString(dict.countdownWeeksOnly, { weeks: weeksRemaining })
          : formatString(dict.countdownWeeksAndDays, {
              weeks: weeksRemaining,
              days: extraDaysRemaining,
            });

      return (
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            {targetDay} {dict.dayOfMonth}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {text}
          </h2>
        </div>
      );
    }

    if (displayFormat === 'detailed') {
      return (
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            {targetDay} {dict.dayOfMonth}
          </span>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto my-2">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
              <span className="block text-2xl sm:text-4xl md:text-5xl font-black text-emerald-400 font-mono">
                {daysRemaining}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {dict.dayShort}
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
              <span className="block text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono">
                {String(hoursRemaining).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {dict.hours}
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
              <span className="block text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono">
                {String(minutesRemaining).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {dict.minutes}
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
              <span className="block text-2xl sm:text-4xl md:text-5xl font-black text-teal-400 font-mono">
                {String(secondsRemaining).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {dict.seconds}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Default: 'days'
    const daysText =
      daysRemaining === 1
        ? dict.countdownDaysSingular
        : formatString(dict.countdownDaysPlural, { count: daysRemaining });

    return (
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          {targetDay} {dict.dayOfMonth}
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          {daysText}
        </h2>
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Countdown Display */}
      <div className="relative z-10 flex flex-col items-center">
        {renderCountdownHeadline()}

        {/* Confetti button if today */}
        {isToday && (
          <button
            onClick={() => firePaydayConfetti()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Confettis ! 🎉
          </button>
        )}

        {/* Display Mode Switcher (Pill Selector) */}
        {!isToday && (
          <div className="mt-6 flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => onFormatChange('days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                displayFormat === 'days'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {dict.displayFormatDays.split(' ')[0]}
            </button>
            <button
              onClick={() => onFormatChange('weeks-days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                displayFormat === 'weeks-days'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {dict.displayFormatWeeks.split(' ')[0]}
            </button>
            <button
              onClick={() => onFormatChange('detailed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                displayFormat === 'detailed'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              Timer
            </button>
          </div>
        )}

        {/* Next Payday Date Card */}
        <div className="mt-8 w-full max-w-lg rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                {dict.nextPaydayLabel}
              </span>
              <span className="text-base sm:text-lg font-bold text-white block">
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {nextPaydayInfo.isAdjusted ? (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30"
                title={dict.adjustedToNextWorkingDay}
              >
                <AlertCircle className="w-3 h-3 text-amber-400" />
                {dict.adjustedToNextWorkingDay.split('(')[0].trim()}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {dict.exactCalendarDay}
              </span>
            )}

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={dict.editSettings}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
