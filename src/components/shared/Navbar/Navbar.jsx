"use client";
import Link from "next/link";
import Logo from "../Logo/Logo";
import Image from "next/image";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  const navRoutes = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "How it works", href: "#how-it-works", icon: "⚙️" },
    { name: "About", href: "#about", icon: "✨" },
  ];

  return (
    <div className="flex bg-base-100/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] w-full justify-center sticky top-0 z-50 pt-2">
      <div className="navbar h-20 mx-auto w-full max-w-[1440px] md:px-10 lg:px-20 min-h-[70px]">
        {/* Navbar Start: Logo & Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden hover:bg-primary/10 rounded-xl transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 8h16M4 16h12"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-4 z-[50] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-base-100/90 backdrop-blur-2xl rounded-[2.5rem] w-64 border-none"
            >
              <div className="px-4 py-3 mb-2 border-b border-gray-200/50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                  Navigation
                </p>
              </div>
              <div className="space-y-1">
                {navRoutes.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 py-3 px-4 rounded-2xl transition-all duration-300 hover:bg-primary/10 hover:text-primary group border-none !outline-none"
                    >
                      <span className="text-lg group-hover:scale-125 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="font-bold text-base-content/80">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </div>
            </ul>
          </div>
          <Logo />
        </div>

        {/* Navbar Center: Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2">
            {navRoutes.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="relative px-5 py-2 font-bold text-base-content/70 group transition-all duration-300 hover:text-primary !bg-transparent border-none !outline-none"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-primary rounded-full transition-all duration-300 group-hover:w-2/3 group-hover:left-[16.5%]"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Navbar End: Notifications & User Profile */}
        <div className="navbar-end gap-3">
          {/* --- Notifications Start --- */}
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle relative group hover:bg-primary/10 transition-all duration-500 border-none !outline-none"
            >
              <div className="indicator">
                {/*  */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-base-content/70 group-hover:text-primary transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/*  */}
                <span className="indicator-item flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] font-black text-white items-center justify-center">
                    1
                  </span>
                </span>
              </div>
            </button>

            {/*  */}
            <div
              tabIndex={0}
              className="mt-5 z-[60] card card-compact dropdown-content w-80 bg-base-100/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] border-none overflow-hidden"
            >
              <div className="card-body p-0">
                <div className="bg-primary/10 px-5 py-4 flex justify-between items-center">
                  <h3 className="font-black text-primary text-sm uppercase tracking-wider">
                    Notifications
                  </h3>
                  <span className="badge badge-primary badge-sm font-bold text-white p-2">
                    New
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto px-2 py-3 space-y-1">
                  {/*  */}
                  <div className="flex items-start gap-3 p-3 hover:bg-base-200/50 rounded-2xl transition-all cursor-pointer group">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                      🚀
                    </div>
                    <div>
                      <p className="text-sm font-bold text-base-content leading-tight">
                        Welcome to O-Exam!
                      </p>
                      <p className="text-[11px] text-base-content/60 mt-1">
                        Start your first exam today and track progress.
                      </p>
                      <p className="text-[9px] font-black text-primary uppercase mt-1.5 opacity-60">
                        Just now
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2 border-t border-base-200">
                  <button className="btn btn-ghost btn-sm w-full rounded-xl font-bold text-xs hover:bg-primary/10">
                    Clear All Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* --- Notifications End --- */}
          {user && (
            <div className="flex items-center gap-3 ml-2">
              {/* Desktop User Info */}
              <div className="hidden xl:flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`relative flex h-2 w-2 rounded-full bg-blue-500 animate-pulse`}
                  ></span>
                  <p className="text-sm font-black text-base-content tracking-tight">
                    {user.name}
                  </p>
                </div>
                <div className="flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 shadow-sm">
                  <span className="text-[8px] font-black uppercase text-primary tracking-widest italic">
                    Verified {user.role}
                  </span>
                </div>
              </div>

              {/* User Dropdown Profile */}
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar border-2 border-primary/10 hover:border-primary/40 p-0.5 bg-base-200/50 transition-all duration-300"
                >
                  <div className="w-9 rounded-full relative overflow-hidden">
                    <Image
                      src={user?.image || "https://ibb.co.com/WW2RJLhF"}
                      alt="User"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-5 z-[50] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-xl rounded-[2.5rem] w-72 border-none"
                >
                  <div className="px-4 py-5 mb-2 bg-gradient-to-br from-primary/5 to-primary/15 rounded-[2rem] flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden mb-3">
                      <img
                        src={user.image}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="font-black text-xl text-base-content tracking-tight">
                        {user.name}
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-primary text-white rounded-full tracking-widest mt-2 shadow-lg shadow-primary/30">
                      Verified {user.role}
                    </span>
                  </div>
                  <div className="px-2 space-y-1">
                    <li>
                      <Link
                        href="/profile"
                        className="rounded-xl py-3 flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all group border-none !outline-none"
                      >
                        <span className="p-2 bg-base-200 rounded-lg group-hover:bg-primary/20">
                          👤
                        </span>
                        <span className="font-bold">My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile/settings"
                        className="rounded-xl py-3 flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all group border-none !outline-none"
                      >
                        <span className="p-2 bg-base-200 rounded-lg group-hover:bg-primary/20">
                          ⚙️
                        </span>
                        <span className="font-bold">Account Settings</span>
                      </Link>
                    </li>
                  </div>
                  <div className="divider px-4 my-2 opacity-30"></div>
                  <li className="px-2 pb-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 bg-error/10 hover:bg-error text-error hover:text-white transition-all duration-500 py-3.5 rounded-[1.5rem] font-black w-full border-none shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                      </svg>
                      LOGOUT
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <Link
            href={"/auth/login"}
            className="bg-primary rounded-2xl px-4 md:px-8 py-4 text-[10px] md:text-base font-black text-white shadow-xl shadow-primary/20 border-none hover:translate-y-[-3px] hover:shadow-primary/40 active:scale-95 transition-all duration-500 uppercase tracking-tighter"
          >
            {user ? "Dashboard" : "Login"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
