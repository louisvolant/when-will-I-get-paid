import React from 'react';
import { Share, PlusSquare, X, Smartphone } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface IosInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const IosInstallModal: React.FC<IosInstallModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const dict = getTranslation(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              {dict.installApp} (iOS Safari)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={dict.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step by step */}
        <div className="py-4 space-y-3.5">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <Share className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Étape 1</span>
              <p className="text-[12px] text-slate-300 mt-0.5 leading-snug">
                {dict.iosInstallStep1}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Étape 2</span>
              <p className="text-[12px] text-slate-300 mt-0.5 leading-snug">
                {dict.iosInstallStep2}
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          {dict.close}
        </button>
      </div>
    </div>
  );
};
