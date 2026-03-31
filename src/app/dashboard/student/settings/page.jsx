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
  LuCheck,
  LuSchool,
  LuMapPin,
  LuHash
} from "react-icons/lu";

export default function StudentProfileSettings() {
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    institution: "",
    userClass: "",
    location: ""
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
          name: data.name || "",
          email: data.email || "",
          image: data.image || "",
          institution: data.institution || "",
          userClass: data.userClass || "",
          location: data.location || ""
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
          title: 'Photo Uploaded',
          text: 'Your profile picture has been updated.',
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
          image: formData.image,
          institution: formData.institution,
          userClass: formData.userClass,
          location: formData.location
        })
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Saved',
          text: 'Your profile information has been successfully updated.',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Update local state and localStorage
        const updatedUser = data.user || data; 
        setOriginalData(updatedUser);
        
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...updatedUser }));
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

  /* PASSWORD RESET MODAL LOGIC */
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const [authMode, setAuthMode] = useState("password");
  const [resetEmail, setResetEmail] = useState("");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [verified, setVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendCode = async () => {
    const targetEmail = resetEmail || formData.email;
    if (!targetEmail) {
      Swal.fire({ icon: 'warning', title: 'Email Required', text: 'Please enter your registered email address.' });
      return;
    }
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail })
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'OTP Sent', text: 'Check your email for the 6-digit verification code.' });
        setResetEmail(targetEmail);
        setStep(2);
        setTimer(60);
      } else {
        const data = await res.json();
        Swal.fire({ icon: 'error', title: 'Failed', text: data.message || "Failed to send verification code." });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Server Error', text: 'Error requesting reset code.' });
    }
  };

  const verifyCode = () => {
    if (code.length === 6) {
      setVerified(true);
      Swal.fire({ icon: 'success', title: 'Verified', text: 'Identity confirmed. Set your new password.', timer: 1500, showConfirmButton: false });
    } else {
      Swal.fire({ icon: 'info', title: 'Invalid Code', text: 'Please enter a valid 6-digit OTP.' });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Swal.fire({ icon: 'warning', title: 'Fields Missing', text: 'Both current and new passwords are required.' });
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Security Updated', text: 'Your password has been changed.', timer: 2000, showConfirmButton: false });
        closeModal();
      } else {
        const data = await res.json();
        Swal.fire({ icon: 'error', title: 'Update Failed', text: data.message || "Incorrect current password." });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Server Error', text: 'Error during password change.' });
    }
  };

  const savePasswordReset = async () => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: code, newPassword })
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Reset Success', text: 'Your password has been reset.', timer: 2000, showConfirmButton: false });
        closeModal();
      } else {
        const data = await res.json();
        Swal.fire({ icon: 'error', title: 'Reset Failed', text: data.message || "Invalid OTP or expired." });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Server Error', text: 'Error during reset.' });
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setStep(1);
    setAuthMode("password");
    setVerified(false);
    setResetEmail("");
    setCode("");
    setCurrentPassword("");
    setNewPassword("");
  };

  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-[1100px] mx-auto space-y-8">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Account <span className="text-primary">Settings</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage your personal student profile and security
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm border border-emerald-100">
            <LuUser size={18} />
            Verified Student
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.2fr,2fr] gap-8 font-jakarta">
          
          {/* PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center sticky top-8 h-fit"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative rounded-[2.5rem] p-2 bg-white ring-4 ring-slate-50 overflow-hidden shadow-sm">
                <Image
                  src={formData.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (formData.name || "student")}
                  width={160}
                  height={160}
                  alt="Profile"
                  className="rounded-[2rem] object-cover w-[160px] h-[160px] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <label className="absolute bottom-2 right-2 p-3 bg-primary text-secondary rounded-2xl cursor-pointer shadow-xl hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-200 z-10">
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
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                {formData.name || "Student User"}
              </h2>
              <p className="text-primary font-black tracking-widest text-[10px] mt-2 uppercase opacity-60">
                {formData.institution || "NOT CONNECTED"}
              </p>
            </div>

            <div className="w-full mt-10 space-y-3">
              <div className="p-4 bg-slate-50 rounded-3xl flex items-center gap-4 text-slate-600 border border-slate-100">
                <div className="p-2 bg-white rounded-xl shadow-sm"><LuMail className="text-primary" /></div>
                <span className="font-bold text-xs truncate">{formData.email}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-3xl flex items-center gap-4 text-slate-600 border border-slate-100">
                <div className="p-2 bg-white rounded-xl shadow-sm"><LuSchool className="text-primary" /></div>
                <span className="font-bold text-xs">{formData.userClass || "General Class"}</span>
              </div>
            </div>
          </motion.div>

          {/* EDIT FORM PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
          >
            <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-8">
              <div className="p-3 bg-primary/5 text-primary rounded-2xl">
                <LuUser size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Personal File</h3>
                <p className="text-slate-500 font-medium text-sm">Update your academic and contact details</p>
              </div>
            </div>

            <div className="space-y-6">
              
              {/* Grid 2 Cols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* NAME */}
                 <div className="group">
                   <label className="text-[10px] font-black text-slate-400 ml-4 mb-2 block tracking-widest uppercase">Full Name</label>
                   <div className="relative">
                     <LuUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                     <input
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 transition-all shadow-inner"
                       placeholder="Enter your name"
                     />
                   </div>
                 </div>

                 {/* EMAIL (LOCKED) */}
                 <div className="opacity-80">
                   <label className="text-[10px] font-black text-slate-400 ml-4 mb-2 block tracking-widest uppercase">Email Address</label>
                   <div className="relative">
                     <LuMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-200" />
                     <input value={formData.email} disabled className="w-full bg-slate-100/50 border-2 border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-400 cursor-not-allowed italic" />
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* INSTITUTION */}
                 <div className="group">
                   <label className="text-[10px] font-black text-slate-400 ml-4 mb-2 block tracking-widest uppercase">Institution</label>
                   <div className="relative">
                     <LuSchool className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                     <input
                       name="institution"
                       value={formData.institution}
                       onChange={handleChange}
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 transition-all shadow-inner"
                       placeholder="School / College Name"
                     />
                   </div>
                 </div>

                 {/* CLASS */}
                 <div className="group">
                   <label className="text-[10px] font-black text-slate-400 ml-4 mb-2 block tracking-widest uppercase">Class / Level</label>
                   <div className="relative">
                     <LuHash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                     <input
                       name="userClass"
                       value={formData.userClass}
                       onChange={handleChange}
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 transition-all shadow-inner"
                       placeholder="E.g. Grade 10"
                     />
                   </div>
                 </div>
              </div>

              {/* LOCATION */}
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 ml-4 mb-2 block tracking-widest uppercase">Current Location</label>
                <div className="relative">
                  <LuMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 transition-all shadow-inner"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-primary text-secondary py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95"
                >
                  <LuSave size={20} className="group-hover:scale-110 transition-transform" />
                  Save Profile Info
                </button>
              </div>

              {/* PASSWORD TRIGGER */}
              <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                    <LuKey size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">Security & Access</h4>
                    <p className="text-slate-400 text-xs font-bold mt-1 tracking-tight">Rotate your password for better safety</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpenModal(true)}
                  className="w-full sm:w-fit px-8 py-3.5 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all shadow-sm active:scale-95"
                >
                  <LuLock size={16} />
                  Reset Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white p-10 rounded-[3rem] w-full max-w-[460px] shadow-2xl border border-slate-100">
              <button onClick={closeModal} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors"><LuX size={24} /></button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4"><LuLock size={32} /></div>
                <h2 className="text-3xl font-black text-slate-900">Security Gate</h2>
                <div className="flex justify-center gap-2 mt-4 bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto cursor-pointer">
                  <button onClick={() => setAuthMode("password")} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${authMode === 'password' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}>Direct Key</button>
                  <button onClick={() => { setAuthMode("otp"); setStep(1); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${authMode === 'otp' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}>OTP Recovery</button>
                </div>
              </div>

              {authMode === "password" ? (
                <div className="space-y-5">
                  <div className="relative">
                    <LuLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white p-4 pl-14 rounded-2xl outline-none font-bold text-sm transition-all shadow-inner" />
                  </div>
                  <div className="relative">
                    <LuKey className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Secure Password" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white p-4 pl-14 rounded-2xl outline-none font-bold text-sm transition-all shadow-inner" />
                  </div>
                  <button onClick={handleChangePassword} className="w-full bg-primary text-secondary p-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">Verify & Update</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="relative"><LuMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" /><input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Your Registered Email" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white p-4 pl-14 rounded-2xl outline-none font-bold text-sm transition-all shadow-inner" /></div>
                      <button onClick={sendCode} className="w-full bg-primary text-secondary p-4 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] transition-all">Send OTP</button>
                    </div>
                  )}
                  {step === 2 && !verified && (
                    <div className="space-y-5">
                      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" maxLength={6} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-black text-center text-4xl tracking-widest" />
                      <div className="text-center">{timer > 0 ? <p className="text-xs font-bold text-slate-400">Wait {timer}s to resend</p> : <button onClick={sendCode} className="text-primary text-xs font-black uppercase hover:underline">Resend Code</button>}</div>
                      <button onClick={verifyCode} className="w-full bg-emerald-500 text-white p-4 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] transition-all">Confirm OTP</button>
                    </div>
                  )}
                  {verified && (
                    <div className="space-y-4">
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-center" />
                      <button onClick={savePasswordReset} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] transition-all">Reset Password</button>
                    </div>
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
