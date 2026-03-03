'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaMapMarkerAlt,
  FaSave,
  FaCloudUploadAlt,
} from 'react-icons/fa';

const AddNewStudent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    className: '10',
    gender: 'Male',
    address: '',
  });

  return (
    <div className="max-w-5xl mx-auto pb-20 p-4 lg:p-0">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard/teacher/students"
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-xl transition-all active:scale-90"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Add New Student
            </h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">
              Student Enrollment Portal
            </p>
          </div>
        </div>

        <button className="hidden md:flex bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 transition-all items-center gap-2 active:scale-95">
          <FaSave size={18} />
          <span>Enroll Student</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT SIDE: AVATAR UPLOAD ================= */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group cursor-pointer">
              <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:bg-primary/5 transition-all overflow-hidden">
                <FaUserCircle
                  size={80}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                <FaCloudUploadAlt size={18} />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-bold text-slate-700">Student Photo</h3>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-primary">
                Quick Info
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Ensuring correct email and phone number is vital for automated
                result notifications via SMS and Email.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: FORM FIELDS ================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. Ayesha Rahman"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    type="tel"
                    placeholder="+880 1XXX XXXXXX"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Class Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Assigned Class
                </label>
                <div className="relative group">
                  <FaSchool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <select className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-600 text-sm appearance-none cursor-pointer">
                    <option>Class 07</option>
                    <option>Class 08</option>
                    <option>Class 09</option>
                    <option>Class 10</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gender Switcher */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Gender
              </label>
              <div className="flex gap-4">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      formData.gender === g
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                    onClick={() => setFormData({ ...formData, gender: g })}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Permanent Address
              </label>
              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-4 top-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                <textarea
                  placeholder="Enter full address here..."
                  className="w-full pl-11 pr-4 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm min-h-[120px] transition-all"
                />
              </div>
            </div>

            {/* Mobile Submit Button */}
            <button className="md:hidden w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95">
              <FaSave size={18} />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewStudent;
