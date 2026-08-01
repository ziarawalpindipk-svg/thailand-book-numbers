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

  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openWhatsApp() {
    const clean = sanitizePhone(OWNER_WHATSAPP);
    if (!clean) return;
    const msg = encodeURIComponent("Hi, I have a question about Thailand Book Numbers / Overseas.");
    window.open(`https://wa.me/${clean}?text=${msg}`, "_blank");
  }

  return (
    <div className="fixed right-4 bottom-20 md:bottom-6 flex flex-col gap-3 z-40">
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 rounded-full bg-gray-800 text-white text-xl shadow-lg flex items-center justify-center"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
      {OWNER_WHATSAPP && (
        <button
          onClick={openWhatsApp}
          className="w-12 h-12 rounded-full bg-green-500 text-white text-2xl shadow-lg flex items-center justify-center"
          aria-label="Contact on WhatsApp"
        >
          📱
        </button>
      )}
    </div>
  );
}
