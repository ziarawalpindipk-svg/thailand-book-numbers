import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useAdminGuard from "../../utils/useAdminGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminNews() {
  const { checking, token } = useAdminGuard();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", imageUrl: "", content: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchNews();
  }, [token]);

  async function fetchNews() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/news`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load news");
      setNews(data);
    } catch (err) {
      setError(err.message || "Could not reach the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add news item");
      setNews([data, ...news]);
      setForm({ title: "", imageUrl: "", content: "" });
    } catch (err) {
      setError(err.message || "Failed to add news item");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this news item?")) return;
    try {
      const res = await fetch(`${API_URL}/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setNews(news.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete news item");
    }
  }

  if (checking) return null;

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Manage News</h1>
        <p className="text-sm text-gray-600 mt-1">
          Paste an image link (from Google Photos, Imgur, or anywhere online),
          write your headline and text, then click Add. No coding needed.
        </p>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <form onSubmit={handleAdd} className="mt-4 space-y-3 max-w-lg">
          <div>
            <label className="block text-sm">Headline *</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Image URL (optional)</label>
            <input
              type="text"
              placeholder="https://..."
              className="border p-2 w-full"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">Text *</label>
            <textarea
              className="border p-2 w-full"
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Adding..." : "+ Add News Item"}
          </button>
        </form>

        <h2 className="font-bold mt-8 mb-2">Published News</h2>
        {loading ? (
          <p>Loading...</p>
        ) : news.length === 0 ? (
          <p className="text-gray-500">No news yet.</p>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <div key={item._id} className="border rounded p-3 flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
