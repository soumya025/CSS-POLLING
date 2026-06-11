// src/app/admin/dashboard/page.tsx
// Admin-only dashboard — server renders auth check, client renders charts

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  if (!ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/vote");
  }

  return (
    <main className="min-h-screen px-4 py-10">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Admin header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-indigo-400 text-xs font-medium uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="text-3xl font-bold text-white">CSS AGS Poll Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">NIT Silchar — Computer Science Society</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm text-indigo-400 font-medium">{session.user.email}</p>
            </div>
<a 
href="/api/auth/signout"
  className="py-2 px-4 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-all text-sm"
>
  Sign Out
</a>
          </div>
        </div>

        {/* Client Dashboard (charts, table, etc.) */}
        <AdminDashboardClient />
      </div>
    </main>
  );
}
