"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuMail, LuLock, LuKey, LuArrowLeft, LuCircleCheck, LuLoader, LuShieldCheck } from "react-icons/lu";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // OTP Resend Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent!",
          text: "Verification code has been sent to your email.",
          timer: 2000,
          showConfirmButton: false,
        });
        setStep(2);
        setTimer(60);
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "Email not found", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      Swal.fire("Incomplete", "Please enter the 6-digit code.", "info");
      return;
    }
    // Since we verify OTP on the final reset call, we just proceed to step 3
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      Swal.fire("Weak Password", "Password must be at least 4 characters long.", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your password has been reset successfully.",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#2b4bee",
        }).then(() => {
          window.location.href = "/auth/login";
        });
      } else {
        const data = await res.json();
        Swal.fire("Failed", data.message || "Invalid or expired OTP", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to reset password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F9] flex items-center justify-center p-6 font-jakarta">
      
      {/* Background Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-200/50 blur-[100px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Link */}
        <Link 
          href="/auth/login" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-sm mb-8 transition-all group"
        >
          <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Secure Login
        </Link>
        
        <div className="bg-white rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary flex-1' : 'bg-slate-100 w-4'}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: REQUEST OTP */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity <span className="text-primary">Key</span></h1>
                  <p className="text-slate-400 font-bold mt-2 text-sm italic">Enter your academic email to request a reset grant.</p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block italic opacity-70">Secured Email</label>
                    <div className="relative">
                      <LuMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ayesha@school.edu"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white p-5 pl-16 rounded-[2rem] outline-none font-bold text-sm transition-all shadow-inner"
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-primary text-secondary p-5 rounded-[2rem] font-black text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-70"
                  >
                    {loading ? <LuLoader className="animate-spin" /> : <LuKey size={20} />}
                    Generate Reset OTP
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: VERIFY OTP */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                    <LuShieldCheck size={40} />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access <span className="text-emerald-500">Sent</span></h1>
                  <p className="text-slate-400 font-bold mt-2 text-sm">We've sent a 6-digit grant code to <span className="text-slate-600 italic">{email}</span></p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="group text-center">
                    <input
                      required
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="0 0 0 0 0 0"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 p-6 rounded-[2.5rem] outline-none font-black text-center text-4xl tracking-[0.5em] transition-all shadow-inner"
                    />
                  </div>
                  
                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-xs font-bold text-slate-300 italic">Resend available in {timer}s</p>
                    ) : (
                      <button type="button" onClick={handleSendOTP} className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Resend Grant Code</button>
                    )}
                  </div>

                  <button
                    className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black text-sm shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                  >
                    <LuCircleCheck size={20} />
                    Confirm Identity
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: RESET PASSWORD */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">New <span className="text-primary">Credentials</span></h1>
                  <p className="text-slate-400 font-bold mt-2 text-sm">Update your vault with a new secure access key.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5 mb-2 block italic opacity-70">Secure Password</label>
                    <div className="relative">
                      <LuLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input
                        required
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white p-5 pl-16 rounded-[2rem] outline-none font-bold text-sm transition-all shadow-inner"
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black text-sm shadow-xl flex items-center justify-center gap-3 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-70"
                  >
                    {loading ? <LuLoader className="animate-spin" /> : <LuCircleCheck size={20} />}
                    Finalize Identity Reset
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Support Link */}
        <p className="text-center mt-10 text-slate-400 text-xs font-bold tracking-tight">
          Facing issues? <a href="#" className="text-primary hover:underline italic">Contact Institutional Support</a>
        </p>
      </motion.div>
    </div>
  );
}
