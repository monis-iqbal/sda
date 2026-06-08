"use client";

import { useState } from "react";
import Link from "next/link";
import { FiBell, FiUser, FiMenu, FiX, FiLogOut } from "react-icons/fi";

export default function Navbar({ role, onMenuToggle, sidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const roleLabels = { client: "Client", admin: "Administrator", worker: "Worker" };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 z-30 sticky top-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-gray-900 text-lg hidden sm:block">
            Fix<span className="text-orange-500">Mate</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <FiUser size={14} className="text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-none">John Doe</p>
              <p className="text-xs text-gray-400 mt-0.5">{roleLabels[role] || "User"}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">John Doe</p>
                <p className="text-xs text-gray-400">{roleLabels[role] || "User"}</p>
              </div>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <FiLogOut size={14} />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
