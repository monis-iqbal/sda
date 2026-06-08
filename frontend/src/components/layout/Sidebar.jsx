"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCalendar,
  FiList,
  FiUsers,
  FiSettings,
  FiBriefcase,
  FiLogOut,
} from "react-icons/fi";

const navItems = {
  client: [
    { label: "Dashboard", href: "/client/dashboard", icon: FiHome },
    { label: "Book Service", href: "/client/book-service", icon: FiCalendar },
    { label: "My Requests", href: "/client/requests", icon: FiList },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: FiHome },
    { label: "Requests", href: "/admin/requests", icon: FiList },
    { label: "Workers", href: "/admin/workers", icon: FiUsers },
    { label: "Services", href: "/admin/services", icon: FiSettings },
  ],
  worker: [
    { label: "Dashboard", href: "/worker/dashboard", icon: FiHome },
    { label: "My Jobs", href: "/worker/jobs", icon: FiBriefcase },
  ],
};

export default function Sidebar({ role, isOpen, onClose }) {
  const pathname = usePathname();
  const items = navItems[role] || [];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-stone-900 z-40 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-stone-700">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-white text-lg">
            Fix<span className="text-orange-400">Mate</span>
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>
          {items.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-orange-500 text-white"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-stone-700">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-150"
          >
            <FiLogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
