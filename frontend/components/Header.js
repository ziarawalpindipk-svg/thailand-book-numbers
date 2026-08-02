import { useEffect, useState } from "react";
import Link from "next/link";
import CurrencySelector from "./CurrencySelector";
import { getCart } from "../utils/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-to-offer", label: "How to Offer" },
  { href: "/news", label: "News" },
  { href: "/cart", label: "Selected" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
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

          {/* Desktop nav - hidden on small screens */}
          <nav className="hidden md:flex flex-wrap gap-x-3 gap-y-1 items-center justify-end">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="relative text-sm">
                {link.label}
                {link.href === "/cart" && count > 0 && (
                  <span className="absolute -top-2 -right-3 bg-coral-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Hamburger button - only visible on small screens */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>
        </div>

        {/* Mobile dropdown menu - just the page links, currency/translate
            live in the persistent bar below so they never get hidden */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col mt-3 space-y-3 max-w-6xl mx-auto px-1">
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

      {/* Persistent utility bar - always visible on every page, regardless
          of whether the hamburger menu is open or closed. */}
      <div className="bg-teal-700 text-white flex items-center justify-center py-2 text-sm">
        <CurrencySelector />
      </div>
    </header>
  );
}
