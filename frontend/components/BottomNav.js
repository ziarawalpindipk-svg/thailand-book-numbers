import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart } from "../utils/cart";

export default function BottomNav() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function refresh() {
      setCount(getCart().length);
    }
    refresh();
    // Refresh when returning to the tab / after navigation
    window.addEventListener("focus", refresh);
    const interval = setInterval(refresh, 1500);
    return () => {
      window.removeEventListener("focus", refresh);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around h-14 z-40">
      <Link href="/" className="flex flex-col items-center text-xs text-gray-700">
        <span className="text-lg">🏠</span>
        Home
      </Link>
      <Link href="/cart" className="flex flex-col items-center text-xs text-gray-700 relative">
        <span className="text-lg">📚</span>
        Selected
        {count > 0 && (
          <span className="absolute -top-1 right-1 bg-coral-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
      <Link href="/checkout" className="flex flex-col items-center text-xs text-gray-700">
        <span className="text-lg">✅</span>
        Checkout
      </Link>
    </nav>
  );
}
