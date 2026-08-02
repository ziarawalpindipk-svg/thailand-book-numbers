// Currency list - Gulf currencies first, then others. No conversion rates
// here anymore: whichever currency is selected, offer amounts are simply
// whole numbers in THAT currency (1, 2, 3, 4...). Nothing is calculated
// from or converted to USD.
export const CURRENCIES = [
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KWD" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR" },
  { code: "AED", name: "UAE Dirham", symbol: "AED" },
  { code: "QAR", name: "Qatari Riyal", symbol: "QAR" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "BHD" },
  { code: "OMR", name: "Omani Rial", symbol: "OMR" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
];

const STORAGE_KEY = "tb_currency";

export function getSavedCurrency() {
  if (typeof window === "undefined") return "USD";
  return window.localStorage.getItem(STORAGE_KEY) || "USD";
}

// Changing currency while the cart has items would mix units that can't be
// compared (e.g. "3 KWD" + "3 PKR" is not "6" of anything), so the caller
// (CurrencySelector) must confirm with the user and clear the cart first.
// This function just performs the actual save + broadcast once that's done.
export function saveCurrency(code) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, code);
  window.dispatchEvent(new CustomEvent("tb-currency-changed", { detail: code }));
}

export function getCurrencyInfo(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

// Simple "<symbol> <amount>" formatting - no math, no conversion.
export function formatAmount(amount, code) {
  const info = getCurrencyInfo(code);
  return `${info.symbol} ${amount}`;
}
