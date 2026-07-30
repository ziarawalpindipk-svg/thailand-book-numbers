import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCart, clearCart } from "../utils/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const OWNER_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

// Cleans a phone number down to plain digits, stripping a leading "00" if
// present. Mirrors the same logic used on the backend so both sides always
// agree on what a "clean" number looks like.
function sanitizePhone(raw) {
  if (!raw) return "";
  let cleaned = String(raw).replace(/\D/g, "");
  if (cleaned.startsWith("00")) cleaned = cleaned.slice(2);
  return cleaned;
}

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    country: "Pakistan",
    whatsapp: "",
    email: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add at least one book before submitting an offer.");
      return;
    }

    if (!OWNER_WHATSAPP) {
      setError("Site is not fully configured yet: NEXT_PUBLIC_WHATSAPP_NUMBER is missing.");
      return;
    }

    const cleanCustomerWhatsapp = sanitizePhone(form.whatsapp);
    if (cleanCustomerWhatsapp.length < 10 || cleanCustomerWhatsapp.length > 15) {
      setError("Please enter a valid WhatsApp number with country code (e.g. 923001234567), without '+' or '00'.");
      return;
    }

    const books = cartItems.map((i) => ({
      serial: i.serial,
      quantity: i.quantity,
      pricePerBook: i.pricePerBook,
      total: i.total,
    }));
    const totalAmount = books.reduce((sum, b) => sum + b.total, 0);

    setLoading(true);
    try {
      // 1. Save the offer in the backend
      const offerRes = await fetch(`${API_URL}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, whatsapp: cleanCustomerWhatsapp, books, totalAmount }),
      });
      const offerData = await offerRes.json();
      if (!offerRes.ok) {
        throw new Error(offerData.message || "Failed to submit offer");
      }

      // 2. Ask backend to build the WhatsApp message link - it must open a
      // chat TO the site owner's number, with the customer's details inside
      // the message text (not the other way around).
      const waRes = await fetch(`${API_URL}/offers/send-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          country: form.country,
          whatsapp: cleanCustomerWhatsapp,
          ownerWhatsapp: sanitizePhone(OWNER_WHATSAPP),
          books,
          totalAmount,
          cycleDate: offerData.cycleDate,
        }),
      });
      const waData = await waRes.json();

      clearCart();

      if (waData.waLink) {
        window.open(waData.waLink, "_blank");
      }

      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Submit Your Offer</h1>

        {cartItems.length === 0 ? (
          <p className="max-w-md mx-auto mt-4">
            Your cart is empty. Go back to the{" "}
            <a href="/" className="text-red-600 underline">homepage</a> and add a book first.
          </p>
        ) : (
          <p className="max-w-md mx-auto mt-2 text-sm text-gray-600">
            {cartItems.length} book(s) in this offer, total $
            {cartItems.reduce((s, i) => s + i.total, 0)}
          </p>
        )}

        {error && (
          <p className="max-w-md mx-auto mt-2 text-red-600 text-sm">{error}</p>
        )}

        <form className="space-y-4 max-w-md mx-auto mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block">Full Name *</label>
            <input
              name="customerName"
              type="text"
              className="border p-2 w-full"
              value={form.customerName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block">Country *</label>
            <select
              name="country"
              className="border p-2 w-full"
              value={form.country}
              onChange={handleChange}
              required
            >
              <option>Pakistan</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>
          <div>
            <label className="block">WhatsApp *</label>
            <input
              name="whatsapp"
              type="text"
              placeholder="923001234567 (no + or 00)"
              className="border p-2 w-full"
              value={form.whatsapp}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Country code + number only, e.g. 923001234567 - no "+" or "00".
            </p>
          </div>
          <div>
            <label className="block">Email (Optional)</label>
            <input
              name="email"
              type="email"
              className="border p-2 w-full"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block">Notes (Optional)</label>
            <textarea
              name="notes"
              className="border p-2 w-full"
              value={form.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="bg-red-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Offer"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
