// Approximate, static USD conversion rates - for DISPLAY convenience only.
// The actual offer amount stored in the database and sent via WhatsApp is
// always in USD; this just helps international buyers get a rough sense of
// what an offer means in their own currency. Rates are not live/real-time -
// update them here occasionally, or swap in a live FX API later if needed.
export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs", rate: 278 },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR", rate: 3.75 },
  { code: "AED", name: "UAE Dirham", symbol: "AED", rate: 3.67 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83 },
  { code: "THB", name: "Thai Baht", symbol: "฿", rate: 35 },
];

const STORAGE_KEY = "tb_currency";

export function getSavedCurrency() {
  if (typeof window === "undefined") return "USD";
  return window.localStorage.getItem(STORAGE_KEY) || "USD";
}

export function saveCurrency(code) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, code);
}

export function getCurrencyInfo(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

// Converts a USD amount into the display currency and formats it, e.g.
// formatFromUSD(5, "PKR") -> "Rs 1,390"
export function formatFromUSD(amountUSD, code) {
  const info = getCurrencyInfo(code);
  const converted = amountUSD * info.rate;
  const rounded = converted >= 100 ? Math.round(converted) : Math.round(converted * 100) / 100;
  return `${info.symbol} ${rounded.toLocaleString()}`;
}
