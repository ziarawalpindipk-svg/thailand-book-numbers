import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Use at the top of every /admin/* page (except /admin/login itself):
//
//   const { checking, token } = useAdminGuard();
//   if (checking) return null; // or a loading spinner
//
// It redirects to /admin/login if there's no admin token in localStorage.
// This is a client-side gate for convenience; the real protection is on the
// backend (adminAuth middleware), which independently rejects any request
// without a valid token - so even if someone bypassed this page-level check,
// they still couldn't read or change offers/books/users data.
export default function useAdminGuard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("tb_admin_token");
    if (!stored) {
      router.replace("/admin/login");
      return;
    }
    setToken(stored);
    setChecking(false);
  }, [router]);

  return { checking, token };
}
