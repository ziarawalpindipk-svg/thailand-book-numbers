import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminDashboard() {
  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="border p-4 rounded shadow">
            <h2>Total Books</h2>
            <p>999</p>
          </div>
          <div className="border p-4 rounded shadow">
            <h2>Pending Offers</h2>
            <p>0</p>
          </div>
          <div className="border p-4 rounded shadow">
            <h2>Accepted Offers</h2>
            <p>0</p>
          </div>
          <div className="border p-4 rounded shadow">
            <h2>Total Revenue</h2>
            <p>$0</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
