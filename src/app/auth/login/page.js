"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ece9f6] p-4">

      {/* ===== Main Card ===== */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden
                      flex flex-col md:grid md:grid-cols-2">

        {/* ===== LEFT LOGIN FORM ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-10 md:p-12 flex flex-col justify-center order-2 md:order-1"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-primary mb-6 sm:mb-8">
            Login
          </h1>

          {/* Role switch */}
          <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
            {["student", "teacher"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-3 sm:px-4 py-1.5 text-xs rounded-full border transition ${role === r
                  ? "bg-primary text-white border-primary"
                  : "text-gray-500 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form
            className="space-y-4 sm:space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Login as ${role}`);
            }}
          >
            <Input icon={<FiMail />} placeholder="E-mail" type="email" />

            <PasswordInput show={show} toggle={() => setShow(!show)} />

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-gray-500 hover:text-[#2b4bee]"
              >
                Forgot password?
              </Link>
            </div>

            <button className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-[#1f36b8] transition">
              Continue as {role}
            </button>
          </form>
        </motion.div>

        {/* ===== RIGHT PRIMARY PANEL (VISIBLE ON MOBILE) ===== */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-center items-center text-center
                     bg-primary text-white
                     p-8 sm:p-10 md:p-12
                     order-1 md:order-2"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-yellow-300">
            Welcome Back
          </h2>

          <p className="text-sm opacity-90 mb-6 sm:mb-8">
            Don’t have an account?
          </p>

          <Link
            href="/auth/registration"
            className="px-6 sm:px-8 py-2 rounded-full border border-yellow-300
                       text-yellow-300 hover:bg-yellow-300 hover:text-[#2b4bee] transition"
          >
            Register
          </Link>

          {/* dots */}
          <div className="flex gap-3 mt-8 sm:mt-10">
            <span className="w-3 h-3 rounded-full bg-white/80" />
            <span className="w-3 h-3 rounded-full border border-white/60" />
            <span className="w-3 h-3 rounded-full border border-white/60" />
          </div>
        </motion.div>
      </div>

      {/* ===== Back to Home Button ===== */}
      <Link
        href="/"
        className="mt-6 flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition"
      >
        <FiArrowLeft />
        Back to Home
      </Link>
    </div>
  );
}

/* ---------- INPUTS ---------- */

function Input({ icon, type = "text", placeholder }) {
  return (
    <div className="flex items-center border-b border-gray-300 py-2">
      <span className="text-gray-400 mr-3">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full outline-none text-sm placeholder-gray-400"
      />
    </div>
  );
}

function PasswordInput({ show, toggle }) {
  return (
    <div className="flex items-center border-b border-gray-300 py-2">
      <FiLock className="text-gray-400 mr-3" />
      <input
        type={show ? "text" : "password"}
        placeholder="Password"
        className="w-full outline-none text-sm placeholder-gray-400"
      />
      <button type="button" onClick={toggle} className="text-gray-400">
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

