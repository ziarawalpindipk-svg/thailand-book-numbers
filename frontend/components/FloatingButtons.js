import { useEffect, useState } from "react";

function sanitizePhone(raw) {
  if (!raw) return "";
  let cleaned = String(raw).replace(/\D/g, "");
  if (cleaned.startsWith("00")) cleaned = cleaned.slice(2);
  return cleaned;
}

const OWNER_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export default function FloatingButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // --- Install App state ---
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !window.MSStream);

    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setInstalled(true);
    }

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
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstallClick() {
    // Android/Chrome and other browsers that support the native prompt.
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }
    // Everyone else (iOS Safari, desktop browsers, or Chrome before the
    // event has fired yet) - show manual instructions instead. This is a
    // real limitation of the web platform, not something any site can
    // bypass: only Chrome/Edge/Android expose a 1-tap install prompt.
    setShowInstallHelp(true);
  }

  function openWhatsApp() {
    const clean = sanitizePhone(OWNER_WHATSAPP);
    if (!clean) return;
    const msg = encodeURIComponent("Hi, I have a question about Thailand Book Numbers / Overseas.");
    window.open(`https://wa.me/${clean}?text=${msg}`, "_blank");
  }

  async function handleShare() {
    const shareData = {
      title: "Thailand Book Numbers - Overseas",
      text: "Discover 000 to 999 unique Thai Book Numbers - make your offer!",
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled the share sheet - nothing to do.
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      alert("Link copied! You can now paste it anywhere to share.");
    }
  }

  return (
    <>
      <div className="fixed right-4 bottom-20 md:bottom-6 flex flex-col gap-3 z-40">
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-12 h-12 rounded-full bg-teal-700 text-white text-xl shadow-lg flex items-center justify-center"
            aria-label="Back to top"
          >
            ↑
          </button>
        )}

        {!installed && (
          <button
            onClick={handleInstallClick}
            className="w-12 h-12 rounded-full bg-coral-500 text-white text-2xl shadow-lg flex items-center justify-center animate-pulse"
            aria-label="Add to Home Screen"
            title="Add to Home Screen"
          >
            📲
          </button>
        )}

        <button
          onClick={handleShare}
          className="tb-share-btn w-12 h-12 rounded-full bg-blue-500 text-white text-2xl shadow-lg flex items-center justify-center"
          aria-label="Share this website"
          title="Share this website"
        >
          🔗
        </button>

        {OWNER_WHATSAPP && (
          <button
            onClick={openWhatsApp}
            className="w-12 h-12 rounded-full bg-green-500 text-white text-2xl shadow-lg flex items-center justify-center"
            aria-label="Contact on WhatsApp"
          >
            💬
          </button>
        )}
      </div>

      {showInstallHelp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowInstallHelp(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-teal-800 mb-3">
              📲 Add to Home Screen
            </h3>
            {isIOS ? (
              <p className="text-sm text-gray-700">
                On iPhone/iPad: tap the <strong>Share</strong> icon in Safari
                (square with an arrow), then choose{" "}
                <strong>"Add to Home Screen"</strong>.
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                Look for an <strong>install icon</strong> in your browser's
                address bar, or open your browser's menu (⋮ or ≡) and choose{" "}
                <strong>"Install app"</strong> / <strong>"Add to Home Screen"</strong>.
                This option is available on Chrome, Edge, and most Android
                browsers.
              </p>
            )}
            <button
              onClick={() => setShowInstallHelp(false)}
              className="mt-4 w-full bg-teal-700 text-white py-2 rounded font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
