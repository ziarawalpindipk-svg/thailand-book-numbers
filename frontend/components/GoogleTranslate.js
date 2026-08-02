import { useState } from "react";

// A simple, always-visible "Translate" dropdown. Instead of embedding
// Google's inline widget (which can be hard to see on dark backgrounds and
// sometimes takes a moment to render), this opens the current page through
// Google's translation service in the chosen language - guaranteed to show
// up and work the same way on every browser.
const LANGUAGES = [
  { code: "ar", label: "العربية (Arabic)" },
  { code: "zh-CN", label: "中文 (Chinese)" },
  { code: "fr", label: "Français (French)" },
  { code: "de", label: "Deutsch (German)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ja", label: "日本語 (Japanese)" },
  { code: "ko", label: "한국어 (Korean)" },
  { code: "fa", label: "فارسی (Persian)" },
  { code: "pt", label: "Português (Portuguese)" },
  { code: "ru", label: "Русский (Russian)" },
  { code: "es", label: "Español (Spanish)" },
  { code: "th", label: "ไทย (Thai)" },
  { code: "tr", label: "Türkçe (Turkish)" },
  { code: "ur", label: "اردو (Urdu)" },
];

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);

  function handleSelect(code) {
    setOpen(false);
    const currentUrl = window.location.href;
    const translateUrl = `https://translate.google.com/translate?sl=en&tl=${code}&u=${encodeURIComponent(currentUrl)}`;
    window.open(translateUrl, "_blank");
  }

  return (
    <div className="relative inline-block notranslate">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm bg-white text-teal-800 rounded px-2 py-1 font-medium"
      >
        🌐 Translate ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white text-black rounded shadow-lg z-50 w-56 max-h-72 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
