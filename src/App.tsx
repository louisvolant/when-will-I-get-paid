import { useState, useEffect, useMemo, useRef } from 'react';
import type { DisplayFormat, PaydaySettings, SupportedLanguage, WeekendRule } from './types';
import { calculatePayday } from './utils/calculator';
import { loadSettings, saveSettings, clearSettings, detectBrowserLanguage, DEFAULT_SETTINGS } from './services/storage';
import { getTranslation } from './i18n';
import { firePaydayConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { HeroCountdown } from './components/HeroCountdown';
import { CycleProgressBar } from './components/CycleProgressBar';
import { UpcomingPaydays } from './components/UpcomingPaydays';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function App() {
  const [settings, setSettings] = useState<PaydaySettings>(() => ({
    ...DEFAULT_SETTINGS,
    language: detectBrowserLanguage(),
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const hasCelebratedToday = useRef(false);

  // 1. Load initial settings from IndexedDB (or detect first visit)
  useEffect(() => {
    let mounted = true;
    async function init() {
      const stored = await loadSettings();
      if (!mounted) return;

      if (stored) {
        setSettings(stored);
        setIsFirstVisit(false);
      } else {
        // First visit: auto-detect language
        const detectedLang = detectBrowserLanguage();
        setSettings((prev) => ({
          ...prev,
          language: detectedLang,
        }));
        setIsFirstVisit(true);
      }
      setIsLoading(false);
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Realtime clock ticking (every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. PWA install prompt handler
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // 4. Calculate payday values
  const calculation = useMemo(() => {
    return calculatePayday(settings.payDay, settings.weekendRule, currentTime);
  }, [settings.payDay, settings.weekendRule, currentTime]);

  // 5. Fire confetti automatically if today is payday
  useEffect(() => {
    if (!isLoading && calculation.isToday && !hasCelebratedToday.current) {
      hasCelebratedToday.current = true;
      const timeout = setTimeout(() => {
        firePaydayConfetti();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, calculation.isToday]);

  // Handler: Update and persist settings
  const handleUpdateSettings = async (updates: Partial<PaydaySettings>) => {
    const nextSettings = { ...settings, ...updates };
    setSettings(nextSettings);
    await saveSettings(nextSettings);
  };

  // Handler: Onboarding completion
  const handleOnboardingSave = async (payDay: number, weekendRule: WeekendRule) => {
    const nextSettings: PaydaySettings = {
      ...settings,
      payDay,
      weekendRule,
    };
    setSettings(nextSettings);
    setIsFirstVisit(false);
    await saveSettings(nextSettings);
  };

  // Handler: Reset preferences
  const handleReset = async () => {
    await clearSettings();
    const fresh: PaydaySettings = {
      ...DEFAULT_SETTINGS,
      language: detectBrowserLanguage(),
    };
    setSettings(fresh);
    setIsFirstVisit(true);
  };

  // Handler: Trigger PWA install
  const handleInstallPwa = async () => {
    if (!deferredInstallPrompt) return;
    await deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredInstallPrompt(null);
    }
  };

  const dict = getTranslation(settings.language);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-emerald-400">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        currentLanguage={settings.language}
        onLanguageChange={(language: SupportedLanguage) => handleUpdateSettings({ language })}
        onOpenSettings={() => setIsSettingsOpen(true)}
        canInstallPwa={Boolean(deferredInstallPrompt)}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
        {/* Main Countdown Hero */}
        <HeroCountdown
          calculation={calculation}
          language={settings.language}
          displayFormat={settings.displayFormat}
          onFormatChange={(format: DisplayFormat) => handleUpdateSettings({ displayFormat: format })}
          onOpenSettings={() => setIsSettingsOpen(true)}
          targetDay={settings.payDay}
        />

        {/* Monthly Cycle Progress */}
        <CycleProgressBar
          calculation={calculation}
          language={settings.language}
        />

        {/* Upcoming Paydays List */}
        <UpcomingPaydays
          paydays={calculation.upcomingPaydays}
          language={settings.language}
        />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-6 text-center text-xs text-slate-400 border-t border-slate-900">
        <p>
          {dict.appTitle} • {dict.offlineReady} (PWA & IndexedDB)
        </p>
      </footer>

      {/* Onboarding Modal (shown on first visit) */}
      {isFirstVisit && (
        <OnboardingModal
          language={settings.language}
          onSave={handleOnboardingSave}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onReset={handleReset}
      />

      {/* PWA Install Banner */}
      <PwaInstallPrompt
        language={settings.language}
        canInstall={Boolean(deferredInstallPrompt)}
        onInstall={handleInstallPwa}
      />
    </div>
  );
}

export default App;
