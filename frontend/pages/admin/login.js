import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      window.localStorage.setItem("tb_admin_token", data.token);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <main className="p-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-sm text-gray-600 mt-1">
          This area is for the site owner only.
        </p>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block">Admin Password</label>
            <input
              type="password"
              className="border p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-coral-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
