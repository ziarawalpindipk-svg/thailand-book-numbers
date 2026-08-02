import { useEffect, useMemo, useState } from "react";
import { addToCart, getCart } from "../utils/cart";
import { getSavedCurrency, getCurrencyInfo } from "../utils/currency";

const RANGES = [
  { label: "000-099", start: 0, end: 99 },
  { label: "100-199", start: 100, end: 199 },
  { label: "200-299", start: 200, end: 299 },
  { label: "300-399", start: 300, end: 399 },
  { label: "400-499", start: 400, end: 499 },
  { label: "500-599", start: 500, end: 599 },
  { label: "600-699", start: 600, end: 699 },
  { label: "700-799", start: 700, end: 799 },
  { label: "800-899", start: 800, end: 899 },
  { label: "900-999", start: 900, end: 999 },
];

function pad(n) {
  return n.toString().padStart(3, "0");
}

export default function BookNumberGrid({ onSelectionChange }) {
  const [range, setRange] = useState(RANGES[0]);
  const [search, setSearch] = useState("");
  const [selectedSerials, setSelectedSerials] = useState([]);
  const [dialogSerial, setDialogSerial] = useState(null);
  const [offerPrice, setOfferPrice] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    refreshSelected();
    setCurrency(getSavedCurrency());

    function handleCurrencyChange(e) {
      setCurrency(e.detail);
      refreshSelected(); // cart may have just been cleared by the currency switch
    }
    function handleCartChange() {
      refreshSelected();
    }
    window.addEventListener("tb-currency-changed", handleCurrencyChange);
    window.addEventListener("tb-cart-changed", handleCartChange);
    return () => {
      window.removeEventListener("tb-currency-changed", handleCurrencyChange);
      window.removeEventListener("tb-cart-changed", handleCartChange);
    };
  }, []);

  function refreshSelected() {
    const cart = getCart();
    setSelectedSerials(cart.map((i) => i.serial));
    if (onSelectionChange) onSelectionChange(cart.length);
  }

  const visibleNumbers = useMemo(() => {
    if (search.trim()) {
      const q = search.trim();
      const nums = [];
      for (let i = 0; i <= 999; i++) {
        const s = pad(i);
        if (s.includes(q)) nums.push(s);
      }
      return nums;
    }
    const nums = [];
    for (let i = range.start; i <= range.end; i++) nums.push(pad(i));
    return nums;
  }, [range, search]);

  function openDialog(serial) {
    setDialogSerial(serial);
    setOfferPrice(1);
    setAdded(false);
  }

  function closeDialog() {
    setDialogSerial(null);
  }

  function handleAdd() {
    if (offerPrice < 1) return;
    addToCart(dialogSerial, offerPrice, 1, currency);
    refreshSelected();
    setAdded(true);
    setTimeout(() => closeDialog(), 700);
  }

  const currencyInfo = getCurrencyInfo(currency);

  return (
    <div>
      {/* Search */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          inputMode="numeric"
          maxLength={3}
          placeholder="Search book number (000-999)"
          className="border p-2 flex-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value.replace(/\D/g, ""))}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="border px-3 rounded text-sm text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick jump ranges */}
      {!search && (
        <div className="flex flex-wrap gap-1 mb-4">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r)}
              className={`text-xs px-2 py-1 rounded border ${
                r.label === range.label
                  ? "bg-coral-500 text-white border-coral-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {/* Number grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {visibleNumbers.map((num) => {
          const isSelected = selectedSerials.includes(num);
          return (
            <button
              key={num}
              onClick={() => openDialog(num)}
              className={`aspect-square rounded border-2 text-sm font-semibold flex items-center justify-center transition ${
                isSelected
                  ? "bg-teal-50 border-teal-600 text-teal-700"
                  : "bg-white border-gray-300 text-gray-800 hover:border-coral-400"
              }`}
            >
              {num}
              {isSelected && <span className="ml-1 text-xs">✓</span>}
            </button>
          );
        })}
      </div>

      {visibleNumbers.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No matching book number.</p>
      )}

      {/* Offer dialog */}
      {dialogSerial && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeDialog}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-2xl font-bold text-coral-600 mb-4">
              Book #{dialogSerial}
            </h3>

            <label className="block text-sm mb-1">
              Your Offer (min 1 {currencyInfo.code})
            </label>
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={() => setOfferPrice((p) => Math.max(1, p - 1))}
                className="w-10 h-10 rounded-full border text-lg"
              >
                −
              </button>
              <span className="text-xl font-bold min-w-[110px] text-center">
                {currencyInfo.symbol} {offerPrice}
              </span>
              <button
                onClick={() => setOfferPrice((p) => p + 1)}
                className="w-10 h-10 rounded-full border text-lg"
              >
                +
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-coral-500 text-white py-2 rounded font-semibold"
              >
                {added ? "Added ✓" : "Add"}
              </button>
              <button
                onClick={closeDialog}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
