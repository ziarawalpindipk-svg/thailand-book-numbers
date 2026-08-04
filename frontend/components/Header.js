import { useEffect, useState } from "react";
import Link from "next/link";
import CurrencySelector from "./CurrencySelector";
import RandomTicker from "./RandomTicker";
import { getCart } from "../utils/cart";

// Labels shown to the user; hrefs are unchanged so nothing breaks.
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-to-offer", label: "How to Play" },
  { href: "/news", label: "Tips & News" },
  { href: "/cart", label: "Selected" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    function refresh() {
      setCount(getCart().length);
    }
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("tb-cart-changed", refresh);
    const interval = setInterval(refresh, 1500);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("tb-cart-changed", refresh);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="relative">
      <div className="bg-teal-800 text-white p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <span className="notranslate text-lg sm:text-xl font-bold cursor-pointer">
              Thailand Book Numbers - Overseas
            </span>
          </Link>

          {/* Hamburger button - kept for extra/future items */}
          <button
            className="p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>
        </div>

        {/* Hamburger dropdown menu */}
        {menuOpen && (
          <nav className="flex flex-col mt-3 space-y-3 max-w-6xl mx-auto px-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-teal-600 pb-2 flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.href === "/cart" && count > 0 && (
                  <span className="bg-coral-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Persistent utility bar - always visible on every page. All 5
          items sit on one line; on very narrow phones the row scrolls
          sideways instead of wrapping, so it never breaks the layout. */}
      <div className="bg-teal-700 text-white overflow-x-auto">
        <div className="flex items-center gap-2 py-2 px-3 whitespace-nowrap w-max mx-auto">
          <CurrencySelector />
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative shrink-0 bg-white text-teal-800 rounded-full px-3 py-1 shadow-md border border-teal-100 font-semibold text-sm"
            >
              {link.label}
              {link.href === "/cart" && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-coral-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          ))}
          <RandomTicker />
        </div>
      </div>
    </header>
  );
}
