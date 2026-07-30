import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminPayments() {
  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Manage Payments</h1>
        <div className="overflow-x-auto mt-4">
        <table className="w-full border min-w-[500px]">
          <thead>
            <tr>
              <th className="border p-2">Offer ID</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Method</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">12345</td>
              <td className="border p-2">$17.00</td>
              <td className="border p-2">Stripe</td>
              <td className="border p-2">Unpaid</td>
            </tr>
          </tbody>
        </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
