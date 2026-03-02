"use client";

import { act, useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaBook,
  FaGraduationCap,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import { usePathname } from "next/navigation";

// Sub-components

function NavItem({ icon, label, href, collapsed = false }) {
  const pathName = usePathname();
  const active = pathName === href;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 ${
        active
          ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
          : "text-base-content/60 hover:bg-base-200 hover:text-primary active:scale-95"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <span className={`${active ? "text-white" : "text-primary/70 group-hover:text-primary"} transition-colors`}>
        {icon}
      </span>
      {!collapsed && (
        <span className="font-bold whitespace-nowrap text-sm tracking-tight">{label}</span>
      )}
    </Link>
  );
}

export default function StudentDashboard({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-base-200 flex font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-base-100 border-r border-base-300 fixed inset-y-0 left-0 z-20 transition-all duration-0 ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden lg:flex flex-col`}
      >
        <div className="h-20 flex items-center px-6 border-b border-base-200">
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <FaGraduationCap size={22} />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-black text-primary tracking-tighter">
                Examinerly
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem
            icon={<FaHome size={20} />}
            label="Dashboard"
            href="/dashboard/student"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<FaBook size={20} />}
            label="My Exams"
            href="/dashboard/student/my_exam"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<FaGraduationCap size={20} />}
            label="Results"
            href="/dashboard/student/my_result"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<FaCalendarAlt size={20} />}
            label="Schedule"
            href="/dashboard/student/my_schedule"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<FaCog size={20} />}
            label="Settings"
            href="/dashboard/student/settings"
            collapsed={!sidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-base-300">
          <button className="flex items-center gap-3 text-error hover:bg-base-200 p-3 rounded-lg w-full transition-colors">
            <FaSignOutAlt size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-0 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
      >
        {/* Top Navbar */}
        <header className="h-20 bg-base-100/80 backdrop-blur-md border-b border-base-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm btn-square text-base-content lg:flex hidden hover:bg-base-200"
            >
              <FaBars size={18} />
            </button>
            <button className="btn btn-ghost btn-sm btn-square text-base-content lg:hidden">
              <FaBars size={18} />
            </button>
            <h2 className="text-sm font-black uppercase tracking-widest text-base-content/30 hidden sm:block">
              Student Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
             <button className="btn btn-ghost btn-sm btn-square relative">
                <FaBell size={18} className="text-base-content/60" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-base-100"></span>
             </button>
             <div className="h-8 w-[1px] bg-base-300 mx-2"></div>
             <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-base-content group-hover:text-primary transition-colors leading-none">MRB RAFI</p>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter mt-1">ID: ST-2024</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <FaUserCircle size={24} />
                </div>
             </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="p-4 lg:p-6 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
