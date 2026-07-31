import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useAdminGuard from "../../utils/useAdminGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminBooks() {
  const { checking, token } = useAdminGuard();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newBook, setNewBook] = useState({ serialNumber: "", title: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchBooks();
  }, [token]);

  async function fetchBooks() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/books`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load books");
      setBooks(data);
    } catch (err) {
      setError(err.message || "Could not reach the backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBook(e) {
    e.preventDefault();
    if (!newBook.serialNumber.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add book");
      setBooks([...books, data]);
      setNewBook({ serialNumber: "", title: "" });
    } catch (err) {
      setError(err.message || "Failed to add book");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(serial) {
    if (!confirm(`Delete book #${serial}?`)) return;
    try {
      const res = await fetch(`${API_URL}/books/${serial}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete book");
      setBooks(books.filter((b) => b.serialNumber !== serial));
    } catch (err) {
      setError(err.message || "Failed to delete book");
    }
  }

  if (checking) return null;

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Manage Books</h1>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        {/* Quick add form - handy for testing, and for adding books one at a
            time. For all 999 books at once, a bulk import script is better -
            ask for that separately when you're ready. */}
        <form onSubmit={handleAddBook} className="flex flex-wrap gap-2 mt-4 items-end">
          <div>
            <label className="block text-sm">Serial *</label>
            <input
              type="text"
              placeholder="e.g. 007"
              className="border p-2"
              value={newBook.serialNumber}
              onChange={(e) => setNewBook({ ...newBook, serialNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Title</label>
            <input
              type="text"
              placeholder="Book title (optional)"
              className="border p-2"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {adding ? "Adding..." : "+ Add Book"}
          </button>
        </form>

        {loading ? (
          <p className="mt-4">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="mt-4">
            No books yet - add one above to test, or ask for a bulk import
            once you're ready to load all 999 books.
          </p>
        ) : (
          <div className="overflow-x-auto mt-4">
          <table className="w-full border min-w-[500px]">
            <thead>
              <tr>
                <th className="border p-2">Serial</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.serialNumber}>
                  <td className="border p-2">{book.serialNumber}</td>
                  <td className="border p-2">{book.title || "Untitled"}</td>
                  <td className="border p-2">{book.status}</td>
                  <td className="border p-2">
                    <button className="bg-blue-600 text-white px-2 py-1 rounded">Edit</button>
                    <button
                      onClick={() => handleDelete(book.serialNumber)}
                      className="bg-red-600 text-white px-2 py-1 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
