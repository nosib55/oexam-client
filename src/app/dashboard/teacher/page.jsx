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
} from 'react-icons/lu';

export default function TeacherPage() {
  const stats = [
    {
      label: 'Live Exams',
      value: '3',
      icon: <LuCircleArrowRight size={22} />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Avg Pass Rate',
      value: '84%',
      icon: <LuTrendingUp size={22} />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Question Bank',
      value: '128',
      icon: <LuFolder size={22} />,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Active Students',
      value: '142',
      icon: <LuUsers size={22} />,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 lg:pb-10">

      {/* ================= PREMIUM HEADER ================= */}
      <div className="relative overflow-hidden bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-2xl border border-slate-800">
        
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          {/* Left */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-[0.2em]">
                System Dashboard
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                Pro Tier Educator
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Teacher <span className="text-primary">Console</span>
            </h1>

            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] opacity-60">
              Platform Management Engine
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-3">
              <p className="text-sm font-black text-white">Team-oexam</p>
              <p className="text-[10px] font-bold text-slate-500 italic">
                oexam@edu.com
              </p>
            </div>

            <Link href="/dashboard/teacher/exams">
              <button className="bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl px-8 font-black shadow-xl shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
                <LuPlus className="text-xl" /> New Exam
              </button>
            </Link>

            <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 border border-white/10 hover:bg-red-500/20 hover:text-red-400 transition-all">
              <LuLogOut size={22} />
            </button>
          </div>

        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Activity */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <button className="text-primary text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 flex justify-between items-center">
              <div>
                <p className="font-medium">Math Midterm Submitted</p>
                <p className="text-xs text-slate-500">
                  45 students completed • 2 hours ago
                </p>
              </div>
              <span className="badge badge-success">Completed</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 flex justify-between items-center">
              <div>
                <p className="font-medium">Physics Quiz Scheduled</p>
                <p className="text-xs text-slate-500">
                  Starts at 02:30 PM
                </p>
              </div>
              <span className="badge badge-warning">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="bg-gradient-to-br from-primary to-indigo-600 text-white p-8 rounded-3xl shadow-xl">
          <LuLightbulb size={28} className="mb-4" />
          <h4 className="text-xl font-bold">
            Your question bank grew by 20%
          </h4>
          <p className="text-sm opacity-80 mt-2">
            Keep adding quality questions to improve assessment accuracy.
          </p>
          <button className="mt-6 bg-white text-primary px-5 py-2 rounded-xl font-semibold text-sm">
            Analyze Performance
          </button>
        </div>
      </div>

      {/* ================= UPCOMING SCHEDULE ================= */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border">
        <div className="flex items-center gap-3 mb-6">
          <LuCalendar size={20} className="text-blue-500" />
          <h3 className="font-semibold text-lg">Upcoming Schedule</h3>
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
          <div>
            <p className="font-medium">Physics Quiz - Unit 3</p>
            <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <LuClock size={12} /> 02:30 PM
              </span>
              <span className="flex items-center gap-1">
                <LuUsers size={12} /> 45 Students
              </span>
            </p>
          </div>
          <span className="badge badge-info">Upcoming</span>
        </div>
      </div>

    </div>
  );
}