'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '../Logo/Logo';
import Swal from 'sweetalert2';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // 1. Initial Load & Sync with LocalStorage
  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsVerified(parsedUser.isVerified || false);
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
      }
    }
  }, []);

  // 2. Verification Handler (Updates MongoDB & LocalStorage)
  const handleVerifyClick = async () => {
    const { value: email } = await Swal.fire({
      title: 'Verify Email',
      input: 'email',
      inputLabel: 'We will send a 6-digit code',
      confirmButtonColor: '#3B82F6',
      showCancelButton: true,
    });

    if (email) {
      Swal.fire({ title: 'Sending...', didOpen: () => Swal.showLoading() });

      try {
        const res = await fetch(`/api/email-verify?email=${email}`);
        const data = await res.json();

        if (res.ok) {
          const { value: enteredCode } = await Swal.fire({
            title: 'Enter Code',
            input: 'text',
            confirmButtonColor: '#10B981',
            showCancelButton: true,
          });

          if (enteredCode === data.code.toString()) {
            const dbUpdate = await fetch('/api/user/verify-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: email, status: true }),
            });

            if (dbUpdate.ok) {
              setIsVerified(true);
              const userData = JSON.parse(localStorage.getItem('user'));
              userData.isVerified = true;
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
              Swal.fire(
                'Verified!',
                'Your email is verified permanently.',
                'success',
              );
            }
          }
        }
      } catch (err) {
        Swal.fire('Error', 'Something went wrong!', 'error');
      }
    }
  };

  // 3. Logout Handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.clear();
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!mounted) return null;

  const navRoutes = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Pricing', href: '#pricing', icon: '💎' },
    { name: 'How it works', href: '#how-it-works', icon: '⚙️' },
    { name: 'About', href: '#about', icon: '✨' },
  ];

  return (
    <div className="flex bg-base-100/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] w-full justify-center sticky top-0 z-50 pt-2 border-none !outline-none">
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
                {navRoutes.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-primary/10 transition-all border-none"
                    >
                      <span className="text-lg">{item.icon}</span>
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
            {navRoutes.map(item => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="relative px-5 py-2 font-bold text-base-content/70 hover:text-primary transition-all group !bg-transparent border-none !outline-none"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-primary rounded-full transition-all duration-300 group-hover:w-2/3 group-hover:left-[16.5%]"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Navbar End: Notifications & User Profile */}
        <div className="navbar-end gap-3 flex items-center">
          {user ? (
            <>
              {/* 1. Notifications */}
              <button className="btn btn-ghost btn-circle relative group hover:bg-primary/10 transition-all duration-500">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-base-content/70 group-hover:text-primary transition-all"
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
                  <span className="indicator-item flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] font-black text-white items-center justify-center">
                      1
                    </span>
                  </span>
                </div>
              </button>

              {/* 2. Desktop User Identity */}
              <div className="hidden xl:flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${isVerified ? 'bg-blue-500' : 'bg-red-500 animate-pulse'}`}
                  ></span>
                  <p className="text-sm font-black text-base-content">
                    {user.name}
                  </p>
                </div>
                <div className="flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5">
                  <span className="text-[8px] font-black uppercase text-primary italic tracking-widest">
                    {user.role}
                  </span>
                  <div className="mx-1 h-3 w-[1px] bg-primary/20"></div>
                  {isVerified ? (
                    <span className="text-[8px] font-bold text-blue-600 uppercase">
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={handleVerifyClick}
                      className="text-[8px] font-bold text-red-500 hover:text-red-700 uppercase cursor-pointer"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Avatar Dropdown */}
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar border-2 border-primary/10 hover:border-primary/40 p-0.5 bg-base-200/50 transition-all duration-300"
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white font-bold overflow-hidden relative">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-5 z-[50] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-xl rounded-[2.5rem] w-72 border-none"
                >
                  <div className="px-4 py-5 mb-2 bg-gradient-to-br from-primary/5 to-primary/15 rounded-[2rem] flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-3 shadow-lg">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt="User"
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="font-black text-lg text-base-content">
                        {user.name}
                      </p>
                      {isVerified && (
                        <span className="text-blue-500 text-sm">✔</span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-primary text-white rounded-full mt-1">
                      {user.role}
                    </span>
                  </div>

                  <div className="px-2 space-y-1">
                    <li>
                      <Link
                        href={`/shared/publicProfile?id=${user._id}`}
                        className="rounded-xl py-3 flex items-center gap-3 hover:bg-primary/10 transition-all group border-none"
                      >
                        <span className="p-2 bg-base-200 rounded-lg group-hover:bg-primary/20">
                          👤
                        </span>
                        <span className="font-bold">My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/dashboard/${user.role}`}
                        className="rounded-xl py-3 flex items-center gap-3 hover:bg-primary/10 transition-all group border-none"
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
                        className="rounded-xl py-3 flex items-center gap-3 hover:bg-primary/10 transition-all group border-none"
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
                      className="flex items-center justify-center gap-2 bg-error/10 hover:bg-error text-error hover:text-white transition-all py-3.5 rounded-[1.5rem] font-black w-full border-none"
                    >
                      LOGOUT
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/auth/login"
                className="btn btn-ghost rounded-2xl px-6 font-bold uppercase"
              >
                Sign In
              </Link>
              <Link
                href="/auth/registration"
                className="btn btn-primary rounded-2xl px-6 font-black text-white shadow-xl shadow-primary/20 border-none uppercase"
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
