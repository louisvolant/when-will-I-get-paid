import { describe, expect, it } from 'vitest';
import {
  adjustForWeekend,
  calculatePayday,
  getDaysInMonth,
  getPaydayForMonth,
} from './calculator';

describe('Payday Calculator Engine', () => {
  it('correctly calculates days in month including leap years', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29); // Feb 2024 (leap year)
    expect(getDaysInMonth(2025, 1)).toBe(28); // Feb 2025 (standard year)
    expect(getDaysInMonth(2026, 0)).toBe(31); // Jan 2026
    expect(getDaysInMonth(2026, 3)).toBe(30); // Apr 2026
  });

  describe('Weekend adjustment rules', () => {
    // 2026-03-28 is a Saturday
    const satDate = new Date(2026, 2, 28);
    // 2026-06-28 is a Sunday
    const sunDate = new Date(2026, 5, 28);
    // 2026-04-28 is a Tuesday
    const weekdayDate = new Date(2026, 3, 28);

    it('rolls Saturday to Monday with "next-working-day"', () => {
      const adjusted = adjustForWeekend(satDate, 'next-working-day');
      expect(adjusted.isAdjusted).toBe(true);
      expect(adjusted.date.getDate()).toBe(30); // Monday March 30
      expect(adjusted.date.getDay()).toBe(1); // Monday
    });

    it('rolls Sunday to Monday with "next-working-day"', () => {
      const adjusted = adjustForWeekend(sunDate, 'next-working-day');
      expect(adjusted.isAdjusted).toBe(true);
      expect(adjusted.date.getDate()).toBe(29); // Monday June 29
      expect(adjusted.date.getDay()).toBe(1); // Monday
    });

    it('rolls Saturday to Friday with "previous-working-day"', () => {
      const adjusted = adjustForWeekend(satDate, 'previous-working-day');
      expect(adjusted.isAdjusted).toBe(true);
      expect(adjusted.date.getDate()).toBe(27); // Friday March 27
      expect(adjusted.date.getDay()).toBe(5); // Friday
    });

    it('rolls Sunday to Friday with "previous-working-day"', () => {
      const adjusted = adjustForWeekend(sunDate, 'previous-working-day');
      expect(adjusted.isAdjusted).toBe(true);
      expect(adjusted.date.getDate()).toBe(26); // Friday June 26
      expect(adjusted.date.getDay()).toBe(5); // Friday
    });

    it('leaves weekend untouched with "exact-day"', () => {
      const satAdjusted = adjustForWeekend(satDate, 'exact-day');
      expect(satAdjusted.isAdjusted).toBe(false);
      expect(satAdjusted.date.getDate()).toBe(28);

      const sunAdjusted = adjustForWeekend(sunDate, 'exact-day');
      expect(sunAdjusted.isAdjusted).toBe(false);
      expect(sunAdjusted.date.getDate()).toBe(28);
    });

    it('does not touch weekdays regardless of rule', () => {
      const nextAdj = adjustForWeekend(weekdayDate, 'next-working-day');
      expect(nextAdj.isAdjusted).toBe(false);
      expect(nextAdj.date.getDate()).toBe(28);

      const prevAdj = adjustForWeekend(weekdayDate, 'previous-working-day');
      expect(prevAdj.isAdjusted).toBe(false);
      expect(prevAdj.date.getDate()).toBe(28);
    });
  });

  describe('Month clamping', () => {
    it('clamps 31st to 28th/29th in February and adjusts weekend if needed', () => {
      // Feb 2026 has 28 days. Feb 28, 2026 is Saturday.
      const feb2026 = getPaydayForMonth(31, 2026, 1, 'next-working-day');
      expect(feb2026.originalDate.getDate()).toBe(28);
      // Sat 28 rolled to Mon March 2nd
      expect(feb2026.date.getMonth()).toBe(2);
      expect(feb2026.date.getDate()).toBe(2);
    });
  });

  describe('Countdown and State determination', () => {
    it('detects when today is payday', () => {
      // Reference date: March 30, 2026 (which is the rolled payday for target 28th)
      const refDate = new Date(2026, 2, 30, 10, 0, 0);
      const calc = calculatePayday(28, 'next-working-day', refDate);

      expect(calc.isToday).toBe(true);
      expect(calc.daysRemaining).toBe(0);
      expect(calc.cycleProgress).toBe(100);
    });

    it('accurately computes days remaining when payday is upcoming this month', () => {
      // Today is March 5, 2026. Payday is March 30, 2026 (28th is Sat -> rolls to 30th)
      const refDate = new Date(2026, 2, 5, 12, 0, 0);
      const calc = calculatePayday(28, 'next-working-day', refDate);

      expect(calc.isToday).toBe(false);
      expect(calc.daysRemaining).toBe(25);
      expect(calc.weeksRemaining).toBe(3);
      expect(calc.extraDaysRemaining).toBe(4);
      expect(calc.nextPayDate.getDate()).toBe(30);
    });

    it('rolls over to next month if this month payday already passed', () => {
      // Today is March 31, 2026.
      // April 2026 target 28 is Tuesday (2026-04-28).
      const refDate = new Date(2026, 2, 31, 15, 0, 0);
      const calc = calculatePayday(28, 'next-working-day', refDate);

      expect(calc.isToday).toBe(false);
      expect(calc.nextPayDate.getMonth()).toBe(3); // April
      expect(calc.nextPayDate.getDate()).toBe(28);
      expect(calc.daysRemaining).toBe(28);
    });

    it('provides upcoming paydays list', () => {
      const refDate = new Date(2026, 2, 5, 12, 0, 0);
      const calc = calculatePayday(28, 'next-working-day', refDate);

      expect(calc.upcomingPaydays.length).toBeGreaterThanOrEqual(4);
      expect(calc.upcomingPaydays[0].date.getTime()).toBeGreaterThan(calc.nextPayDate.getTime());
    });
  });
});
