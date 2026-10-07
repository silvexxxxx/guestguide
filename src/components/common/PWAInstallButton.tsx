import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Verifica se è già installata in modalità standalone
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Rileva iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Gestione evento beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Evento app installata
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Se l'app è già installata o l'utente ha chiuso il banner per questa sessione, non mostrare
  if (isStandalone || dismissed) return null;

  // Mostra il pulsante se abbiamo il prompt Android/Chrome o se siamo su iOS
  const canInstall = Boolean(deferredPrompt || isIOS);

  if (!canInstall && !installedSuccess) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {/* Notifica di successo installazione */}
      {installedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-semibold">App installata con successo sulla Home!</span>
        </div>
      )}

      {/* Pulsante Flottante Installa */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-sky-600 via-sky-700 to-amber-600 text-white pl-3.5 pr-2 py-2 rounded-full shadow-2xl hover:shadow-sky-500/30 border border-white/20 backdrop-blur-md transition-all hover:scale-105 group">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="pr-1">
              <span className="text-xs font-bold block leading-tight">Installa App</span>
              <span className="text-[10px] text-sky-100 block leading-none">Accesso rapido da Home</span>
            </div>
          </button>

          <button
            onClick={() => setDismissed(true)}
            title="Chiudi avviso"
            className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal Guida Installazione iOS (iPhone / iPad) */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-sky-100 animate-in slide-in-from-bottom-6 duration-200">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md overflow-hidden">
              <img src="/icon-192.png" alt="GuestGuide" className="w-full h-full object-cover" />
            </div>

            <h3 className="text-lg font-bold text-center text-gray-900">
              Installa GuestGuide su iPhone
            </h3>
            <p className="text-xs text-center text-gray-500 mt-1 mb-5">
              Aggiungi l'icona alla tua schermata Home per aprirla come una vera app
            </p>

            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  Tocca il pulsante <strong>Condividi</strong> (<Share className="w-3.5 h-3.5 inline text-sky-600" />) in basso su Safari.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  Scorri il menu e tocca <strong>Aggiungi alla schermata Home</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-gray-600" />).
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>
                  Premi <strong>Aggiungi</strong> in alto a destra. Fatto!
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-5 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Ho capito
            </button>
          </div>
        </div>
      )}
    </>
  );
};
