"use client";

import { useState } from "react";
import { FiUser, FiUsers, FiHome, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-[#F7F8F9] border-r border-gray-200 transition-all duration-300 flex flex-col
      ${collapsed ? "w-14" : "w-60"}`}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 hover:bg-gray-200 text-gray-600 flex justify-center"
      >
        {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
      </button>

      {/* Nav */}
      <nav className="px-2 space-y-1">
        <NavItem icon={<FiHome size={18} />} label="For You" collapsed={collapsed} link="/foryou" />
        <NavItem icon={<FiUsers size={18} />} label="Teams" collapsed={collapsed} link="/teams" />
        <NavItem icon={<FiUser size={18} />} label="People" collapsed={collapsed} active link="/people" />
      </nav>
    </aside>
  );
}

function NavItem({ icon, label, collapsed, link, active = false }: any) {
  return (
    <a
      href={link}
      className={`flex items-center gap-3 px-3 py-2 rounded-md 
      ${active ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-800 hover:bg-gray-200"}`}
    >
      {icon}
      {!collapsed && label}
    </a>
  );
}
