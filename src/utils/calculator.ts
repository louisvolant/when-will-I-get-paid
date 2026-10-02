import type { PaydayCalculation, PaydayInfo, WeekendRule } from '../types';

/**
 * Returns the number of days in a given month.
 * @param year Full year (e.g. 2026)
 * @param month 0-indexed month (0 = January, 11 = December)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Adjusts a date based on the chosen weekend / non-working day rule.
 */
export function adjustForWeekend(nominalDate: Date, rule: WeekendRule): { date: Date; isAdjusted: boolean } {
  const result = new Date(nominalDate.getTime());
  const dayOfWeek = result.getDay(); // 0 = Sunday, 6 = Saturday

  if (rule === 'exact-day' || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
    return { date: result, isAdjusted: false };
  }

  if (rule === 'next-working-day') {
    if (dayOfWeek === 6) {
      // Saturday -> Monday (+2 days)
      result.setDate(result.getDate() + 2);
      return { date: result, isAdjusted: true };
    }
    if (dayOfWeek === 0) {
      // Sunday -> Monday (+1 day)
      result.setDate(result.getDate() + 1);
      return { date: result, isAdjusted: true };
    }
  }

  if (rule === 'previous-working-day') {
    if (dayOfWeek === 6) {
      // Saturday -> Friday (-1 day)
      result.setDate(result.getDate() - 1);
      return { date: result, isAdjusted: true };
    }
    if (dayOfWeek === 0) {
      // Sunday -> Friday (-2 days)
      result.setDate(result.getDate() - 2);
      return { date: result, isAdjusted: true };
    }
  }

  return { date: result, isAdjusted: false };
}

/**
 * Computes the adjusted payday for a specific year and month.
 */
export function getPaydayForMonth(
  targetDay: number,
  year: number,
  month: number,
  rule: WeekendRule
): PaydayInfo {
  const maxDays = getDaysInMonth(year, month);
  const clampedDay = Math.min(targetDay, maxDays);
  const nominal = new Date(year, month, clampedDay, 0, 0, 0, 0);
  const { date: adjusted, isAdjusted } = adjustForWeekend(nominal, rule);

  return {
    date: adjusted,
    originalDate: nominal,
    isAdjusted,
    dayOfWeek: adjusted.getDay(),
  };
}

/**
 * Checks if two dates fall on the exact same calendar day (ignoring hours/minutes).
 */
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Primary calculation function determining the next payday and cycle metrics
 * from the browser's current date/time.
 */
export function calculatePayday(
  targetDay: number,
  rule: WeekendRule,
  referenceDate: Date = new Date()
): PaydayCalculation {
  const now = referenceDate;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Find candidate paydays: previous month, current month, next month, etc.
  const thisMonthPayday = getPaydayForMonth(targetDay, currentYear, currentMonth, rule);

  // Strip time for clean day comparisons
  const todayZero = new Date(currentYear, currentMonth, now.getDate(), 0, 0, 0, 0);
  const thisMonthZero = new Date(
    thisMonthPayday.date.getFullYear(),
    thisMonthPayday.date.getMonth(),
    thisMonthPayday.date.getDate(),
    0, 0, 0, 0
  );

  const isToday = isSameDay(todayZero, thisMonthZero);

  let nextPaydayInfo: PaydayInfo;
  let previousPaydayInfo: PaydayInfo;
  let upcomingPaydays: PaydayInfo[] = [];

  if (isToday) {
    nextPaydayInfo = thisMonthPayday;
    previousPaydayInfo = getPaydayForMonth(targetDay, currentYear, currentMonth - 1, rule);

    // Populate upcoming next 4 paydays
    for (let i = 1; i <= 4; i++) {
      upcomingPaydays.push(getPaydayForMonth(targetDay, currentYear, currentMonth + i, rule));
    }
  } else if (todayZero.getTime() < thisMonthZero.getTime()) {
    // Current month's payday is still in the future
    nextPaydayInfo = thisMonthPayday;
    previousPaydayInfo = getPaydayForMonth(targetDay, currentYear, currentMonth - 1, rule);

    for (let i = 1; i <= 4; i++) {
      upcomingPaydays.push(getPaydayForMonth(targetDay, currentYear, currentMonth + i, rule));
    }
  } else {
    // Current month's payday has already passed
    nextPaydayInfo = getPaydayForMonth(targetDay, currentYear, currentMonth + 1, rule);
    previousPaydayInfo = thisMonthPayday;

    for (let i = 2; i <= 5; i++) {
      upcomingPaydays.push(getPaydayForMonth(targetDay, currentYear, currentMonth + i, rule));
    }
  }

  // Target midnight of the next payday
  const nextPayMidnight = new Date(
    nextPaydayInfo.date.getFullYear(),
    nextPaydayInfo.date.getMonth(),
    nextPaydayInfo.date.getDate(),
    0, 0, 0, 0
  );

  // Difference in calendar days
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = isToday
    ? 0
    : Math.max(0, Math.ceil((nextPayMidnight.getTime() - todayZero.getTime()) / msPerDay));

  const weeksRemaining = Math.floor(daysRemaining / 7);
  const extraDaysRemaining = daysRemaining % 7;

  // Real-time breakdown
  const diffMs = Math.max(0, nextPayMidnight.getTime() - now.getTime());
  const totalSecondsRemaining = Math.floor(diffMs / 1000);
  const hoursRemaining = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutesRemaining = Math.floor((diffMs / (1000 * 60)) % 60);
  const secondsRemaining = Math.floor((diffMs / 1000) % 60);

  // Cycle progress calculation (from previous payday to next payday)
  const prevPayMidnight = new Date(
    previousPaydayInfo.date.getFullYear(),
    previousPaydayInfo.date.getMonth(),
    previousPaydayInfo.date.getDate(),
    0, 0, 0, 0
  );

  const cycleSpan = Math.max(1, nextPayMidnight.getTime() - prevPayMidnight.getTime());
  const elapsed = Math.max(0, Math.min(cycleSpan, now.getTime() - prevPayMidnight.getTime()));
  const cycleProgress = isToday ? 100 : Math.round((elapsed / cycleSpan) * 100);

  return {
    isToday,
    nextPayDate: nextPaydayInfo.date,
    previousPayDate: previousPaydayInfo.date,
    daysRemaining,
    weeksRemaining,
    extraDaysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
    totalSecondsRemaining,
    cycleProgress: Math.min(100, Math.max(0, cycleProgress)),
    nextPaydayInfo,
    upcomingPaydays,
  };
}
