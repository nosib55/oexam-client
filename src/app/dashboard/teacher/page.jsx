'use client';
import Link from 'next/link';
import React from 'react';
import {
  LuPlus,
  LuLogOut,
  LuTrendingUp,
  LuFolder,
  LuUsers,
  LuCalendar,
  LuLightbulb,
  LuClock,
  LuCircleArrowRight,
  LuPlay,
  LuSquare,
  LuTrophy,
  LuSettings,
} from 'react-icons/lu';

export default function TeacherPage() {
  const stats = [
    {
      label: 'Active Exams',
      value: '03',
      icon: <LuCircleArrowRight />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Avg Pass Rate',
      value: '84%',
      icon: <LuTrendingUp />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Question Bank',
      value: '128',
      icon: <LuFolder />,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Total Students',
      value: '142',
      icon: <LuUsers />,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-4 lg:p-0">
      {/* ================= PREMIUM HEADER ================= */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] shadow-2xl border transition-all hover:shadow-primary/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                Live Engine
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Verified Educator
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Teacher <span className="text-primary">Console</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/teacher/exams">
              <button className="bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl px-8 font-bold shadow-xl shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
                <LuPlus size={20} /> Create New Exam
              </button>
            </Link>
            <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 border border-white/10 hover:bg-red-500/20 hover:text-red-400 transition-all">
              <LuLogOut size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= MAIN CONTENT: EXAM CONTROL & RESULTS ================= */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Live Exam Control */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
                Active Exam Control
              </h3>
              <button className="text-xs font-bold text-primary hover:underline">
                View All Exams
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Exam Control Card */}
              <div className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-primary/20 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase">
                      Status: Running
                    </span>
                    <h4 className="text-xl font-black text-slate-800">
                      Advanced Mathematics - Midterm 2024
                    </h4>
                    <p className="text-sm text-slate-500 font-medium">
                      Started at 10:00 AM • 45 Students active
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
                      <LuSquare size={16} /> Stop Exam
                    </button>
                    <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary hover:text-white transition-all">
                      <LuSettings size={20} />
                    </button>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                    <span>Time Remaining: 45m</span>
                    <span>Submission: 28/45</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%] rounded-full shadow-lg shadow-primary/20"></div>
                  </div>
                </div>
              </div>

              {/* Scheduled Exam */}
              <div className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                      <LuCalendar size={24} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800">
                        Physics Final Quiz
                      </h5>
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest">
                        Oct 28 • 02:30 PM
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/10">
                    <LuPlay size={16} /> Publish Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard & Quick Action */}
        <div className="lg:col-span-4 space-y-8">
          {/* Real-time Leaderboard */}
          <div className="bg-slate-900 text-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full"></div>
            <div className="flex items-center gap-3 mb-8">
              <LuTrophy className="text-amber-400" size={24} />
              <h3 className="font-black text-lg tracking-tight">
                Live Leaderboard
              </h3>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Sabbir Ahmed', mark: '98', rank: '01' },
                { name: 'Nusrat Jahan', mark: '95', rank: '02' },
                { name: 'Arif Rayhan', mark: '92', rank: '03' },
              ].map((student, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-slate-500">
                      {student.rank}
                    </span>
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">
                      {student.name}
                    </p>
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-white/5 rounded-lg">
                    {student.mark}%
                  </span>
                </div>
              ))}
              <button className="w-full py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all">
                View Full Results
              </button>
            </div>
          </div>

          {/* Growth Insight */}
          <div className="bg-gradient-to-br from-indigo-600 to-primary p-8 rounded-[3rem] text-white shadow-xl relative group overflow-hidden">
            <LuLightbulb
              size={32}
              className="mb-4 group-hover:animate-bounce transition-all"
            />
            <h4 className="text-xl font-black leading-tight">Exam Insight</h4>
            <p className="text-xs text-white/70 font-bold mt-2 leading-relaxed">
              Your &#39;Advanced Math&#39; exam shows a 15% improvement in
              average score compared to last month.
            </p>
            <button className="w-full py-4 mt-8 bg-white text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Verify Results
            </button>
          </div>
        </div>
      </div>

      {/* ================= RECENT ACTIVITY FEED ================= */}
      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-inner">
            <LuClock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              System Logs
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Real-time Notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <p className="text-sm font-bold text-slate-700">
                New submission:{' '}
                <span className="text-primary italic">Farhana Islam</span>{' '}
                completed Math Midterm
              </p>
            </div>
            <span className="text-[10px] font-black text-slate-400">
              2 MINUTES AGO
            </span>
          </div>

          <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <p className="text-sm font-bold text-slate-700">
                Exam Reminder:{' '}
                <span className="text-slate-500 italic">Physics Final</span>{' '}
                starts in 4 hours
              </p>
            </div>
            <span className="text-[10px] font-black text-slate-400">
              1 HOUR AGO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
