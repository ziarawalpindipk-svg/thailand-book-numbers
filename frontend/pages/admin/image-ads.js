import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useAdminGuard from "../../utils/useAdminGuard";
import ImageAdCard from "../../components/ImageAdCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminImageAds() {
  const { checking, token } = useAdminGuard();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ imageUrl: "", linkUrl: "", altText: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchAds();
  }, [token]);

  async function fetchAds() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/ads`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load ads");
      setAds(data);
    } catch (err) {
      setError(err.message || "Could not reach the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.imageUrl.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add ad");
      setAds([data, ...ads]);
      setForm({ imageUrl: "", linkUrl: "", altText: "" });
    } catch (err) {
      setError(err.message || "Failed to add ad");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this ad card?")) return;
    try {
      const res = await fetch(`${API_URL}/ads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setAds(ads.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete ad");
    }
  }

  if (checking) return null;

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Manage Image Ads</h1>
        <p className="text-sm text-gray-600 mt-1">
          Paste a picture link and (optionally) a link to open when tapped.
          These show up as cards on the Home page. No coding needed.
        </p>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <form onSubmit={handleAdd} className="mt-4 space-y-3 max-w-lg">
          <div>
            <label className="block text-sm">Image URL *</label>
            <input
              type="text"
              placeholder="https://..."
              className="border p-2 w-full"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Link when tapped (optional)</label>
            <input
              type="text"
              placeholder="https://..."
              className="border p-2 w-full"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">Description (optional)</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={form.altText}
              onChange={(e) => setForm({ ...form, altText: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Adding..." : "+ Add Ad Card"}
          </button>
        </form>

        <h2 className="font-bold mt-8 mb-2">Current Ad Cards</h2>
        {loading ? (
          <p>Loading...</p>
        ) : ads.length === 0 ? (
          <p className="text-gray-500">No image ads yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl">
            {ads.map((ad) => (
              <div key={ad._id}>
                <ImageAdCard ad={ad} />
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="mt-1 bg-red-600 text-white px-2 py-1 rounded text-xs w-full"
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
