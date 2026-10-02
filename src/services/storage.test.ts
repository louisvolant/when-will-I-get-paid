import { describe, expect, it, beforeEach, vi } from 'vitest';
import { detectBrowserLanguage, loadSettings, saveSettings, clearSettings, DEFAULT_SETTINGS } from './storage';
import type { PaydaySettings } from '../types';

describe('Storage & Language detection', () => {
  const store: Record<string, string> = {};

  beforeEach(async () => {
    for (const key of Object.keys(store)) {
      delete store[key];
    }

    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) {
          delete store[key];
        }
      },
    });

    await clearSettings();
  });

  it('detects default language fallback to English or browser language', () => {
    const lang = detectBrowserLanguage();
    expect(['fr', 'en', 'de', 'it', 'pt', 'nl']).toContain(lang);
  });

  it('saves and loads settings via fallback/storage', async () => {
    const customSettings: PaydaySettings = {
      ...DEFAULT_SETTINGS,
      payDay: 25,
      weekendRule: 'previous-working-day',
      language: 'fr',
      displayFormat: 'weeks-days',
    };

    await saveSettings(customSettings);
    const loaded = await loadSettings();

    expect(loaded).toBeDefined();
    expect(loaded?.payDay).toBe(25);
    expect(loaded?.weekendRule).toBe('previous-working-day');
    expect(loaded?.language).toBe('fr');
    expect(loaded?.displayFormat).toBe('weeks-days');
  });

  it('clears settings properly', async () => {
    const customSettings: PaydaySettings = {
      ...DEFAULT_SETTINGS,
      payDay: 15,
    };

    await saveSettings(customSettings);
    await clearSettings();

    const loaded = await loadSettings();
    expect(loaded).toBeNull();
  });
});
