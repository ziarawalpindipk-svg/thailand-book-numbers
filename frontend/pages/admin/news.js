import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useAdminGuard from "../../utils/useAdminGuard";
import RichText from "../../components/RichText";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const EMPTY_FORM = { title: "", imageUrl: "", content: "" };

export default function AdminNews() {
  const { checking, token } = useAdminGuard();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const textareaRef = useRef(null);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    setError("");
    try {
      const isEditing = Boolean(editingId);
      const res = await fetch(
        isEditing ? `${API_URL}/news/${editingId}` : `${API_URL}/news`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save news item");

      if (isEditing) {
        setNews(news.map((n) => (n._id === editingId ? data : n)));
      } else {
        setNews([data, ...news]);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Failed to save news item");
    } finally {
      setSaving(false);
    }
  }

  function handleEditClick(item) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl || "",
      content: item.content,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
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
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      setError(err.message || "Failed to delete news item");
    }
  }

  // Wraps the currently selected text in the content box with markup
  // (e.g. **bold** or a [link](url)), or inserts a placeholder if nothing
  // is selected - a simple stand-in for a "Bold" / "Link" toolbar button.
  function wrapSelection(before, after) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = form.content.slice(start, end) || "text";
    const newValue =
      form.content.slice(0, start) + before + selected + after + form.content.slice(end);
    setForm({ ...form, content: newValue });
    // Restore focus and select the wrapped text again for quick editing.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function handleBoldClick() {
    wrapSelection("**", "**");
  }

  function handleLinkClick() {
    const url = window.prompt("Paste the link (must start with http:// or https://):");
    if (!url) return;
    wrapSelection("[", `](${url})`);
  }

  if (checking) return null;

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Manage News</h1>
        <p className="text-sm text-gray-600 mt-1">
          Paste an image link (from postimages.org or imgur.com - upload
          there first, then copy the "direct link" it gives you), write your
          headline and text, then click Add. No coding needed.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Tip: pictures around 1200x675 (a wide rectangle) look best and are
          never cropped - any size works though, the page will show the
          whole picture either way.
        </p>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-lg">
          {editingId && (
            <p className="text-sm bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-3 py-2">
              ✏️ Editing an existing news item.{" "}
              <button type="button" onClick={handleCancelEdit} className="underline">
                Cancel and add a new one instead
              </button>
            </p>
          )}
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

            {/* Simple formatting toolbar - select some text first, then
                click a button to wrap it. */}
            <div className="flex gap-2 mb-1">
              <button
                type="button"
                onClick={handleBoldClick}
                className="border rounded px-2 py-1 text-sm font-bold"
                title="Make selected text bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={handleLinkClick}
                className="border rounded px-2 py-1 text-sm"
                title="Turn selected text into a clickable link"
              >
                🔗 Link
              </button>
            </div>

            <textarea
              ref={textareaRef}
              className="border p-2 w-full font-mono text-sm"
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Select some text, then tap <strong>B</strong> to bold it or{" "}
              <strong>🔗 Link</strong> to make it clickable. Press Enter for
              a new line/paragraph.
            </p>

            {form.content && (
              <div className="mt-2 border rounded p-3 bg-gray-50">
                <p className="text-xs text-gray-400 mb-1">Preview:</p>
                <p className="text-sm text-gray-800">
                  <RichText text={form.content} />
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "+ Add News Item"}
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
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
