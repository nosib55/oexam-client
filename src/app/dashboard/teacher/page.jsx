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
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 pb-10 p-4 lg:p-6">
      {/* ================= PREMIUM HEADER ================= */}
      <div className="relative overflow-hidden p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border transition-all hover:shadow-primary/10 bg-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 md:w-80 md:h-80 bg-primary/10 blur-[80px] md:blur-[100px] rounded-full animate-pulse"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          <div className="space-y-2 md:space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 md:px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                Live Engine
              </span>
              <span className="px-2 md:px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                Verified Educator
              </span>
            </div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tight text-slate-900">
              Teacher <span className="text-primary">Console</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/teacher/exams"
              className="flex-1 md:flex-none"
            >
              <button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white h-12 md:h-14 rounded-xl md:rounded-2xl px-4 md:px-8 font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 group text-sm md:text-base">
                <LuPlus
                  size={20}
                  className="shrink-0 transition-transform group-hover:rotate-90"
                />
                <span className="whitespace-nowrap">Create New Exam</span>
              </button>
            </Link>

            <button
              title="Logout"
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95 shrink-0"
            >
              <LuLogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}
              >
                {React.cloneElement(stat.icon, { size: 20 })}
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= MAIN CONTENT: EXAM CONTROL ================= */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            Active Exam Control
          </h3>
          <Link
            href={'/dashboard/teacher/exams/examlist'}
            className="text-[10px] md:text-xs font-bold text-primary hover:underline uppercase tracking-widest"
          >
            View All Exams
          </Link>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Exam Control Card */}
          <div className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 bg-white hover:border-primary/20 transition-all shadow-sm">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div className="space-y-3 w-full xl:w-2/3">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase">
                  Status: Running
                </span>
                <h4 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                  Advanced Mathematics - Midterm 2024
                </h4>
                <p className="text-xs md:text-sm text-slate-500 font-medium">
                  Started at 10:00 AM • 45 Students active
                </p>
              </div>

              <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
                  <LuSquare size={16} />{' '}
                  <span className="whitespace-nowrap">Stop Exam</span>
                </button>
                <button className="p-3.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary hover:text-white transition-all">
                  <LuSettings size={20} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
                <span>Time Remaining: 45m</span>
                <span>Submission: 28/45</span>
              </div>
              <div className="h-2.5 md:h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%] rounded-full shadow-lg shadow-primary/20 transition-all duration-1000"></div>
              </div>
            </div>
          </div>

          {/* Scheduled Exam */}
          <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0">
                  <LuCalendar size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm md:text-base">
                    Physics Final Quiz
                  </h5>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                    Oct 28 • 02:30 PM
                  </p>
                </div>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-primary/10 hover:opacity-90 transition-all">
                <LuPlay size={16} /> Publish Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM GRID: LEADERBOARD & INSIGHT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Real-time Leaderboard */}
        <div className="rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-sm relative overflow-hidden border bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full"></div>
          <div className="flex items-center gap-3 mb-8">
            <LuTrophy className="text-amber-400" size={22} />
            <h3 className="font-black text-lg text-slate-800 tracking-tight">
              Live Leaderboard
            </h3>
          </div>

          <div className="space-y-5 md:space-y-6">
            {[
              { name: 'Sabbir Ahmed', mark: '98', rank: '01' },
              { name: 'Nusrat Jahan', mark: '95', rank: '02' },
              { name: 'Arif Rayhan', mark: '92', rank: '03' },
            ].map((student, i) => (
              <div
                key={i}
                className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-300 w-4">
                    {student.rank}
                  </span>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                    {student.name}
                  </p>
                </div>
                <span className="text-[11px] font-black px-3 py-1 bg-slate-100 rounded-lg text-slate-600">
                  {student.mark}%
                </span>
              </div>
            ))}
            <button className="w-full py-4 mt-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]">
              View Full Results
            </button>
          </div>
        </div>

        {/* Growth Insight */}
        <div className="bg-primary p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] text-white shadow-xl relative group overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <LuLightbulb
              size={32}
              className="mb-4 group-hover:animate-bounce transition-all opacity-90"
            />
            <h4 className="text-xl md:text-2xl font-black leading-tight">
              Exam Insight
            </h4>
            <p className="text-sm text-white/80 font-medium mt-3 leading-relaxed max-w-xs">
              Your &#39;Advanced Math&#39; exam shows a 15% improvement in
              average score compared to last month.
            </p>
          </div>
          <button className="relative z-10 w-full py-4 mt-8 bg-white text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
            Verify Results
          </button>
          <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full"></div>
        </div>
      </div>

      {/* ================= RECENT ACTIVITY FEED ================= */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-inner shrink-0">
            <LuClock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">
              System Logs
            </h3>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Real-time Notifications
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white transition-all group gap-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] shrink-0"></div>
              <p className="text-xs md:text-sm font-bold text-slate-700">
                New submission:{' '}
                <span className="text-primary italic">Farhana Islam</span>{' '}
                completed Math Midterm
              </p>
            </div>
            <span className="text-[9px] font-black text-slate-400 sm:ml-auto">
              2 MINUTES AGO
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-50/50 gap-2 opacity-80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
              <p className="text-xs md:text-sm font-bold text-slate-700">
                Exam Reminder:{' '}
                <span className="text-slate-500 italic">Physics Final</span>{' '}
                starts in 4 hours
              </p>
            </div>
            <span className="text-[9px] font-black text-slate-400 sm:ml-auto">
              1 HOUR AGO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}