import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useAdminGuard from "../../utils/useAdminGuard";

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
            <h2>Total Books</h2>
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
      </main>
      <Footer />
    </div>
  );
}
