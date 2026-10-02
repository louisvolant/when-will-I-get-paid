import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import type { PaydayCalculation, SupportedLanguage } from '../types';
import { formatShortDate, formatString, getTranslation } from '../i18n';

interface CycleProgressBarProps {
  calculation: PaydayCalculation;
  language: SupportedLanguage;
}

export const CycleProgressBar: React.FC<CycleProgressBarProps> = ({
  calculation,
  language,
}) => {
  const dict = getTranslation(language);
  const { cycleProgress, previousPayDate, nextPayDate, isToday } = calculation;

  const prevFormatted = formatShortDate(previousPayDate, language);
  const nextFormatted = formatShortDate(nextPayDate, language);

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            {dict.cycleProgressLabel}
          </h3>
        </div>
        <span className="text-xs font-bold text-emerald-400 font-mono">
          {cycleProgress}%
        </span>
      </div>

      {/* Progress track & bar */}
      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[1px]">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isToday
              ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
          }`}
          style={{ width: `${Math.max(4, Math.min(100, cycleProgress))}%` }}
        />
      </div>

      {/* Timeline markers */}
      <div className="flex items-center justify-between mt-2.5 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
          {prevFormatted}
        </span>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {formatString(dict.cycleProgressDesc, { percent: cycleProgress })}
        </span>
        <span className="flex items-center gap-1 font-medium text-slate-300">
          <ArrowRight className="w-3 h-3 text-emerald-400" />
          {nextFormatted}
        </span>
      </div>
    </div>
  );
};
