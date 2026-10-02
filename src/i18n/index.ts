import type { SupportedLanguage } from '../types';
import { translations, type TranslationDictionary } from './translations';

export { translations, type TranslationDictionary };

/**
 * Returns the translations dictionary for a given language code.
 */
export function getTranslation(lang: SupportedLanguage): TranslationDictionary {
  return translations[lang] || translations.en;
}

/**
 * Replaces placeholders like {count}, {weeks}, {days}, {percent} in translated strings.
 */
export function formatString(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

/**
 * Formats a Date object cleanly with weekday and month in the target locale.
 */
export function formatPaydayDate(date: Date, lang: SupportedLanguage): string {
  const dict = getTranslation(lang);
  const formatter = new Intl.DateTimeFormat(dict.dateLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formatted = formatter.format(date);
  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formats upcoming calendar preview dates (e.g. "Mon, 28 Apr").
 */
export function formatShortDate(date: Date, lang: SupportedLanguage): string {
  const dict = getTranslation(lang);
  const formatter = new Intl.DateTimeFormat(dict.dateLocale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  return formatter.format(date);
}
