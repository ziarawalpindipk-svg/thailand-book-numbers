import { useState } from "react";
import { addToCart } from "../utils/cart";

export default function BookCard({ serial }) {
  const [price, setPrice] = useState(1);
  const [added, setAdded] = useState(false);

  function handlePriceChange(e) {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setPrice(value);
    }
  }

  function handleAddToCart() {
    if (price < 1) return;
    addToCart(serial, price, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="border rounded-lg shadow p-4">
      <h2 className="font-bold">Book #{serial}</h2>
      <img src="/placeholder.png" alt="Book Cover" className="w-full h-48 object-cover" />
      <p>Status: Available</p>
      <div className="mt-2">
        <label className="block text-sm">Your Offer (min $1)</label>
        <input
          type="number"
          min="1"
          step="0.5"
          value={price}
          onChange={handlePriceChange}
          className="border p-2 w-full"
        />
      </div>
      <button
        onClick={handleAddToCart}
        className="bg-coral-500 text-white px-4 py-2 rounded mt-2 w-full"
      >
        {added ? "Added ✓" : "Add to Cart"}
      </button>
    </div>
  );
}
