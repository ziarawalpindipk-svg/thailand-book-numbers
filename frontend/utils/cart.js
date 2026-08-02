// Simple localStorage-backed cart helper for the storefront.
// Runs only in the browser, so every function guards against SSR (typeof window).

const CART_KEY = "tb_cart";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read cart:", err);
    return [];
  }
}

export function saveCart(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Let every component showing the cart (grid, header badge, bottom nav,
  // cart page) know right away instead of waiting on a polling interval.
  window.dispatchEvent(new CustomEvent("tb-cart-changed"));
}

export function addToCart(serial, pricePerBook, quantity = 1, currency = "USD") {
  const items = getCart();
  const existing = items.find((i) => i.serial === serial);

  if (existing) {
    existing.quantity += quantity;
    existing.pricePerBook = pricePerBook;
    existing.currency = currency;
    existing.total = existing.quantity * existing.pricePerBook;
  } else {
    items.push({
      serial,
      quantity,
      pricePerBook,
      currency,
      total: quantity * pricePerBook,
    });
  }

  saveCart(items);
  return items;
}

export function removeFromCart(serial) {
  const items = getCart().filter((i) => i.serial !== serial);
  saveCart(items);
  return items;
}

export function clearCart() {
  saveCart([]);
}
