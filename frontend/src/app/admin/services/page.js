"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/axios";

export default function AdminServicesPage() {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    setError("");
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch {
      setError("Failed to load services. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleChange = (e) => {
    setFormError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.post("/services", { name: form.name, description: form.description });
      setForm({ name: "", description: "" });
      setShowForm(false);
      await fetchServices();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete service "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/services/${id}`);
      await fetchServices();
    } catch {
      alert("Failed to delete service. Please try again.");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage the services offered on FixMate.
            </p>
          </div>
          <button
            onClick={() => { setShowForm((v) => !v); setFormError(""); }}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Service"}
          </button>
        </div>

        {/* Add Service Form */}
        {showForm && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Service</h2>
            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                {formError}
              </div>
            )}
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Plumbing"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g. Pipe repairs, leaks, installations"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  {submitting ? "Adding..." : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Loading services...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No services found. Add your first service above.
          </div>
        )}

        {/* Services Table */}
        {!loading && !error && services.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div>ID</div>
              <div>Name</div>
              <div className="col-span-1">Description</div>
              <div>Actions</div>
            </div>
            <div className="divide-y divide-gray-50">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="text-xs font-mono font-semibold text-orange-500">#{s.id}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{s.description || "—"}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
                      className="text-sm text-red-400 hover:text-red-600 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
