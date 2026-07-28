export default function CartSummary({ items = [], onRemove }) {
  const total = items.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <div className="border rounded p-4 mt-4">
      <h2 className="font-bold mb-2">Cart Summary</h2>
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center border-b py-1">
              <span>Book #{item.serial} x{item.quantity} @ ${item.pricePerBook}</span>
              <span className="flex items-center gap-2">
                ${item.total}
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
        <span>${total}</span>
      </div>
    </div>
  );
}
