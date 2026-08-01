import { useEffect, useState } from "react";
import { CURRENCIES, getSavedCurrency, saveCurrency } from "../utils/currency";

export default function CurrencySelector({ onChange }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("USD");

  useEffect(() => {
    setCurrent(getSavedCurrency());
  }, []);

  function handleSelect(code) {
    saveCurrency(code);
    setCurrent(code);
    setOpen(false);
    if (onChange) onChange(code);
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm border border-gray-500 rounded px-2 py-1"
      >
        💰 {current} ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white text-black rounded shadow-lg z-50 w-48 max-h-64 overflow-y-auto">
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
