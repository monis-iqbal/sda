"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import api from "@/lib/axios";

const STATUS_COLORS = {
  PENDING:     "bg-yellow-100 text-yellow-700",
  ASSIGNED:    "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-orange-100 text-orange-700",
  COMPLETED:   "bg-green-100 text-green-700",
  CANCELLED:   "bg-red-100 text-red-700",
};

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [stats, setStats]       = useState(null);
  const [recent, setRecent]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("fixmate_user");
    if (!raw) { router.push("/login"); return; }

    const currentUser = JSON.parse(raw);
    setUser(currentUser);

    const fetchAll = async () => {
      try {
        const res  = await api.get(`/requests/client/${currentUser.id}`);
        const reqs = res.data;

        setStats({
          total:      reqs.length,
          pending:    reqs.filter((r) => r.status === "PENDING").length,
          assigned:   reqs.filter((r) => r.status === "ASSIGNED").length,
          inProgress: reqs.filter((r) => r.status === "IN_PROGRESS").length,
          completed:  reqs.filter((r) => r.status === "COMPLETED").length,
        });

        setRecent(reqs.slice(-3).reverse());
      } catch {
        setError("Failed to load dashboard data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {user ? `Welcome back, ${user.name}!` : "Welcome back!"} Here&apos;s your service overview.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Loading dashboard...</div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard title="My Total Requests"  value={stats.total}      icon="📋" color="orange" />
              <DashboardCard title="Pending"            value={stats.pending}    icon="⏳" color="blue" />
              <DashboardCard title="Assigned"           value={stats.assigned}   icon="👷" color="purple" />
              <DashboardCard title="In Progress"        value={stats.inProgress} icon="🔧" color="orange" />
              <DashboardCard title="Completed"          value={stats.completed}  icon="✅" color="green" />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Recent Requests</h2>
                <a href="/client/requests" className="text-sm text-orange-500 font-medium hover:underline">
                  View all
                </a>
              </div>
              {recent.length === 0 ? (
                <p className="text-gray-400 text-sm px-6 py-8 text-center">No requests yet.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recent.map((req) => (
                    <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm font-mono">Request #{req.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {req.bookingDate ?? "—"} · {req.address ?? "—"}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[req.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {req.status?.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
