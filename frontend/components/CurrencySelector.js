import { useEffect, useState } from "react";
import { CURRENCIES, getSavedCurrency, saveCurrency, getCurrencyInfo } from "../utils/currency";
import { getCart, clearCart } from "../utils/cart";

export default function CurrencySelector({ onChange }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("USD");

  useEffect(() => {
    setCurrent(getSavedCurrency());
  }, []);

  function handleSelect(code) {
    if (code === current) {
      setOpen(false);
      return;
    }

    // Prices in different currencies can't be mixed (e.g. "3 KWD" and
    // "3 PKR" are very different amounts) - if there's already a selection,
    // confirm with the user before switching, since it needs to be cleared.
    const cart = getCart();
    if (cart.length > 0) {
      const confirmed = window.confirm(
        "Changing currency will clear your current selection, because offer amounts can't be mixed between currencies. Continue?"
      );
      if (!confirmed) {
        setOpen(false);
        return;
      }
      clearCart();
    }

    saveCurrency(code);
    setCurrent(code);
    setOpen(false);
    if (onChange) onChange(code);
  }

  const currentInfo = getCurrencyInfo(current);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-white text-teal-800 rounded-full pl-1.5 pr-3 py-1 shadow-md hover:shadow-lg transition-all border border-teal-100 font-semibold text-sm"
      >
        <span className="text-lg leading-none">{currentInfo.flag}</span>
        <span>{currentInfo.code}</span>
        <span
          className={`text-xs text-teal-500 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white text-black rounded-xl shadow-2xl ring-1 ring-black/5 z-50 w-64 max-h-80 overflow-y-auto py-1 animate-[fadeIn_0.15s_ease-out]"
        >
          {CURRENCIES.map((c) => {
            const isActive = c.code === current;
            return (
              <button
                key={c.code}
                onClick={() => handleSelect(c.code)}
                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-teal-50" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <span className="flex-1">
                  <span className="font-semibold">{c.code}</span>
                  <span className="text-gray-500"> - {c.name}</span>
                </span>
                {isActive && <span className="text-teal-600 font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
