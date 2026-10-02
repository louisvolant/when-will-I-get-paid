import { get, set, del } from 'idb-keyval';
import type { PaydaySettings, SupportedLanguage } from '../types';

const STORAGE_KEY = 'when_will_i_get_paid_settings';

/**
 * Detects the browser's preferred language among the 6 supported languages.
 */
export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const browserLocales = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || 'en'];

  for (const locale of browserLocales) {
    if (!locale) continue;
    const code = locale.toLowerCase().split('-')[0];
    if (code === 'fr') return 'fr';
    if (code === 'de') return 'de';
    if (code === 'it') return 'it';
    if (code === 'pt') return 'pt';
    if (code === 'nl') return 'nl';
    if (code === 'en') return 'en';
  }

  return 'en';
}

export const DEFAULT_SETTINGS: PaydaySettings = {
  payDay: 28,
  weekendRule: 'next-working-day',
  displayFormat: 'days',
  language: 'en',
  soundEnabled: true,
};

/**
 * Checks if IndexedDB is supported in the current runtime environment.
 */
function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

/**
 * Checks if localStorage is supported in the current runtime environment.
 */
function isLocalStorageAvailable(): boolean {
  return typeof localStorage !== 'undefined';
}

/**
 * Loads user settings from IndexedDB, falling back to localStorage if IndexedDB is unavailable.
 */
export async function loadSettings(): Promise<PaydaySettings | null> {
  if (isIndexedDBAvailable()) {
    try {
      const data = await get<PaydaySettings>(STORAGE_KEY);
      if (data && typeof data.payDay === 'number') {
        return data;
      }
    } catch (err) {
      console.warn('IndexedDB read failed, trying localStorage fallback:', err);
    }
  }

  // Fallback to localStorage
  if (isLocalStorageAvailable()) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as PaydaySettings;
      }
    } catch {
      // Ignore storage read issues
    }
  }

  return null;
}

/**
 * Saves user settings into IndexedDB and mirrors to localStorage for robustness.
 */
export async function saveSettings(settings: PaydaySettings): Promise<void> {
  if (isIndexedDBAvailable()) {
    try {
      await set(STORAGE_KEY, settings);
    } catch (err) {
      console.warn('IndexedDB write failed, falling back to localStorage:', err);
    }
  }

  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage write issues
    }
  }
}

/**
 * Clears saved settings.
 */
export async function clearSettings(): Promise<void> {
  if (isIndexedDBAvailable()) {
    try {
      await del(STORAGE_KEY);
    } catch (err) {
      console.warn('IndexedDB delete failed:', err);
    }
  }

  if (isLocalStorageAvailable()) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
