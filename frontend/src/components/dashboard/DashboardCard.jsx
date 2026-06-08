export default function DashboardCard({ title, value, icon, trend, trendLabel, color = "orange" }) {
  const colors = {
    orange: { bg: "bg-orange-50", icon: "bg-orange-500", text: "text-orange-600" },
    blue: { bg: "bg-blue-50", icon: "bg-blue-500", text: "text-blue-600" },
    green: { bg: "bg-green-50", icon: "bg-green-500", text: "text-green-600" },
    purple: { bg: "bg-purple-50", icon: "bg-purple-500", text: "text-purple-600" },
    red: { bg: "bg-red-50", icon: "bg-red-500", text: "text-red-600" },
  };

  const c = colors[color] || colors.orange;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
      <div className={`${c.bg} p-3 rounded-lg flex-shrink-0`}>
        <span className={`text-2xl ${c.text}`}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {trendLabel && (
          <p className={`text-xs mt-1 font-medium ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-gray-400"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}
