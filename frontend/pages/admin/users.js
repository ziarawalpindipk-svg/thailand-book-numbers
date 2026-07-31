import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useAdminGuard from "../../utils/useAdminGuard";

export default function AdminUsers() {
  const { checking } = useAdminGuard();
  if (checking) return null;

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="overflow-x-auto mt-4">
        <table className="w-full border min-w-[500px]">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Sample User</td>
              <td className="border p-2">user@example.com</td>
              <td className="border p-2">Pakistan</td>
              <td className="border p-2">user</td>
            </tr>
          </tbody>
        </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
