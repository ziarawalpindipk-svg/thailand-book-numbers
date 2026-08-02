import { getCurrencyInfo } from "../utils/currency";

export default function CartSummary({ items = [], onRemove }) {
  const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
  // All items in the cart always share one currency (switching currency
  // clears the cart first), so it's safe to just read it from the first item.
  const currency = items[0]?.currency || "USD";
  const symbol = getCurrencyInfo(currency).symbol;

  return (
    <div className="border rounded p-4 mt-4">
      <h2 className="font-bold mb-2">Cart Summary</h2>
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center border-b py-1">
              <span>
                Book #{item.serial} x{item.quantity} @ {symbol} {item.pricePerBook}
              </span>
              <span className="flex items-center gap-2">
                {symbol} {item.total}
                {onRemove && (
                  <button
                    onClick={() => onRemove(item.serial)}
                    className="text-red-600 text-sm underline"
                  >
                    Remove
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between font-bold mt-2">
        <span>Total</span>
        <span>{symbol} {total}</span>
      </div>
    </div>
  );
}
