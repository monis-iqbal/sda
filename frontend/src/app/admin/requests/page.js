"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/axios";

const STATUS_COLORS = {
  PENDING:     "bg-yellow-100 text-yellow-700",
  ASSIGNED:    "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-orange-100 text-orange-700",
  COMPLETED:   "bg-green-100 text-green-700",
  CANCELLED:   "bg-red-100 text-red-700",
};

const STATUSES = ["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function AdminRequestsPage() {
  const [requests, setRequests]     = useState([]);
  const [clientMap, setClientMap]   = useState({});
  const [serviceMap, setServiceMap] = useState({});
  const [workerMap, setWorkerMap]   = useState({});
  const [workers, setWorkers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState("ALL");

  // Assign modal state
  const [assignReqId, setAssignReqId]   = useState(null);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [assigning, setAssigning]       = useState(false);
  const [assignError, setAssignError]   = useState("");

  // View assignment modal state
  const [viewAssignment, setViewAssignment] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    // /requests is required — if it fails, show error and stop
    let reqs;
    try {
      const reqRes = await api.get("/requests");
      reqs = reqRes.data;
      setRequests(reqs);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError("Failed to load requests. Make sure the backend is running.");
      setLoading(false);
      return;
    }

    // /users is optional
    try {
      const userRes = await api.get("/users");
      const cMap = {};
      userRes.data.forEach((u) => { cMap[u.id] = u.name; });
      setClientMap(cMap);
      setWorkers(userRes.data.filter((u) => u.role === "WORKER"));
    } catch (err) {
      console.error("Failed to load users (falling back to IDs):", err);
    }

    // /services is optional
    try {
      const svcRes = await api.get("/services");
      const sMap = {};
      svcRes.data.forEach((s) => { sMap[s.id] = s.name; });
      setServiceMap(sMap);
    } catch (err) {
      console.error("Failed to load services (falling back to IDs):", err);
    }

    // /assignments is optional
    try {
      const assignRes = await api.get("/assignments");
      const wMap = {};
      assignRes.data.forEach((a) => {
        if (a.serviceRequestId) {
          wMap[a.serviceRequestId] = {
            workerName: a.workerName ?? `Worker #${a.workerId}`,
            assignmentId: a.id,
            workerId: a.workerId,
            assignedDate: a.assignedDate,
          };
        }
      });
      setWorkerMap(wMap);
    } catch (err) {
      console.error("Failed to load assignments (showing Unassigned):", err);
    }

    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = filter === "ALL"
    ? requests
    : requests.filter((r) => r.status === filter);

  const openAssign = (reqId) => {
    setAssignReqId(reqId);
    setSelectedWorker("");
    setAssignError("");
  };

  const closeAssign = () => {
    setAssignReqId(null);
    setAssignError("");
  };

  const handleAssign = async () => {
    if (!selectedWorker) { setAssignError("Please select a worker."); return; }
    setAssigning(true);
    setAssignError("");
    try {
      await api.post("/assignments", {
        serviceRequestId: assignReqId,
        workerId: Number(selectedWorker),
      });
      closeAssign();
      await fetchAll();
    } catch (err) {
      console.error("Assign worker error:", err.response?.data || err);
      const message =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message
            || err.response?.data?.error
            || "Failed to assign worker. Try again.";
      setAssignError(message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all service requests across the platform.
          </p>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors border ${
                filter === s
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
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

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">No requests found.</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="hidden lg:grid grid-cols-8 gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div>ID</div>
              <div>Client</div>
              <div>Service</div>
              <div className="col-span-2">Address</div>
              <div>Date</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            <div className="divide-y divide-gray-50">
              {filtered.map((req) => {
                const assignment = workerMap[req.id];
                return (
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

                    {/* Client */}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {clientMap[req.clientId] ?? `Client #${req.clientId}`}
                      </p>
                    </div>

                    {/* Service */}
                    <div>
                      <p className="text-sm text-gray-700">
                        {serviceMap[req.serviceId] ?? `Service #${req.serviceId}`}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-600">{req.address ?? "—"}</p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm text-gray-600">{req.bookingDate ?? "—"}</p>
                      <p className="text-xs text-gray-400">{req.bookingTime ?? ""}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[req.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {req.status?.replace("_", " ") ?? "—"}
                      </span>
                    </div>

                    {/* Action */}
                    <div>
                      {req.status === "PENDING" && (
                        <button
                          onClick={() => openAssign(req.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                        >
                          Assign Worker
                        </button>
                      )}
                      {(req.status === "ASSIGNED" || req.status === "IN_PROGRESS") && assignment && (
                        <button
                          onClick={() => setViewAssignment({ req, assignment })}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                        >
                          View Assignment
                        </button>
                      )}
                      {req.status === "COMPLETED" && (
                        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                          Completed
                        </span>
                      )}
                      {req.status === "CANCELLED" && (
                        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Assign Worker Modal */}
      {assignReqId !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Assign Worker</h2>
            <p className="text-sm text-gray-500 mb-4">
              Request <span className="font-mono text-orange-500 font-semibold">#{assignReqId}</span>
            </p>

            {assignError && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                {assignError}
              </div>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Worker
            </label>
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-5"
            >
              <option value="">— choose a worker —</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.email})
                </option>
              ))}
            </select>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeAssign}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white transition-colors"
              >
                {assigning ? "Assigning..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Assignment Modal */}
      {viewAssignment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Assignment Details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Request</span>
                <span className="font-mono font-semibold text-orange-500">
                  #{viewAssignment.req.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="text-gray-800">
                  {serviceMap[viewAssignment.req.serviceId] ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Client</span>
                <span className="text-gray-800">
                  {clientMap[viewAssignment.req.clientId] ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned Worker</span>
                <span className="text-gray-800 font-medium">
                  {viewAssignment.assignment.workerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned Date</span>
                <span className="text-gray-800">
                  {viewAssignment.assignment.assignedDate ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[viewAssignment.req.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {viewAssignment.req.status?.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewAssignment(null)}
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
