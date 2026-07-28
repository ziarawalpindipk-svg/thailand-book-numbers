import Link from "next/link";
import InstallButton from "./InstallButton";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">Thailand Book Numbers</span>
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/admin">Admin</Link>
          <InstallButton />
        </nav>
      </div>
    </header>
  );
}
