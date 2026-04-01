"use client";

import Logo from "@/components/shared/Logo/Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LuLayoutDashboard,
  LuUsers,
  LuUserCheck,
  LuSchool,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuSearch,
  LuBell,
  LuUser
} from "react-icons/lu";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard/admin", icon: <LuLayoutDashboard /> },
    { name: "Students", path: "/dashboard/admin/student", icon: <LuUsers /> },
    { name: "Teachers", path: "/dashboard/admin/teacher", icon: <LuUserCheck /> },
    { name: "Institutions", path: "/dashboard/admin/institutions", icon: <LuSchool /> },
    { name: "Settings", path: "/dashboard/admin/settings", icon: <LuSettings /> },
  ];

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <div
        className={`fixed h-full w-72 bg-white border-r border-gray-100 shadow-2xl shadow-blue-900/5 z-50
        ${mobileOpen ? "left-0" : "-left-72"}
        md:left-0 transition-all duration-500 ease-in-out`}
      >
        {/* Brand Logo */}
        <div className="p-10 pb-12 flex items-center justify-start scale-110 origin-left">
          <Logo />
        </div>

        {/* Navigation Menu */}
        <div className="px-6 space-y-2">
          {menu.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold group
                ${isActive
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/25"
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                <span className={`text-xl transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`}>
                  {item.icon}
                </span>
                <span className="tracking-tight text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Secondary Section */}
        <div className="absolute bottom-8 w-full px-6">
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Server Status</span>
            </div>
            <p className="text-xs font-bold text-gray-600">All systems operational</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl
            bg-white border-2 border-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 font-bold shadow-sm"
          >
            <LuLogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 transition-all duration-500">
        {/* Top Navbar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-6">
            {/* Mobile Toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <LuMenu size={24} />
            </button>

            {/* Global Search */}
            <div className="relative hidden md:block group">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                placeholder="Find entities, exams or help..."
                className="bg-gray-50/50 border border-gray-100 pl-12 pr-6 py-2.5 rounded-2xl w-[400px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="w-12 h-12 flex items-center justify-center text-gray-500 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors relative">
              <LuBell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 ml-2">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-black text-gray-900 leading-none">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {user?.role || "Administrator"}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 border-2 border-white shadow-sm overflow-hidden">
                {user?.image ? (
                  <img src={user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <LuUser size={24} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
