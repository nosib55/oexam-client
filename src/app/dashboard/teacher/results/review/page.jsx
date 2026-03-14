'use client';

import React, { useState } from 'react';
import {
  FaSearch,
  FaCheckCircle,
  FaPenNib,
  FaClock,
  FaUserGraduate,
  FaArrowRight,
  FaFilter,
} from 'react-icons/fa';

const pendingScripts = [
  {
    id: 1,
    student: 'Ayesha Rahman',
    exam: 'ICT Mid Term',
    date: '02 Mar 2026',
    time: '10:30 AM',
    status: 'Pending',
  },
  {
    id: 2,
    student: 'Rakib Hasan',
    exam: 'Physics Final',
    date: '04 Mar 2026',
    time: '02:15 PM',
    status: 'In Progress',
  },
  {
    id: 3,
    student: 'Nusrat Jahan',
    exam: 'Math Quiz',
    date: '05 Mar 2026',
    time: '11:00 AM',
    status: 'Pending',
  },
  {
    id: 4,
    student: 'Tanvir Ahmed',
    exam: 'English Grammar',
    date: '05 Mar 2026',
    time: '09:45 AM',
    status: 'Pending',
  },
];

const ScriptCheck = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-4 lg:p-0">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl transition-all">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              Review Center
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
              Script <span className="text-primary">Evaluation</span>
            </h1>
            <p className="text-sm font-bold text-slate-400 mt-2">
              Evaluate student answers and assign marks
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                To Check
              </span>
              <span className="text-2xl font-black text-primary">14</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl flex flex-col items-center min-w-[100px] text-white">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Evaluated
              </span>
              <span className="text-2xl font-black text-emerald-400">128</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FILTERS & SEARCH ================= */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or exam name..."
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-2xl text-slate-500 font-bold text-sm cursor-pointer hover:bg-slate-100 transition-all">
          <FaFilter size={14} className="text-primary" />
          <span>Recent Submissions</span>
        </div>
      </div>

      {/* ================= SCRIPTS LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingScripts.map(script => (
          <div
            key={script.id}
            className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all relative overflow-hidden"
          >
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <FaUserGraduate size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 tracking-tight">
                      {script.student}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {script.exam}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FaClock size={12} className="text-primary" />
                    <span className="text-xs font-bold">{script.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FaPenNib size={12} className="text-primary" />
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${script.status === 'In Progress' ? 'text-amber-500' : 'text-emerald-500'}`}
                    >
                      {script.status}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-90">
                <FaArrowRight size={20} />
              </button>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-6 -right-6 text-slate-50 group-hover:text-primary/5 transition-colors">
              <FaCheckCircle size={100} />
            </div>
          </div>
        ))}
      </div>

      {pendingScripts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">
            All scripts have been evaluated!
          </p>
        </div>
      )}
    </div>
  );
};

export default ScriptCheck;
