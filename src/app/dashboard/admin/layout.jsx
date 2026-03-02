"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUniversity,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

export default function AdminLayout({ children }) {

  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard/admin", icon: <FaTachometerAlt /> },
    { name: "Students", path: "/dashboard/admin/student", icon: <FaUserGraduate /> },
    { name: "Teachers", path: "/dashboard/admin/teacher", icon: <FaChalkboardTeacher /> },
    { name: "Institutions", path: "/dashboard/admin/institutions", icon: <FaUniversity /> },
    { name: "Complaints", path: "/dashboard/admin/complaints", icon: <FaChartBar /> },
    { name: "Settings", path: "/dashboard/admin/settings", icon: <FaCog /> },
  ];

  const logout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (

    <div className="flex min-h-screen bg-gray-100">


      {/* Sidebar */}

      <div
        className={`fixed h-full w-64 bg-white border-r shadow-sm z-50

        ${mobileOpen ? "left-0" : "-left-64"}
        md:left-0 transition-all`}
      >

        {/* Title */}

        <div className="p-6 font-bold text-xl border-b">
          Admin Panel
        </div>


        {/* Menu */}

        <div className="p-4 space-y-2">

          {menu.map((item, index) => (

            <Link
              key={index}
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition font-medium

              ${
                pathname === item.path
                  ? "bg-blue-900 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >

              {item.icon}

              {item.name}

            </Link>

          ))}

        </div>



        {/* Logout */}

        <div className="absolute bottom-0 w-full p-4 border-t">

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 rounded-xl
            bg-red-500 text-white hover:bg-red-600 transition"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>



      {/* Main */}

      <div className="flex-1 md:ml-64">


        {/* Navbar */}

        <div className="bg-white border-b shadow-sm p-4 flex justify-between items-center">


          {/* Mobile Button */}

          <button
            className="md:hidden text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <FaBars />
          </button>



          {/* Search */}

          <input
            placeholder="Search..."
            className="border px-4 py-2 rounded-xl w-96 hidden md:block focus:outline-none focus:ring-2 focus:ring-blue-800"
          />


          {/* User */}

          <div className="font-semibold text-gray-700">
            Admin
          </div>


        </div>



        {/* Content */}

        <div className="p-8">
          {children}
        </div>


      </div>

    </div>

  );
}