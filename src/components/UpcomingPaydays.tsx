import React from 'react';
import { CalendarDays, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { PaydayInfo, SupportedLanguage } from '../types';
import { formatPaydayDate, getTranslation } from '../i18n';

interface UpcomingPaydaysProps {
  paydays: PaydayInfo[];
  language: SupportedLanguage;
}

export const UpcomingPaydays: React.FC<UpcomingPaydaysProps> = ({
  paydays,
  language,
}) => {
  const dict = getTranslation(language);

  if (!paydays || paydays.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-200">
          {dict.upcomingPaydaysTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paydays.map((item, index) => {
          const dateStr = formatPaydayDate(item.date, language);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                  #{index + 1}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-200">
                    {dateStr}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {item.isAdjusted ? (
                      <span className="text-amber-400/90 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {dict.adjustedToNextWorkingDay.split('(')[0].trim()}
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
                        {dict.exactCalendarDay}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
