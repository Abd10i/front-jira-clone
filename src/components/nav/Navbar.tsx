"use client";

import { FiBell, FiHelpCircle, FiSettings, FiPlus, FiGrid, FiSearch } from "react-icons/fi";
import { useState } from "react";
import CreateTaskModal from "../modal/CreateTaskModal";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">

        {/* Apps / Grid icon */}
        <FiGrid size={22} className="text-gray-600 hidden sm:block" />

        {/* LOGO / Logout */}
        <button onClick={logout} className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-md group-hover:bg-[#0659ea] transition">
            <svg width="30" height="30" viewBox="0 0 24 24">
              <path fill="#1868db" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
              <path fill="white" d="M9.051 15.434H7.734c-1.988 0-3.413-1.218-3.413-3h7.085c.367 0 .605.26.605.63v7.13c-1.772 0-2.96-1.435-2.96-3.434zm3.5-3.543h-1.318c-1.987 0-3.413-1.196-3.413-2.978h7.085c.367 0 .627.239.627.608v7.13c-1.772 0-2.981-1.435-2.981-3.434zm3.52-3.522h-1.317c-1.987 0-3.413-1.217-3.413-3h7.085c.367 0 .605.262.605.61v7.129c-1.771 0-2.96-1.435-2.96-3.434z"/>
            </svg>
          </div>

          <span className="font-semibold text-gray-800 text-lg group-hover:text-[#0052CC] hidden sm:block">
            Jira
          </span>
        </button>
      </div>

      {/* CENTER SEARCH (hidden on mobile) */}
      <div className="flex-1 px-6 hidden md:block">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-1.5 pl-10 pr-3 
                       focus:outline-none focus:ring-2 focus:ring-[#2684FF]
                       text-gray-700 bg-white"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-500" size={16} />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* Mobile Search Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        >
          <FiSearch size={20} />
        </button>

        {/* Create Button */}
        <button
          className="bg-[#0052CC] hover:bg-[#2684FF] text-white px-3 md:px-4 py-1.5 rounded-md 
                     flex items-center gap-1.5 md:gap-2 text-sm font-medium shadow-sm"
          onClick={() => setOpen(true)}
        >
          <FiPlus size={16} />
          <span className="hidden sm:block">Create</span>
        </button>

        {/* Icons hidden on small */}
        <div className="hidden sm:flex items-center gap-4">
          <FiBell size={20} className="text-gray-600 hover:text-black cursor-pointer" />
          <FiHelpCircle size={20} className="text-gray-600 hover:text-black cursor-pointer" />
          <FiSettings size={20} className="text-gray-600 hover:text-black cursor-pointer" />
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#00A3BF] flex items-center justify-center text-white font-semibold cursor-pointer">
          AA
        </div>
      </div>

      {/* MOBILE SEARCH DROPDOWN */}
      {showMobileSearch && (
        <div className="absolute top-[56px] left-0 w-full bg-white border-b border-gray-300 p-3 md:hidden">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
          />
        </div>
      )}

      <CreateTaskModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreated={(issue) => console.log("Created:", issue)}
      />
    </nav>
  );
}
