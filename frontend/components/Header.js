import { useState } from "react";
import Link from "next/link";
import InstallButton from "./InstallButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cart", label: "Cart" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white p-4 relative">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <span className="text-lg sm:text-xl font-bold cursor-pointer">
            Thailand Book Numbers
          </span>
        </Link>

        {/* Desktop nav - hidden on small screens */}
        <nav className="hidden md:flex space-x-4 items-center">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
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
              className="border-b border-gray-700 pb-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pb-2">
            <InstallButton />
          </div>
        </nav>
      )}
    </header>
  );
}
