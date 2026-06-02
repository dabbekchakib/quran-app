import { useState, useEffect, useCallback } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches
  );
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isInstalled) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
  }, []);

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 right-4 left-4 z-50 max-w-md mx-auto">
      <div className="bg-slate-800 border border-teal-500/20 rounded-2xl p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
            <FaDownload className="text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200 font-bold mb-1">ثبّت التطبيق</p>
            <p className="text-xs text-slate-400">ثبّت القرآن الكريم على جهازك للتصفح بدون إنترنت</p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="إغلاق"
          >
            <FaTimes size={14} />
          </button>
        </div>
        <button
          onClick={handleInstall}
          className="w-full mt-3 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-sm font-medium transition-all"
        >
          تثبيت التطبيق
        </button>
      </div>
    </div>
  );
};

export default InstallPWAButton;
