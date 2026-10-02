import React, { useState } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface PwaInstallPromptProps {
  language: SupportedLanguage;
  canInstall: boolean;
  isIos: boolean;
  onInstall: () => void;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({
  language,
  canInstall,
  isIos,
  onInstall,
}) => {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return Boolean(sessionStorage.getItem('pwa_prompt_dismissed'));
    } catch {
      return false;
    }
  });
  const dict = getTranslation(language);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  if (!canInstall || dismissed) {
    return null;
  }

  return (
    <aside
      aria-label={dict.installApp}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 rounded-2xl bg-slate-900/95 border border-emerald-500/30 p-4 shadow-2xl backdrop-blur-lg animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shrink-0">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-emerald-400 font-bold">
            €
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-xs font-bold text-white tracking-wide">
            {dict.installApp}
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            {dict.installAppDesc}
          </p>

          {isIos ? (
            <div className="mt-2.5 space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Share className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>1. {dict.iosInstallStep1}</span>
              </div>
              <div className="flex items-center gap-2">
                <PlusSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>2. {dict.iosInstallStep2}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={onInstall}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {dict.installApp}
              </button>
              <button
                onClick={handleDismiss}
                className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                {dict.close}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
          aria-label={dict.close}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
