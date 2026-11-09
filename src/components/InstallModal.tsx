import React from 'react';
import { X, Laptop, Tablet, CheckCircle, Download, Sparkles, Layers, ShieldCheck, Wifi } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isChromebook: boolean;
  isIOS: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
  isInstalled,
  isChromebook,
  isIOS,
}) => {
  if (!isOpen) return null;

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
                Install & Run on Chromebook or Tablet
              </h3>
              <p className="text-xs text-slate-600">
                Turn Querviam into a 1-click desktop app with offline support
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
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
                <div className="font-bold text-sm">App Already Installed!</div>
                <div className="text-xs text-emerald-700">
                  Querviam is running in standalone mode on your device. You can access it directly from your Chromebook Launcher or Shelf.
                </div>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-600 text-white shadow-md">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 shrink-0" />
                <div>
                  <div className="font-bold text-base">Ready for 1-Click Install</div>
                  <div className="text-xs text-emerald-100">
                    Add Querviam directly to your Chromebook Shelf & Launcher.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onInstall}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#008450] hover:bg-emerald-50 font-bold rounded-xl shadow-xs transition shrink-0"
              >
                Install Querviam Now
              </button>
            </div>
          ) : null}

          {/* Chromebook Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Laptop className="w-5 h-5 text-[#008450]" />
              <span>Chromebook Experience (Chrome OS)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">1</span>
                  Install to Shelf
                </div>
                <p className="text-xs text-slate-600">
                  Click the <strong>Install</strong> icon in Chrome's address bar (or the green button above). Querviam pins to your bottom Shelf and Launcher.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">2</span>
                  Standalone Window
                </div>
                <p className="text-xs text-slate-600">
                  Opens as a distraction-free window without address bar or browser tabs, exactly like a native Linux or Android application.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">3</span>
                  Offline Ready
                </div>
                <p className="text-xs text-slate-600">
                  The Service Worker caches stories and UI assets so you can practice on flights, buses, or offline classrooms.
                </p>
              </div>
            </div>
          </div>

          {/* Tablet Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Tablet className="w-5 h-5 text-blue-600" />
              <span>Tablet & Touchscreen Features</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                • <strong>Tap-to-Place Scramble Mode</strong>: On touchscreen tablets and 2-in-1 Chromebooks in tent/tablet mode, you can tap any word tile to move it into sentence slots without struggling with clumsy touch-dragging.
              </p>
              <p>
                • <strong>Built-in Offline Voices</strong>: Chrome OS and Android have high-quality built-in text-to-speech voices that speak without buffering or needing data.
              </p>
              <p>
                • <strong>Pronunciation Mic Recording</strong>: Tap the microphone icon on any sentence to practice saying it out loud and listen back to compare your accent.
              </p>
            </div>
          </div>

          {/* Chromebook Keyboard Shortcuts */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              ⌨️ Chromebook Keyboard Shortcuts
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">Space</kbd> Play / Pause story</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">↑ / ↓</kbd> Prev / Next sentence</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">R</kbd> Repeat selected sentence</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">L</kbd> Open Story Library</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">V</kbd> Vocabulary Flashcards</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">Q</kbd> Comprehension Quiz</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">G</kbd> Grammar Deep-Dive</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">S</kbd> Study Sheet & PDF</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">P / B</kbd> Switch Practice / Build tab</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">Esc</kbd> Close open dialogs</div>
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
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
