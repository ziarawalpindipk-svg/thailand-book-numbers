import { useRouter } from "next/router";
import Link from "next/link";

// Sits at the top-left of every page (except Home itself) so people never
// get stuck wondering how to get back - no need to know about the
// hamburger menu at all.
export default function HomeFloatingButton() {
  const router = useRouter();

  if (router.pathname === "/") return null;

  return (
    <Link
      href="/"
      className="fixed top-3 left-3 z-50 w-11 h-11 rounded-full bg-white text-teal-800 shadow-lg flex items-center justify-center text-xl border border-teal-100"
      aria-label="Back to Home"
      title="Back to Home"
    >
      🏠
    </Link>
  );
}
