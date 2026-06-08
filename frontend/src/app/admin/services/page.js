"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { services } from "@/data/dummyData";

export default function AdminServicesPage() {
  const [serviceList, setServiceList] = useState(services);
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  const handleEdit = (s) => {
    setEditId(s.id);
    setEditPrice(String(s.price));
  };

  const handleSave = (id) => {
    setServiceList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: Number(editPrice) } : s))
    );
    setEditId(null);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage the services offered on FixMate.
            </p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            + Add Service
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-2">Service</div>
            <div>Category</div>
            <div>Base Price</div>
            <div>Actions</div>
          </div>
          <div className="divide-y divide-gray-50">
            {serviceList.map((s) => (
              <div
                key={s.id}
                className="px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="md:col-span-2 flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.description}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                    {s.category}
                  </span>
                </div>
                <div>
                  {editId === s.id ? (
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-24 px-2 py-1 border border-orange-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">${s.price}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {editId === s.id ? (
                    <>
                      <button
                        onClick={() => handleSave(s.id)}
                        className="text-sm text-green-600 font-medium hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-sm text-gray-400 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-sm text-orange-500 font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button className="text-sm text-red-400 hover:underline">
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
