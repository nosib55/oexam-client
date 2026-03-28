"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  LuUser,
  LuMail,
  LuShield,
  LuLock,
  LuSave,
  LuX,
  LuCamera,
  LuLoader,
  LuKey,
  LuCheck
} from "react-icons/lu";

export default function AdminProfileSettings() {
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: ""
  });

  const [isUploading, setIsUploading] = useState(false);
  const IMGBB_API_KEY = "98310ed2af7832347458b9fbf88d56b4";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) {
        setFormData({
          name: data.name,
          email: data.email,
          image: data.image || ""
        });
        setOriginalData(data);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: body
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        Swal.fire({
          icon: 'success',
          title: 'Uploaded!',
          text: 'Profile picture updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'There was an issue uploading your image.'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error uploading image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          image: formData.image
        })
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Saved',
          text: 'Your profile information has been updated.',
          timer: 2000,
          showConfirmButton: false
        });
        setOriginalData(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          image: data.user.image || ""
        });
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...data.user }));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: data.message || "Could not update profile information."
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An unexpected error occurred while saving profile.'
      });
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData({
        name: originalData.name,
        email: originalData.email,
        image: originalData.image || ""
      });
    }
  };

  /* PASSWORD RESET */
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const [authMode, setAuthMode] = useState("password"); // 'password' or 'otp'
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [verified, setVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendCode = async () => {
    const targetEmail = email || formData.email;
    if (!targetEmail) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your registered email address.'
      });
      return;
    }
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: 'A 6-digit verification code has been sent to your email.'
        });
        setEmail(targetEmail);
        setStep(2);
        setTimer(60);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: data.message || "Failed to send verification code."
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An error occurred while requesting reset code.'
      });
    }
  };

  const verifyCode = () => {
    if (code.length === 6) {
      setVerified(true);
      Swal.fire({
        icon: 'success',
        title: 'Verified',
        text: 'Identity confirmed. You can now set a new password.',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Invalid Code',
        text: 'Please enter a valid 6-digit OTP code.'
      });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Fields Missing',
        text: 'Both current and new passwords are required.'
      });
      return;
    }
    if (newPassword.length < 4) {
      Swal.fire({
        icon: 'info',
        title: 'Password Weak',
        text: 'New password must be at least 4 characters long.'
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Security Updated',
          text: 'Your password has been successfully changed.',
          timer: 2000,
          showConfirmButton: false
        });
        closeModal();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: data.message || "Incorrect current password."
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An unexpected error occurred during change.'
      });
    }
  };

  const savePasswordReset = async () => {
    if (newPassword.length < 4) {
      Swal.fire({
        icon: 'info',
        title: 'Password Weak',
        text: 'New password must be at least 4 characters long.'
      });
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Reset Success',
          text: 'Your password has been successfully reset.',
          timer: 2000,
          showConfirmButton: false
        });
        closeModal();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: data.message || "Invalid OTP code or expired."
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An unexpected error occurred during reset.'
      });
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setStep(1);
    setAuthMode("password");
    setVerified(false);
    setEmail("");
    setCode("");
    setCurrentPassword("");
    setNewPassword("");
  };

  useEffect(() => {
    if (step !== 2) return;
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-[1100px] mx-auto space-y-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5 transition-all duration-300"
        >
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Personalize your administrative workspace
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm border border-blue-100">
            <LuShield size={18} />
            System Administrator
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.2fr,2fr] gap-8">
          {/* PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col items-center sticky top-8 h-fit"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative rounded-full p-2 bg-white ring-4 ring-gray-50 overflow-hidden shadow-sm">
                <Image
                  src={formData.image || "https://i.pravatar.cc/150?img=12"}
                  width={160}
                  height={160}
                  alt="Profile"
                  className="rounded-full object-cover w-[160px] h-[160px] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <label className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-2xl cursor-pointer shadow-xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 z-10">
                {isUploading ? <LuLoader className="animate-spin" size={20} /> : <LuCamera size={20} />}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                {formData.name || "Administrator"}
              </h2>
              <p className="text-blue-600 font-semibold tracking-wide text-sm mt-1 uppercase">
                {formData.email}
              </p>
            </div>

            <div className="w-full mt-10 space-y-3">
              <div className="p-4 bg-gray-50 rounded-3xl flex items-center gap-4 text-gray-600 border border-gray-100 hover:bg-gray-100/50 transition-colors">
                <div className="p-2 bg-white rounded-xl shadow-sm"><LuMail className="text-blue-600" /></div>
                <span className="font-medium truncate">{formData.email}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-3xl flex items-center gap-4 text-gray-600 border border-gray-100 hover:bg-gray-100/50 transition-colors">
                <div className="p-2 bg-white rounded-xl shadow-sm"><LuShield className="text-blue-600" /></div>
                <span className="font-medium">Admin Role Access</span>
              </div>
            </div>
          </motion.div>

          {/* EDIT FORM PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50"
          >
            <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl font-bold">
                <LuUser size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                <p className="text-gray-500 font-medium">Update your display name and visual identity</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* NAME INPUT */}
              <div className="group">
                <label className="text-sm font-bold text-gray-700 ml-4 mb-2 block tracking-wide uppercase italic opacity-70">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <LuUser size={20} />
                  </div>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none rounded-[1.5rem] py-5 pl-14 pr-8 text-lg font-semibold text-gray-800 transition-all duration-300 placeholder:text-gray-300 shadow-inner"
                    placeholder="Enter your professional name"
                  />
                </div>
              </div>

              {/* EMAIL (LOCKED) */}
              <div className="opacity-80">
                <label className="text-sm font-bold text-gray-700 ml-4 mb-2 block tracking-wide uppercase italic opacity-70">
                  Account Email
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                    <LuMail size={20} />
                  </div>
                  <input
                    value={formData.email}
                    disabled
                    className="w-full bg-gray-100/50 border-2 border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-8 text-lg font-semibold text-gray-400 cursor-not-allowed italic"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-100">
                    <LuLock size={12} /> READ ONLY
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 ml-4 font-medium italic">
                  Protected account field. Contact developers to update.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-8">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-br from-blue-700 to-indigo-800 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <LuSave size={22} className="group-hover:scale-110 transition-transform" />
                  Apply Changes
                </button>
              </div>

              {/* PASSWORD TRIGGER */}
              <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                    <LuKey size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Account Security</h4>
                    <p className="text-gray-500 text-sm font-medium">Reset your system login credentials</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpenModal(true)}
                  className="w-full sm:w-fit px-8 py-4 bg-white border-2 border-red-100 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all shadow-sm"
                >
                  <LuLock size={18} />
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* REFINED PASSWORD MODAL */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white p-10 rounded-[3rem] w-full max-w-[480px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden"
            >
              <button
                onClick={closeModal}
                className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors z-20"
              >
                <LuX size={24} />
              </button>

              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                  <LuLock size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Security Key</h2>
                <div className="flex justify-center gap-4 mt-4 bg-gray-50 p-1 rounded-2xl border border-gray-100 w-fit mx-auto">
                  <button
                    onClick={() => setAuthMode("password")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${authMode === 'password' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                  >
                    Password
                  </button>
                  <button
                    onClick={() => { setAuthMode("otp"); setStep(1); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${authMode === 'otp' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                  >
                    OTP Reset
                  </button>
                </div>
              </div>

              {/* CHOICE: VIA CURRENT PASSWORD */}
              {authMode === "password" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-2 tracking-wider">Current Password</label>
                    <div className="relative">
                      <LuLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 pl-14 rounded-2xl outline-none font-bold transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-2 tracking-wider">New Password</label>
                    <div className="relative">
                      <LuKey className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 pl-14 rounded-2xl outline-none font-bold transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Commit Changes
                  </button>
                </motion.div>
              )}

              {/* CHOICE: VIA OTP RESET */}
              {authMode === "otp" && (
                <div className="space-y-6">
                  {/* STEP 1: EMAIL */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <LuMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Verified Email Address"
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 pl-14 rounded-2xl outline-none font-bold placeholder:text-gray-300 transition-all duration-300 shadow-inner"
                        />
                      </div>
                      <button
                        onClick={sendCode}
                        className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Generate OTP
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: VERIFICATION */}
                  {step === 2 && !verified && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <LuCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="6-Digit Auth Code"
                          maxLength={6}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 pl-14 rounded-2xl outline-none font-black text-center text-3xl tracking-[0.5em] transition-all shadow-inner"
                        />
                      </div>

                      <div className="flex items-center justify-center gap-4 py-2">
                        {timer > 0 ? (
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Expires in {timer}s
                          </div>
                        ) : (
                          <button onClick={sendCode} className="text-blue-600 font-bold hover:underline transition-all">
                            Resend Code
                          </button>
                        )}
                      </div>

                      <button
                        onClick={verifyCode}
                        className="w-full bg-green-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-green-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Confirm Access
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 3: NEW PASSWORD */}
                  {verified && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <LuKey className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Create Secure Password"
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white p-5 pl-14 rounded-2xl outline-none font-bold transition-all shadow-inner"
                        />
                      </div>
                      <button
                        onClick={savePasswordReset}
                        className="w-full bg-gray-900 text-white p-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all"
                      >
                        Reset Password
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

