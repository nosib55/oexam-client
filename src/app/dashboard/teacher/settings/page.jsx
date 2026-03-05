'use client';

import { useState } from 'react';
import {
  FaUser,
  FaClipboardCheck,
  FaBell,
  FaShieldAlt,
  FaCamera,
  FaSave,
  FaKey,
} from 'react-icons/fa';

export default function TeacherSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'exam', label: 'Exam Settings', icon: <FaClipboardCheck /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 p-4 lg:p-0">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl transition-all font-sans">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
            Configuration
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 mt-2">
            Account <span className="text-primary">Settings</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-2">
            Manage your professional profile and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= SIDEBAR TABS ================= */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4 sticky top-4">
          <div className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <span
                  className={
                    activeTab === tab.id ? 'text-white' : 'text-primary'
                  }
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="lg:col-span-9 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden transition-all">
          <div className="p-8 md:p-12">
            {/* --- PROFILE SECTION --- */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-50">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                      <FaUser size={50} className="text-slate-300" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-3 rounded-2xl bg-primary text-white shadow-lg group-hover:scale-110 transition-all active:scale-95">
                      <FaCamera size={14} />
                    </button>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      Profile Identity
                    </h3>
                    <p className="text-sm font-bold text-slate-400">
                      Update your photo and personal details.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      label: 'Full Name',
                      placeholder: 'e.g. Ayesha Rahman',
                      type: 'text',
                    },
                    {
                      label: 'Professional Email',
                      placeholder: 'ayesha@school.com',
                      type: 'email',
                    },
                    {
                      label: 'Phone Number',
                      placeholder: '+880 1XXX XXXXXX',
                      type: 'text',
                    },
                    {
                      label: 'Institution',
                      placeholder: 'Dhaka High School',
                      type: 'text',
                    },
                  ].map((field, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all shadow-inner"
                      />
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-primary transition-all shadow-lg active:scale-95">
                  <FaSave /> Save Identity
                </button>
              </div>
            )}

            {/* --- EXAM SETTINGS --- */}
            {activeTab === 'exam' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Default Duration (Min)
                    </label>
                    <input
                      type="number"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Passing Marks (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                      placeholder="40"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      label: 'Negative Marking',
                      desc: 'Deduct marks for wrong answers',
                      color: 'peer-checked:bg-rose-500',
                    },
                    {
                      label: 'Question Shuffling',
                      desc: 'Randomize question order for students',
                      color: 'peer-checked:bg-primary',
                    },
                    {
                      label: 'Auto Results',
                      desc: 'Publish marks immediately after exam',
                      color: 'peer-checked:bg-emerald-500',
                    },
                  ].map((item, i) => (
                    <label
                      key={i}
                      className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                    >
                      <div>
                        <p className="font-black text-slate-800 text-sm uppercase tracking-tight">
                          {item.label}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {item.desc}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className={`toggle toggle-lg peer ${item.color}`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* --- NOTIFICATIONS --- */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-8">
                  <p className="text-xs font-bold text-blue-600">
                    Tip: Keep Email notifications on to get daily exam
                    summaries.
                  </p>
                </div>
                {['Email Alerts', 'Mobile SMS', 'New Student Enrollment'].map(
                  (notif, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-4 border-b border-slate-50"
                    >
                      <span className="text-sm font-black text-slate-600 uppercase tracking-widest">
                        {notif}
                      </span>
                      <input
                        type="checkbox"
                        className="toggle toggle-success toggle-md"
                        defaultChecked={i !== 1}
                      />
                    </div>
                  ),
                )}
              </div>
            )}

            {/* --- SECURITY --- */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="relative">
                    <FaKey className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-200 font-bold text-slate-700"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-rose-700 uppercase text-xs tracking-widest">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-1">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <input type="checkbox" className="toggle toggle-error" />
                  </div>
                </div>

                <button className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:shadow-2xl transition-all active:scale-95">
                  Update Security Protocol
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
