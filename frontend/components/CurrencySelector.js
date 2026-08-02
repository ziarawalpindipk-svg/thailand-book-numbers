import { useEffect, useState } from "react";
import { CURRENCIES, getSavedCurrency, saveCurrency } from "../utils/currency";
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

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm bg-white text-teal-800 rounded px-2 py-1 font-medium"
      >
        💰 {current} ▾
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-1 bg-white text-black rounded shadow-lg z-50 w-48 max-h-64 overflow-y-auto">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                c.code === current ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {c.symbol} {c.code} - {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
