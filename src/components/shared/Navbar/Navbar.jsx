"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../Logo/Logo";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      // delete the cookie manually as fallback just in case
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navRoutes = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Pricing", href: "#pricing", icon: "💎" },
    { name: "How it works", href: "#how-it-works", icon: "⚙️" },
    { name: "About", href: "#about", icon: "✨" },
  ];

  return (
    <div className="flex bg-base-100/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] w-full justify-center sticky top-0 z-50 pt-2">
      <div className="navbar mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20 min-h-[70px]">
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden p-2 mr-3 hover:bg-primary/10 rounded-xl transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
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
              <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-[1.5rem] text-center">
                <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
                  EXAMINERLY v2.0
                </p>
              </div>
            </ul>
          </div>
          <Logo />
        </div>

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

        <div className="navbar-end gap-3 flex items-center">
          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <div className="hidden xl:flex flex-col items-end leading-none">
                <p className="text-sm font-black text-base-content">
                  {user.name}
                </p>
                <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-md mt-1 italic">
                  {user.role}
                </span>
              </div>

              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar border-2 border-primary/10 hover:border-primary/40 p-0.5 bg-base-200/50 transition-all duration-300"
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white font-bold relative overflow-hidden">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-5 z-[50] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-xl rounded-[2.5rem] w-72 border-none"
                >
                  <div className="px-4 py-5 mb-2 bg-gradient-to-br from-primary/5 to-primary/15 rounded-[2rem] flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-lg overflow-hidden mb-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-black text-xl text-base-content tracking-tight">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-primary text-white rounded-full tracking-widest mt-2 shadow-lg shadow-primary/30">
                      {user.role}
                    </span>
                  </div>

                  <div className="px-2 space-y-1">
                    <li>
                      <Link
                        href={`/dashboard/${user.role}`}
                        className="rounded-xl py-3 flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all group border-none !outline-none"
                      >
                        <span className="p-2 bg-base-200 rounded-lg group-hover:bg-primary/20">
                          📊
                        </span>
                        <span className="font-bold">Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/dashboard/${user.role}/settings`}
                        className="rounded-xl py-3 flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all group border-none !outline-none"
                      >
                        <span className="p-2 bg-base-200 rounded-lg group-hover:bg-primary/20">
                          ⚙️
                        </span>
                        <span className="font-bold">Settings</span>
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
          ) : (
            <div className="flex gap-2">
              <Link
                href={"/auth/login"}
                className="btn btn-ghost rounded-2xl px-6 font-bold text-base-content shadow-sm hover:translate-y-[-2px] transition-all duration-300 uppercase tracking-tighter"
              >
                Sign In
              </Link>
              <Link
                href={"/auth/registration"}
                className="btn btn-primary rounded-2xl px-6 font-black text-white shadow-xl shadow-primary/20 border-none hover:translate-y-[-3px] hover:shadow-primary/40 active:scale-95 transition-all duration-500 uppercase tracking-tighter"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
