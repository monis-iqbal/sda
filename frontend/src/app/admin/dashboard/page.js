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

const ROLE_REDIRECTS = {
  CLIENT: "/client/dashboard",
  WORKER: "/worker/jobs",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats]         = useState(null);
  const [recentReqs, setRecentReqs] = useState([]);
  const [clientMap, setClientMap] = useState({});
  const [serviceMap, setServiceMap] = useState({});
  const [workers, setWorkers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    // Role guard
    const raw = localStorage.getItem("fixmate_user");
    if (!raw) { router.push("/login"); return; }
    const currentUser = JSON.parse(raw);
    if (currentUser.role !== "ADMIN") {
      router.push(ROLE_REDIRECTS[currentUser.role] ?? "/login");
      return;
    }

    const fetchAll = async () => {
      try {
        const [userRes, reqRes] = await Promise.all([
          api.get("/users"),
          api.get("/requests"),
        ]);

        const users = userRes.data;
        const reqs  = reqRes.data;

        // clientId → name
        const cMap = {};
        users.forEach((u) => { cMap[u.id] = u.name; });
        setClientMap(cMap);

        setStats({
          totalClients:  users.filter((u) => u.role === "CLIENT").length,
          totalWorkers:  users.filter((u) => u.role === "WORKER").length,
          totalRequests: reqs.length,
          pending:       reqs.filter((r) => r.status === "PENDING").length,
          assigned:      reqs.filter((r) => r.status === "ASSIGNED").length,
          inProgress:    reqs.filter((r) => r.status === "IN_PROGRESS").length,
          completed:     reqs.filter((r) => r.status === "COMPLETED").length,
        });

        setRecentReqs(reqs.slice(-5).reverse());
        setWorkers(users.filter((u) => u.role === "WORKER").slice(0, 4));
      } catch {
        setError("Failed to load dashboard data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }

      // /services is optional — used to resolve service names in recent requests
      try {
        const svcRes = await api.get("/services");
        const sMap = {};
        svcRes.data.forEach((s) => { sMap[s.id] = s.name; });
        setServiceMap(sMap);
      } catch {
        // fall back to "Service #id" in the table
      }
    };

    fetchAll();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview and management.</p>
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
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Total Clients"        value={stats.totalClients}  icon="👥" color="purple" />
              <DashboardCard title="Total Workers"        value={stats.totalWorkers}  icon="👷" color="green" />
              <DashboardCard title="Total Requests"       value={stats.totalRequests} icon="📋" color="orange" />
              <DashboardCard title="Pending Requests"     value={stats.pending}       icon="⏳" color="blue" />
              <DashboardCard title="Assigned Requests"    value={stats.assigned}      icon="👷" color="blue" />
              <DashboardCard title="In Progress Requests" value={stats.inProgress}    icon="🔧" color="orange" />
              <DashboardCard title="Completed Requests"   value={stats.completed}     icon="✅" color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Requests */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Recent Requests</h2>
                  <a href="/admin/requests" className="text-sm text-orange-500 font-medium hover:underline">View all</a>
                </div>

                {/* Table header */}
                <div className="hidden sm:grid grid-cols-4 gap-3 px-6 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <div>ID</div>
                  <div>Client</div>
                  <div>Service</div>
                  <div>Status</div>
                </div>

                {recentReqs.length === 0 ? (
                  <p className="text-gray-400 text-sm px-6 py-8 text-center">No requests yet.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {recentReqs.map((req) => (
                      <div key={req.id} className="px-6 py-3 grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-3 items-center">
                        <span className="text-xs font-mono font-semibold text-orange-500">#{req.id}</span>
                        <p className="text-sm text-gray-800 truncate">
                          {clientMap[req.clientId] ?? `Client #${req.clientId}`}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {serviceMap[req.serviceId] ?? `Service #${req.serviceId}`}
                        </p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${STATUS_COLORS[req.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {req.status?.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Workers */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Workers</h2>
                  <a href="/admin/workers" className="text-sm text-orange-500 font-medium hover:underline">View all</a>
                </div>
                {workers.length === 0 ? (
                  <p className="text-gray-400 text-sm px-6 py-8 text-center">No workers yet.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {workers.map((w) => {
                      const initials = w.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                      return (
                        <div key={w.id} className="px-6 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600 flex-shrink-0">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{w.name}</p>
                            <p className="text-xs text-gray-400">{w.email}</p>
                          </div>
                          <span className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                            Worker
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
