"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaBell, FaGlobe, FaShieldAlt, FaCamera } from "react-icons/fa";

export default function Settings() {
  return (
    <div className="space-y-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Account Settings</h1>
        <p className="text-base-content/60 font-medium mt-1">Manage your profile, security, and system preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-2"
        >
           {[
             { label: "Profile", icon: <FaUser /> },
             { label: "Security", icon: <FaLock /> },
             { label: "Notifications", icon: <FaBell /> },
             { label: "Language", icon: <FaGlobe /> },
             { label: "Privacy", icon: <FaShieldAlt /> },
           ].map((item, i) => (
             <button key={i} className={`flex items-center gap-3 w-full p-4 rounded-2xl font-black text-sm transition-all ${
               i === 0 
               ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' 
               : 'text-base-content/50 hover:bg-base-200 hover:text-base-content'
             }`}>
               <span className="text-lg">{item.icon}</span> {item.label}
             </button>
           ))}
        </motion.div>

        {/* Form */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-base-100 border border-base-300 rounded-[2rem] p-8 lg:p-10 shadow-sm relative overflow-hidden"
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
           
           <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 border-b border-base-200 pb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 group-hover:border-primary transition-colors cursor-pointer overflow-hidden">
                    <FaUser size={40} className="text-primary/40 group-hover:text-primary transition-colors" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                    <FaCamera size={14} />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-black text-base-content">MRB RAFI</h3>
                <p className="text-base-content/50 font-bold text-sm">Undergraduate Student • Year 1</p>
                <button className="text-primary font-black text-xs uppercase tracking-widest mt-2 hover:underline">Change Avatar</button>
              </div>
           </div>

           <h2 className="text-xl font-black mb-8 flex items-center gap-2">
             <span className="w-1.5 h-6 bg-primary rounded-full"></span>
             Personal Information
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="form-control group">
                <label className="label mb-1">
                    <span className="label-text font-black text-[10px] uppercase text-base-content/40 tracking-widest group-focus-within:text-primary transition-colors">Full Name</span>
                </label>
                <input type="text" defaultValue="MRB RAFI" className="input input-bordered rounded-2xl bg-base-200/30 border-none font-bold text-base-content focus:bg-base-200 transition-all h-14" />
              </div>
              <div className="form-control group">
                <label className="label mb-1">
                    <span className="label-text font-black text-[10px] uppercase text-base-content/40 tracking-widest group-focus-within:text-primary transition-colors">Email Address</span>
                </label>
                <input type="email" defaultValue="devmrbrafi@gmail.com" className="input input-bordered rounded-2xl bg-base-200/30 border-none font-bold text-base-content focus:bg-base-200 transition-all h-14" />
              </div>
              <div className="form-control">
                <label className="label mb-1">
                    <span className="label-text font-black text-[10px] uppercase text-base-content/40 tracking-widest">Enrollment Number</span>
                </label>
                <input type="text" defaultValue="ST-2024-8901" disabled className="input input-bordered rounded-2xl bg-base-200/10 border-none font-bold text-base-content/30 h-14 cursor-not-allowed" />
              </div>
              <div className="form-control group">
                <label className="label mb-1">
                    <span className="label-text font-black text-[10px] uppercase text-base-content/40 tracking-widest group-focus-within:text-primary transition-colors">Phone Number</span>
                </label>
                <input type="text" defaultValue="+1 (555) 000-1234" className="input input-bordered rounded-2xl bg-base-200/30 border-none font-bold text-base-content focus:bg-base-200 transition-all h-14" />
              </div>
           </div>

           <div className="form-control mt-8 group">
              <label className="label mb-1">
                <span className="label-text font-black text-[10px] uppercase text-base-content/40 tracking-widest group-focus-within:text-primary transition-colors">Professional Summary / Bio</span>
              </label>
              <textarea placeholder="Write a short bio about your academic interests..." className="textarea textarea-bordered rounded-2xl bg-base-200/30 border-none font-bold min-h-[120px] focus:bg-base-200 transition-all py-4"></textarea>
           </div>

           <div className="flex flex-col sm:flex-row justify-end mt-12 gap-4 border-t border-base-200 pt-8">
              <button className="btn btn-ghost rounded-2xl font-black px-8">Discard Changes</button>
              <button className="btn btn-primary rounded-2xl px-12 font-black shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">Save Profile Settings</button>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
