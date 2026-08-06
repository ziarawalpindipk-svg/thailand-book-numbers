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

  const [showBoldDialog, setShowBoldDialog] = useState(false);
  const [boldText, setBoldText] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [cursorPos, setCursorPos] = useState(null);

  // Inserts a snippet of text at the last known cursor position in the
  // content box (or at the end, if the user never clicked into it yet).
  function insertAtCursor(snippet) {
    const pos = cursorPos === null ? form.content.length : cursorPos;
    const newValue = form.content.slice(0, pos) + snippet + form.content.slice(pos);
    setForm({ ...form, content: newValue });
    const newPos = pos + snippet.length;
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(newPos, newPos);
      }
    });
    setCursorPos(newPos);
  }

  function handleConfirmBold() {
    if (!boldText.trim()) return;
    insertAtCursor(`**${boldText}**`);
    setBoldText("");
    setShowBoldDialog(false);
  }

  function handleConfirmLink() {
    if (!linkText.trim() || !linkUrl.trim()) return;
    insertAtCursor(`[${linkText}](${linkUrl})`);
    setLinkText("");
    setLinkUrl("");
    setShowLinkDialog(false);
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

            {/* Simple formatting toolbar - tap a button, fill in a tiny
                form, no text selection needed. */}
            <div className="flex gap-2 mb-1">
              <button
                type="button"
                onClick={() => setShowBoldDialog(true)}
                className="border rounded px-2 py-1 text-sm font-bold"
                title="Add bold text"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => setShowLinkDialog(true)}
                className="border rounded px-2 py-1 text-sm"
                title="Add a clickable link"
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
              onClick={(e) => setCursorPos(e.target.selectionStart)}
              onKeyUp={(e) => setCursorPos(e.target.selectionStart)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Tap where you want to add something, then tap <strong>B</strong>{" "}
              (bold) or <strong>🔗 Link</strong> (clickable link) and fill in
              the small form. Press Enter for a new line/paragraph.
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

      {showBoldDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBoldDialog(false)}
        >
          <div
            className="bg-white rounded-lg p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-teal-800 mb-3">Add Bold Text</h3>
            <label className="block text-sm mb-1">Text to make bold</label>
            <input
              type="text"
              autoFocus
              className="border p-2 w-full mb-3"
              value={boldText}
              onChange={(e) => setBoldText(e.target.value)}
              placeholder="e.g. Limited time offer!"
            />
            <div className="flex gap-2">
              <button
                onClick={handleConfirmBold}
                className="flex-1 bg-teal-700 text-white py-2 rounded font-semibold"
              >
                Insert
              </button>
              <button
                onClick={() => setShowBoldDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLinkDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLinkDialog(false)}
        >
          <div
            className="bg-white rounded-lg p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-teal-800 mb-3">Add a Clickable Link</h3>
            <label className="block text-sm mb-1">Link text (what the reader sees)</label>
            <input
              type="text"
              autoFocus
              className="border p-2 w-full mb-3"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="e.g. Click here to learn more"
            />
            <label className="block text-sm mb-1">Link (starts with http:// or https://)</label>
            <input
              type="text"
              className="border p-2 w-full mb-3"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleConfirmLink}
                className="flex-1 bg-teal-700 text-white py-2 rounded font-semibold"
              >
                Insert
              </button>
              <button
                onClick={() => setShowLinkDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
