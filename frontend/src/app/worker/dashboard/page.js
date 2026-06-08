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

export default function WorkerDashboard() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [stats, setStats]     = useState(null);
  const [recent, setRecent]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("fixmate_user");
    if (!raw) { router.push("/login"); return; }

    const currentUser = JSON.parse(raw);
    setUser(currentUser);

    const fetchAll = async () => {
      try {
        const res  = await api.get(`/assignments/worker/${currentUser.id}`);
        const jobs = res.data;

        setStats({
          total:      jobs.length,
          assigned:   jobs.filter((j) => j.status === "ASSIGNED").length,
          inProgress: jobs.filter((j) => j.status === "IN_PROGRESS").length,
          completed:  jobs.filter((j) => j.status === "COMPLETED").length,
        });

        setRecent(jobs.slice(-3).reverse());
      } catch {
        setError("Failed to load dashboard data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <DashboardLayout role="worker">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              {user ? `Hello, ${user.name}!` : "Hello!"} Here&apos;s your work summary.
            </p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            Active
          </span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Total Assigned Jobs" value={stats.total}      icon="📋" color="orange" />
              <DashboardCard title="Assigned Jobs"       value={stats.assigned}   icon="⏳" color="blue" />
              <DashboardCard title="In Progress Jobs"    value={stats.inProgress} icon="🔧" color="orange" />
              <DashboardCard title="Completed Jobs"      value={stats.completed}  icon="✅" color="green" />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Recent Jobs</h2>
                <a href="/worker/jobs" className="text-sm text-orange-500 font-medium hover:underline">
                  View all
                </a>
              </div>
              {recent.length === 0 ? (
                <p className="text-gray-400 text-sm px-6 py-8 text-center">No jobs assigned yet.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recent.map((job) => (
                    <div key={job.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm font-mono">
                          Request #{job.serviceRequestId}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {job.bookingDate ?? "—"} · {job.address ?? "—"}
                        </p>
                        {job.issueDescription && (
                          <p className="text-xs text-gray-400 italic mt-0.5">{job.issueDescription}</p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[job.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {job.status?.replace("_", " ")}
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
