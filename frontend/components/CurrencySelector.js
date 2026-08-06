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
    <>
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 flex items-center gap-1.5 bg-white text-teal-800 rounded-full pl-1.5 pr-3 py-1 shadow-md hover:shadow-lg transition-all border border-teal-100 font-semibold text-sm"
      >
        <span className="text-lg leading-none">{currentInfo.flag}</span>
        <span>{currentInfo.code}</span>
        <span className="text-xs text-teal-500">▾</span>
      </button>

      {/* Rendered as a centered full-screen overlay (not an anchored
          dropdown) so it can never get clipped by the scrolling nav bar
          it lives in - same pattern as the book-offer dialog. */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white text-black rounded-xl shadow-2xl w-72 max-h-[70vh] overflow-y-auto py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="px-4 py-2 text-xs text-gray-400 font-semibold uppercase">
              Choose Currency
            </p>
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
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-center mt-1 px-4 py-2 text-sm text-gray-500 border-t"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
