import { useEffect, useState } from "react";
import Link from "next/link";
import InstallButton from "./InstallButton";
import CurrencySelector from "./CurrencySelector";
import { getCart } from "../utils/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
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
    const interval = setInterval(refresh, 1500);
    return () => {
      window.removeEventListener("focus", refresh);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="bg-gray-900 text-white p-4 relative">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <span className="text-lg sm:text-xl font-bold cursor-pointer">
            Thailand Book Numbers - Overseas
          </span>
        </Link>

        {/* Desktop nav - hidden on small screens */}
        <nav className="hidden md:flex space-x-4 items-center">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="relative">
              {link.label}
              {link.href === "/cart" && count > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          ))}
          <CurrencySelector />
          <InstallButton />
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

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col mt-3 space-y-3 max-w-6xl mx-auto px-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-gray-700 pb-2 flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.href === "/cart" && count > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          ))}
          <div className="pb-2 flex items-center gap-3">
            <CurrencySelector />
            <InstallButton />
          </div>
        </nav>
      )}
    </header>
  );
}
