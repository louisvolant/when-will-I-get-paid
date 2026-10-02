import { describe, expect, it } from 'vitest';
import { formatPaydayDate, formatString, getTranslation } from './index';

describe('i18n & translations', () => {
  it('supports all 6 required languages', () => {
    const langs = ['fr', 'en', 'de', 'it', 'pt', 'nl'] as const;
    for (const lang of langs) {
      const dict = getTranslation(lang);
      expect(dict).toBeDefined();
      expect(dict.appTitle).toBeTruthy();
      expect(dict.countdownDaysPlural).toContain('{count}');
      expect(dict.localeName).toBeTruthy();
    }
  });

  it('interpolates variables properly in string templates', () => {
    const template = '{count} days until payday!';
    expect(formatString(template, { count: 25 })).toBe('25 days until payday!');

    const weeksTemplate = '{weeks} weeks and {days} days until payday!';
    expect(formatString(weeksTemplate, { weeks: 3, days: 4 })).toBe('3 weeks and 4 days until payday!');
  });

  it('formats dates according to locale', () => {
    const testDate = new Date(2026, 3, 28); // 2026-04-28 (Tuesday)
    const frFormatted = formatPaydayDate(testDate, 'fr');
    expect(frFormatted.toLowerCase()).toContain('mardi');
    expect(frFormatted).toContain('28');

    const enFormatted = formatPaydayDate(testDate, 'en');
    expect(enFormatted.toLowerCase()).toContain('tuesday');
    expect(enFormatted).toContain('28');
  });
});
