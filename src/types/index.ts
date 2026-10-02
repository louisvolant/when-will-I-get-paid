export type WeekendRule = 'next-working-day' | 'previous-working-day' | 'exact-day';

export type DisplayFormat = 'days' | 'weeks-days' | 'detailed';

export type SupportedLanguage = 'fr' | 'en' | 'de' | 'it' | 'pt' | 'nl';

export interface PaydaySettings {
  payDay: number; // 1 to 31
  weekendRule: WeekendRule;
  displayFormat: DisplayFormat;
  language: SupportedLanguage;
  soundEnabled?: boolean;
}

export interface PaydayInfo {
  date: Date;
  originalDate: Date;
  isAdjusted: boolean;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday...
}

export interface PaydayCalculation {
  isToday: boolean;
  nextPayDate: Date;
  previousPayDate: Date;
  daysRemaining: number;
  weeksRemaining: number;
  extraDaysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  totalSecondsRemaining: number;
  cycleProgress: number; // 0 to 100 percentage
  nextPaydayInfo: PaydayInfo;
  upcomingPaydays: PaydayInfo[];
}
