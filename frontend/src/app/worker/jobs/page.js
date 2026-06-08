"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/axios";

const STATUS_COLORS = {
  PENDING:     "bg-yellow-100 text-yellow-700",
  ASSIGNED:    "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-orange-100 text-orange-700",
  COMPLETED:   "bg-green-100 text-green-700",
  CANCELLED:   "bg-red-100 text-red-700",
};

export default function WorkerJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const getCurrentUser = () => {
    try {
      const raw = localStorage.getItem("fixmate_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const fetchJobs = async (workerId) => {
    try {
      setError("");
      const res = await api.get(`/assignments/worker/${workerId}`);
      setJobs(res.data);
    } catch {
      setError("Failed to load jobs. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    fetchJobs(user.id);
  }, []);

  const updateStatus = async (requestId, newStatus) => {
    setUpdating(requestId);
    const user = getCurrentUser();
    try {
      await api.put(`/requests/${requestId}/status`, { status: newStatus });
      await fetchJobs(user.id);
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout role="worker">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">All jobs assigned to you.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Loading jobs...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">No jobs assigned yet.</p>
          </div>
        )}

        {/* Job Cards */}
        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
              >
                {/* Top row: IDs + status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-400">
                      Assignment <span className="font-mono font-semibold text-orange-500">#{job.id}</span>
                      {" · "}
                      Request <span className="font-mono font-semibold text-gray-700">#{job.serviceRequestId}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Assigned: <span className="text-gray-600">{job.assignedDate ?? "—"}</span>
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[job.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {job.status?.replace("_", " ")}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
                    <p className="text-gray-800">{job.address ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Booking Date</p>
                    <p className="text-gray-800">{job.bookingDate ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Booking Time</p>
                    <p className="text-gray-800">{job.bookingTime ?? "—"}</p>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Issue Description</p>
                    <p className="text-gray-800 italic">{job.issueDescription ?? "—"}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  {job.status === "ASSIGNED" && (
                    <button
                      onClick={() => updateStatus(job.serviceRequestId, "IN_PROGRESS")}
                      disabled={updating === job.serviceRequestId}
                      className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white transition-colors"
                    >
                      {updating === job.serviceRequestId ? "Updating..." : "Start Work"}
                    </button>
                  )}
                  {job.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => updateStatus(job.serviceRequestId, "COMPLETED")}
                      disabled={updating === job.serviceRequestId}
                      className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white transition-colors"
                    >
                      {updating === job.serviceRequestId ? "Updating..." : "Mark Completed"}
                    </button>
                  )}
                  {job.status === "COMPLETED" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      Completed
                    </span>
                  )}
                  {job.status === "CANCELLED" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
