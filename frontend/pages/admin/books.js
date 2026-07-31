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
        {loading ? (
          <p className="mt-4">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="mt-4">
            No books found yet. Add books via <code>POST /api/books</code> or seed
            your database with the 999 book records.
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
