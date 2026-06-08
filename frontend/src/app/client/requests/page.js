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

export default function ClientRequestsPage() {
  const router = useRouter();
  const [requests, setRequests]     = useState([]);
  const [serviceMap, setServiceMap] = useState({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [selected, setSelected]     = useState(null); // for View Details modal

  useEffect(() => {
    const raw = localStorage.getItem("fixmate_user");
    if (!raw) { router.push("/login"); return; }

    const user = JSON.parse(raw);

    const fetchAll = async () => {
      try {
        const [reqRes, svcRes] = await Promise.all([
          api.get(`/requests/client/${user.id}`),
          api.get("/services"),
        ]);

        const svcLookup = {};
        svcRes.data.forEach((s) => { svcLookup[s.id] = s.name; });
        setServiceMap(svcLookup);

        setRequests(reqRes.data);
      } catch {
        setError("Failed to load requests. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage all your service requests.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Loading requests...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && requests.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-16 text-center">
            <p className="text-gray-400 text-sm mb-4">No requests found.</p>
            <button
              onClick={() => router.push("/client/book-service")}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Book Your First Service
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && requests.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header row — 8 cols: ID | Service | Address | Date | Time | Issue | Status | Action */}
            <div className="hidden lg:grid grid-cols-8 gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div>ID</div>
              <div>Service</div>
              <div>Address</div>
              <div>Date</div>
              <div>Time</div>
              <div className="col-span-2">Issue</div>
              <div>Status / Action</div>
            </div>

            <div className="divide-y divide-gray-50">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="px-6 py-4 grid grid-cols-1 lg:grid-cols-8 gap-2 lg:gap-3 items-center hover:bg-gray-50 transition-colors"
                >
                  {/* ID */}
                  <div>
                    <span className="text-xs font-mono font-semibold text-orange-500">
                      #{req.id}
                    </span>
                  </div>

                  {/* Service */}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {serviceMap[req.serviceId] ?? `Service #${req.serviceId}`}
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <p className="text-sm text-gray-600 truncate">{req.address ?? "—"}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-gray-600">{req.bookingDate ?? "—"}</p>
                  </div>

                  {/* Time */}
                  <div>
                    <p className="text-sm text-gray-600">{req.bookingTime ?? "—"}</p>
                  </div>

                  {/* Issue */}
                  <div className="lg:col-span-2">
                    <p className="text-sm text-gray-600 italic truncate">{req.issueDescription ?? "—"}</p>
                  </div>

                  {/* Status + Action */}
                  <div className="flex flex-col gap-2 items-start">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[req.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {req.status?.replace("_", " ") ?? "—"}
                    </span>
                    <button
                      onClick={() => setSelected(req)}
                      className="text-xs font-semibold text-orange-500 hover:text-orange-700 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Request Details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Request ID</span>
                <span className="font-mono font-semibold text-orange-500">#{selected.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="text-gray-800 font-medium">
                  {serviceMap[selected.serviceId] ?? `Service #${selected.serviceId}`}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 flex-shrink-0">Address</span>
                <span className="text-gray-800 text-right">{selected.address ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Date</span>
                <span className="text-gray-800">{selected.bookingDate ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Time</span>
                <span className="text-gray-800">{selected.bookingTime ?? "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500">Issue Description</span>
                <p className="text-gray-800 italic bg-gray-50 rounded-lg px-3 py-2 text-xs leading-relaxed">
                  {selected.issueDescription ?? "—"}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[selected.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {selected.status?.replace("_", " ") ?? "—"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
