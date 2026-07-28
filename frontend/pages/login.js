import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      window.localStorage.setItem("tb_token", data.token);
      window.localStorage.setItem("tb_user", JSON.stringify(data.user));
      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block">Email</label>
            <input
              name="email"
              type="email"
              className="border p-2 w-full"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block">Password</label>
            <input
              name="password"
              type="password"
              className="border p-2 w-full"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
