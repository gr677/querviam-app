import React from 'react';
import { X, Laptop, Tablet, CheckCircle, Download, Sparkles, Layers, ShieldCheck, Wifi } from 'lucide-react';
import { getT } from '../utils/translations';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isChromebook: boolean;
  isIOS: boolean;
  baseLang?: string;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
  isInstalled,
  isChromebook,
  isIOS,
  baseLang = 'English',
}) => {
  if (!isOpen) return null;
  const t = getT(baseLang);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 to-teal-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008450] text-white flex items-center justify-center shadow-sm">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t.installModalTitle}
              </h3>
              <p className="text-xs text-slate-600">
                {t.installModalSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Quick Action Banner */}
          {isInstalled ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-sm">{t.appAlreadyInstalled}</div>
                <div className="text-xs text-emerald-700">
                  {t.appAlreadyInstalledDesc}
                </div>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-600 text-white shadow-md">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 shrink-0" />
                <div>
                  <div className="font-bold text-base">{t.readyOneClickInstall}</div>
                  <div className="text-xs text-emerald-100">
                    {t.readyOneClickInstallDesc}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onInstall}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#008450] hover:bg-emerald-50 font-bold rounded-xl shadow-xs transition shrink-0"
              >
                {t.installQuerviamNow}
              </button>
            </div>
          ) : null}

          {/* Chromebook Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Laptop className="w-5 h-5 text-[#008450]" />
              <span>{t.chromebookExpTitle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">1</span>
                  {t.installToShelfTitle}
                </div>
                <p className="text-xs text-slate-600">
                  {t.installToShelfDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">2</span>
                  {t.standaloneWindowTitle}
                </div>
                <p className="text-xs text-slate-600">
                  {t.standaloneWindowDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">3</span>
                  {t.offlineReadyTitle}
                </div>
                <p className="text-xs text-slate-600">
                  {t.offlineReadyDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Tablet Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Tablet className="w-5 h-5 text-blue-600" />
              <span>{t.tabletFeaturesTitle}</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                • <strong>{t.tapToPlaceTitle}</strong> {t.tapToPlaceDesc}
              </p>
              <p>
                • <strong>{t.offlineVoicesTitle}</strong> {t.offlineVoicesDesc}
              </p>
              <p>
                • <strong>{t.micRecordingTitle}</strong> {t.micRecordingDesc}
              </p>
            </div>
          </div>

          {/* Chromebook Keyboard Shortcuts */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              {t.keyboardShortcutsTitle}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">Space</kbd> {t.listen} / {t.stop}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">↑ / ↓</kbd> {t.previousBtn} / {t.nextBtn}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">R</kbd> {t.repeatSentence}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">L</kbd> {t.library}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">V</kbd> {t.flashcardsTitle}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">Q</kbd> {t.modeQuiz}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">G</kbd> {t.grammar}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">S</kbd> {t.studySheet}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">P / B</kbd> {t.practice} / {t.build}</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">Esc</kbd> {t.close}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-[#fbfcfd] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition"
          >
            {t.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
};
