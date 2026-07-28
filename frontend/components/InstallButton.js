import { useEffect, useState } from "react";

// Shows a real one-tap "Install App" button on Android/Chrome (using the
// native beforeinstallprompt event) and a short instruction on iOS Safari,
// which does not support a programmatic install prompt.
export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !window.MSStream);

    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    function handleAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleClick() {
    if (isIOS) {
      setShowIOSHint(true);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (installed) return null;
  if (!isIOS && !deferredPrompt) return null; // nothing to offer yet

  return (
    <div className="inline-block relative">
      <button
        onClick={handleClick}
        className="bg-white text-red-600 border border-white px-3 py-1 rounded text-sm font-semibold"
      >
        📲 Install App
      </button>
      {showIOSHint && (
        <div className="absolute right-0 mt-2 w-56 bg-white text-black text-xs p-3 rounded shadow-lg z-50">
          On iPhone/iPad: tap the <strong>Share</strong> icon in Safari, then
          choose <strong>"Add to Home Screen"</strong>.
          <button
            onClick={() => setShowIOSHint(false)}
            className="block mt-2 text-red-600 underline"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
