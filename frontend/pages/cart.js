import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartSummary from "../components/CartSummary";
import { getCart, removeFromCart } from "../utils/cart";

export default function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  function handleRemove(serial) {
    setItems(removeFromCart(serial));
  }

  return (
    <div>
      <Header />
      <main className="p-6 max-w-3xl mx-auto pb-20 md:pb-6">
        <h1 className="text-2xl font-bold">My Cart</h1>
        <CartSummary items={items} onRemove={handleRemove} />
        {items.length > 0 && (
          <Link href="/checkout">
            <button className="bg-red-600 text-white px-4 py-2 rounded mt-4 w-full">
              Proceed to Checkout
            </button>
          </Link>
        )}
      </main>
      <Footer />
    </div>
  );
}
