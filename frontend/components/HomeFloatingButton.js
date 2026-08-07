import { useRouter } from "next/router";
import Link from "next/link";

// Sits below the header/utility bars (not on top of the site title!) at
// the left edge, on every page except Home - a glowing, pulsing button so
// people never get stuck wondering how to get back.
export default function HomeFloatingButton() {
  const router = useRouter();

  if (router.pathname === "/") return null;

  return (
    <Link
      href="/"
      className="tb-home-btn fixed top-24 left-3 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-coral-400 to-coral-600 text-white shadow-lg flex items-center justify-center text-2xl"
      aria-label="Back to Home"
      title="Back to Home"
    >
      🏠
    </Link>
  );
}
