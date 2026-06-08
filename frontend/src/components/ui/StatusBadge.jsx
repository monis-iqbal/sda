export default function StatusBadge({ status }) {
  const map = {
    pending: { label: "Pending", classes: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Confirmed", classes: "bg-blue-100 text-blue-700" },
    completed: { label: "Completed", classes: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-700" },
    available: { label: "Available", classes: "bg-green-100 text-green-700" },
    busy: { label: "Busy", classes: "bg-orange-100 text-orange-700" },
    offline: { label: "Offline", classes: "bg-gray-100 text-gray-600" },
  };

  const config = map[status] || { label: status, classes: "bg-gray-100 text-gray-600" };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
