import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useAdminGuard from "../../utils/useAdminGuard";

const ADMIN_LINKS = [
  { href: "/admin/books", label: "📚 Manage Book Numbers" },
  { href: "/admin/offers", label: "📥 Manage Offers" },
  { href: "/admin/payments", label: "💳 Payments" },
  { href: "/admin/users", label: "👤 Users" },
  { href: "/admin/news", label: "📰 Manage News" },
  { href: "/admin/image-ads", label: "🖼️ Image Ads" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { checking } = useAdminGuard();

  function handleLogout() {
    window.localStorage.removeItem("tb_admin_token");
    router.push("/admin/login");
  }

  if (checking) return null;

  return (
    <div>
      <Header />
      <main className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-red-600 underline">
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="border p-4 rounded shadow">
            <h2>Total Book Numbers</h2>
            <p>999</p>
          </div>
          <div className="border p-4 rounded shadow">
            <h2>Pending Offers</h2>
            <p>0</p>
          </div>
          <div className="border p-4 rounded shadow">
            <h2>Accepted Offers</h2>
            <p>0</p>
          </div>
          <div className="border p-4 rounded shadow">
            <h2>Total Revenue</h2>
            <p>$0</p>
          </div>
        </div>

        <h2 className="font-bold mt-8 mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border rounded p-3 text-center bg-teal-50 hover:bg-teal-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
