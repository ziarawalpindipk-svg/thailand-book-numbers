import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    country: "",
    password: "",
  });
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
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      router.push("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <main className="p-6 max-w-md mx-auto pb-20 md:pb-6">
        <h1 className="text-2xl font-bold">Register</h1>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block">Full Name</label>
            <input
              name="fullName"
              type="text"
              className="border p-2 w-full"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
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
            <label className="block">WhatsApp</label>
            <input
              name="whatsapp"
              type="text"
              className="border p-2 w-full"
              value={form.whatsapp}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block">Country</label>
            <input
              name="country"
              type="text"
              className="border p-2 w-full"
              value={form.country}
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
            className="bg-coral-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
