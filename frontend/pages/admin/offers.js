import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/offers`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load offers");
      setOffers(data);
    } catch (err) {
      setError(err.message || "Could not reach the backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/offers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message || "Failed to update offer");
      setOffers(offers.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      setError(err.message || "Failed to update offer");
    }
  }

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Manage Offers</h1>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {loading ? (
          <p className="mt-4">Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="mt-4">No offers submitted yet.</p>
        ) : (
          <table className="w-full border mt-4">
            <thead>
              <tr>
                <th className="border p-2">Offer ID</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer._id}>
                  <td className="border p-2">{offer._id.slice(-6)}</td>
                  <td className="border p-2">{offer.customerName}</td>
                  <td className="border p-2">${offer.totalAmount}</td>
                  <td className="border p-2">{offer.status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => updateStatus(offer._id, "accepted")}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(offer._id, "rejected")}
                      className="bg-red-600 text-white px-2 py-1 rounded ml-2"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </div>
  );
}
