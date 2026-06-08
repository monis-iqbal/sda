"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/axios";

const STEP_LABELS = ["Select Service", "Describe Issue", "Location & Time"];

export default function BookServicePage() {
  const router = useRouter();
  const [step, setStep]                       = useState(1);
  const [services, setServices]               = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError]     = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");
  const [form, setForm]                       = useState({ address: "", bookingDate: "", bookingTime: "" });
  const [submitting, setSubmitting]           = useState(false);
  const [submitError, setSubmitError]         = useState("");
  const [success, setSuccess]                 = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("fixmate_user");
    if (!raw) { router.push("/login"); return; }

    api.get("/services")
      .then((res) => setServices(res.data))
      .catch(() => setServicesError("Failed to load services. Make sure the backend is running."))
      .finally(() => setServicesLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const raw = localStorage.getItem("fixmate_user");
    const currentUser = JSON.parse(raw);

    const payload = {
      clientId:         currentUser.id,
      serviceId:        selectedService.id,
      address:          form.address,
      bookingDate:      form.bookingDate,
      bookingTime:      form.bookingTime,
      issueDescription: issueDescription,
    };

    try {
      await api.post("/requests", payload);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.response?.data || "Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout role="client">
        <div className="max-w-md mx-auto mt-16 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h2>
          <p className="text-gray-500 mb-2">
            Your <span className="font-semibold text-orange-500">{selectedService?.name}</span> request
            has been submitted successfully.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Status: <span className="font-semibold text-yellow-600">PENDING</span> — an admin will assign a worker shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/client/requests")}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              View My Requests
            </button>
            <button
              onClick={() => {
                setStep(1);
                setSelectedService(null);
                setIssueDescription("");
                setForm({ address: "", bookingDate: "", bookingTime: "" });
                setSuccess(false);
              }}
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Book Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="client">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book a Service</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details below to request a service.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`h-0.5 w-12 rounded transition-colors ${step > s ? "bg-orange-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
          <span className="text-sm text-gray-500 ml-2">{STEP_LABELS[step - 1]}</span>
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Select a Service</h2>

            {servicesLoading && (
              <p className="text-gray-400 text-sm text-center py-8">Loading services...</p>
            )}

            {servicesError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {servicesError}
              </div>
            )}

            {!servicesLoading && !servicesError && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); setStep(2); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-center group"
                  >
                    <span className="text-3xl">🔧</span>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600">
                      {s.name}
                    </span>
                    {s.description && (
                      <span className="text-xs text-gray-400 leading-tight">{s.description}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Describe Issue */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Describe the Issue</h2>
              <button onClick={() => setStep(1)} className="text-sm text-orange-500 hover:underline">
                Change service
              </button>
            </div>

            <div className="bg-orange-50 rounded-lg px-4 py-3 mb-5 text-sm text-orange-700 font-medium">
              Service: {selectedService?.name}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Issue Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={5}
                placeholder="Describe the problem you are facing..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => { if (issueDescription.trim()) setStep(3); }}
                disabled={!issueDescription.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Location & Time */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Location &amp; Time</h2>
              <button onClick={() => setStep(2)} className="text-sm text-orange-500 hover:underline">
                Edit issue
              </button>
            </div>

            <div className="bg-orange-50 rounded-lg px-4 py-3 mb-5 text-sm text-orange-700 font-medium">
              Service: {selectedService?.name}
            </div>

            {submitError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="123 Main St, City"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Booking Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.bookingDate}
                    onChange={(e) => setForm((p) => ({ ...p, bookingDate: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Booking Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.bookingTime}
                    onChange={(e) => setForm((p) => ({ ...p, bookingTime: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {submitting ? "Submitting..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
