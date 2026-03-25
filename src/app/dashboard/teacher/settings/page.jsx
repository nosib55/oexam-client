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
  LuBriefcase,
  LuFingerprint
} from "react-icons/lu";

export default function TeacherProfileSettings() {
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    institution: "",
    location: "",
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
          text: 'Your professional profile picture has been updated.',
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
          location: formData.location
        })
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your teacher profile has been successfully saved.',
          timer: 2000,
          showConfirmButton: false
        });
        
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
        Swal.fire({ icon: 'success', title: 'OTP Sent', text: 'Identity confirmation code sent to your email.' });
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
      Swal.fire({ icon: 'success', title: 'Verified', text: 'Identity confirmed. Proceed to reset password.', timer: 1500, showConfirmButton: false });
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
        Swal.fire({ icon: 'success', title: 'Security Updated', text: 'Your login credentials have been rotated.', timer: 2000, showConfirmButton: false });
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
        Swal.fire({ icon: 'success', title: 'Reset Success', text: 'Account password has been successfully reset.', timer: 2000, showConfirmButton: false });
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
    <div className="min-h-screen pb-12 font-jakarta">
      <div className="max-w-[1100px] mx-auto space-y-8">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              Settings & <span className="text-primary">Policy</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Manage your professional educator profile and system access
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-2xl font-black text-sm border border-primary/20 shadow-sm">
            <LuBriefcase size={20} />
            Professional Account
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.2fr,2fr] gap-10">
          
          {/* PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center sticky top-8 h-fit group"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-primary/50 to-indigo-600 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative rounded-[3rem] p-2 bg-white ring-8 ring-slate-50 overflow-hidden shadow-sm">
                <Image
                  src={formData.image || "https://api.dicebear.com/7.x/initials/svg?seed=" + (formData.name || "teacher")}
                  width={180}
                  height={180}
                  alt="Profile"
                  className="rounded-[2.5rem] object-cover w-[180px] h-[180px] transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <label className="absolute -bottom-3 -right-3 p-4 bg-slate-900 text-white rounded-3xl cursor-pointer shadow-2xl hover:bg-primary transition-all duration-300 z-10 hover:scale-110 active:scale-90 border-4 border-white">
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

            <div className="mt-10 text-center">
              <h2 className="text-3xl font-black text-slate-800 leading-tight">
                {formData.name || "Educator"}
              </h2>
              <p className="text-primary font-black tracking-widest text-[10px] mt-2 uppercase opacity-60">
                {formData.institution || "INSTITUTION NOT SET"}
              </p>
            </div>

            <div className="w-full mt-10 space-y-3">
              <div className="p-5 bg-slate-50 rounded-[2rem] flex items-center gap-4 text-slate-600 border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="p-2.5 bg-white rounded-xl shadow-sm"><LuMail className="text-primary" /></div>
                <span className="font-bold text-xs truncate">{formData.email}</span>
              </div>
              <div className="p-5 bg-slate-50 rounded-[2rem] flex items-center gap-4 text-slate-600 border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="p-2.5 bg-white rounded-xl shadow-sm"><LuFingerprint className="text-primary" /></div>
                <span className="font-bold text-xs uppercase tracking-widest text-slate-400">Teacher ID: {originalData?._id?.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </motion.div>

          {/* EDIT FORM PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 md:p-14 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
          >
            <div className="flex items-center gap-5 mb-14 border-b border-slate-50 pb-10">
              <div className="p-4 bg-primary/5 text-primary rounded-[1.5rem] shadow-inner">
                <LuUser size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Personal Dossier</h3>
                <p className="text-slate-400 font-bold text-sm mt-1">Official information for institutional records</p>
              </div>
            </div>

            <div className="space-y-8">
              
              {/* Grid 2 Cols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* NAME */}
                 <div className="group">
                   <label className="text-[10px] font-black text-slate-400 ml-5 mb-2 block tracking-widest uppercase italic opacity-70">Legal Name</label>
                   <div className="relative">
                     <LuUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                     <input
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-[2rem] py-5 pl-14 pr-8 text-sm font-bold text-slate-800 transition-all shadow-inner"
                       placeholder="Enter your name"
                     />
                   </div>
                 </div>

                 {/* EMAIL (LOCKED) */}
                 <div className="opacity-80">
                   <label className="text-[10px] font-black text-slate-400 ml-5 mb-2 block tracking-widest uppercase italic opacity-70">Professional Email</label>
                   <div className="relative">
                     <LuMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200" />
                     <input value={formData.email} disabled className="w-full bg-slate-100/30 border-2 border-slate-100 rounded-[2rem] py-5 pl-14 pr-8 text-sm font-bold text-slate-400 cursor-not-allowed italic" />
                     <LuLock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200" />
                   </div>
                 </div>
              </div>

              {/* INSTITUTION */}
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 ml-5 mb-2 block tracking-widest uppercase italic opacity-70">Associated Institution</label>
                <div className="relative">
                  <LuSchool className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-[2rem] py-5 pl-14 pr-8 text-sm font-bold text-slate-800 transition-all shadow-inner"
                    placeholder="Full University or School Name"
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 ml-5 mb-2 block tracking-widest uppercase italic opacity-70">Regional Location</label>
                <div className="relative">
                  <LuMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-[2rem] py-5 pl-14 pr-8 text-sm font-bold text-slate-800 transition-all shadow-inner"
                    placeholder="E.g. Dhaka, Bangladesh"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm shadow-2xl hover:bg-primary transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95"
                >
                  <LuSave size={20} className="group-hover:scale-110 transition-transform" />
                  Update Teacher Profile
                </button>
              </div>

              {/* PASSWORD TRIGGER */}
              <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-red-50 text-red-500 rounded-[1.5rem] shadow-sm">
                    <LuShield size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm italic">Cyber Security</h4>
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-1">Manage system authentication</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpenModal(true)}
                  className="w-full sm:w-fit px-10 py-4 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all shadow-sm active:scale-95 group"
                >
                  <LuLock size={16} className="group-hover:rotate-12 transition-transform" />
                  Change Password
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
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative bg-white p-12 rounded-[4rem] w-full max-w-[480px] shadow-2xl border border-slate-100 overflow-hidden">
              <button onClick={closeModal} className="absolute top-10 right-10 p-2 text-slate-300 hover:text-slate-900 transition-colors z-20"><LuX size={28} /></button>
              
              <div className="text-center mb-10 relative z-10">
                <div className="w-20 h-20 bg-primary/5 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner"><LuLock size={40} /></div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Access Key</h2>
                <div className="flex justify-center gap-2 mt-6 bg-slate-50 p-2 rounded-[1.5rem] w-fit mx-auto border border-slate-100">
                  <button onClick={() => setAuthMode("password")} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${authMode === 'password' ? 'bg-white shadow-md text-primary' : 'text-slate-400'}`}>Standard</button>
                  <button onClick={() => { setAuthMode("otp"); setStep(1); }} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${authMode === 'otp' ? 'bg-white shadow-md text-primary' : 'text-slate-400'}`}>OTP Reset</button>
                </div>
              </div>

              {authMode === "password" ? (
                <div className="space-y-6">
                  <div className="relative"><LuLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" /><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Secret Key" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white p-5 pl-16 rounded-[2rem] outline-none font-bold text-sm transition-all shadow-inner" /></div>
                  <div className="relative"><LuKey className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" /><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Secure Password" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white p-5 pl-16 rounded-[2rem] outline-none font-bold text-sm transition-all shadow-inner" /></div>
                  <button onClick={handleChangePassword} className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black text-sm shadow-xl hover:bg-primary transition-all active:scale-95">Update Security</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="relative"><LuMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" /><input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Registered Master Email" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white p-5 pl-16 rounded-[2rem] outline-none font-bold text-sm transition-all shadow-inner" /></div>
                      <button onClick={sendCode} className="w-full bg-primary text-secondary p-5 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all">Generate OTP Grant</button>
                    </div>
                  )}
                  {step === 2 && !verified && (
                    <div className="space-y-6">
                      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="••••••" maxLength={6} className="w-full bg-slate-50 border-2 border-transparent focus:border-primary p-6 rounded-[2.5rem] outline-none font-black text-center text-5xl tracking-[1rem] transition-all shadow-inner" />
                      <div className="text-center">{timer > 0 ? <p className="text-xs font-bold text-slate-400 italic">Code expires in {timer}s</p> : <button onClick={sendCode} className="text-primary text-xs font-black uppercase hover:underline">Resend Auth Request</button>}</div>
                      <button onClick={verifyCode} className="w-full bg-emerald-500 text-white p-5 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all">Verify Identity</button>
                    </div>
                  )}
                  {verified && (
                    <div className="space-y-4">
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter New Password" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary p-5 rounded-[2rem] outline-none font-bold text-center" />
                      <button onClick={savePasswordReset} className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all">Set New Credentials</button>
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
