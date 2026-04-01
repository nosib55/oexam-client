'use client';
import Link from 'next/link';
import axios from 'axios';
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
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        const userId = storedUser._id || storedUser.id;
        const res = await axios.get(`/api/teacher/stats?userId=${userId}`);
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dynamicStats = [
    {
      label: 'Active Exams',
      value: data?.stats?.activeExams || '00',
      icon: <LuCircleArrowRight />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Avg Pass Rate',
      value: data?.stats?.avgPassRate || '—',
      icon: <LuTrendingUp />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Question Bank',
      value: data?.stats?.questionBank || '00',
      icon: <LuFolder />,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Total Students',
      value: data?.stats?.totalStudents || '00',
      icon: <LuUsers />,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
    </div>
  );

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
              href="/dashboard/teacher/exams/new"
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
              onClick={() => {
                localStorage.clear();
                window.location.href = '/auth/login';
              }}
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95 shrink-0"
            >
              <LuLogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {dynamicStats.map(stat => (
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
            href={'/dashboard/teacher/exams'}
            className="text-[10px] md:text-xs font-bold text-primary hover:underline uppercase tracking-widest"
          >
            View All Exams
          </Link>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {data?.runningExam ? (
            <div className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 bg-white hover:border-primary/20 transition-all shadow-sm">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="space-y-3 w-full xl:w-2/3">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase">
                    Status: Running
                  </span>
                  <h4 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                    {data.runningExam.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 font-medium italic">
                    Currently ongoing assessment hall
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                  <Link href={`/dashboard/teacher/exams/monitor/${data.runningExam._id}`} className="flex-1 xl:flex-none">
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 shadow-xl shadow-slate-200">
                      Monitor Live
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-[2rem] bg-slate-50 border border-dashed border-slate-200">
              <LuCalendar size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No exams currently running</p>
              <Link href="/dashboard/teacher/exams/new">
                <button className="mt-4 text-xs font-black text-primary uppercase hover:underline">Start an Assessment</button>
              </Link>
            </div>
          )}
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
              Top Student Performers
            </h3>
          </div>

          <div className="space-y-5 md:space-y-6">
            {data?.leaderboard && data.leaderboard.length > 0 ? data.leaderboard.map((student, i) => (
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
            )) : (
              <p className="text-xs text-slate-300 text-center py-10">No scores recorded yet</p>
            )}
            <Link href="/dashboard/teacher/results" className="block">
              <button className="w-full py-4 mt-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]">
                View Full Results
              </button>
            </Link>
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
              Teacher Statistics
            </h4>
            <p className="text-sm text-white/80 font-medium mt-3 leading-relaxed max-w-xs">
              Ensure all results are verified in the review center to keep student leaderboards up-to-date.
            </p>
          </div>
          <Link href="/dashboard/teacher/results">
            <button className="relative z-10 w-full py-4 mt-8 bg-white text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Verify Results
            </button>
          </Link>
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
              Submission Activity
            </h3>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Latest Result Events
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data?.recentSubmissions && data.recentSubmissions.length > 0 ? data.recentSubmissions.map((sub, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white transition-all group gap-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] shrink-0"></div>
                <p className="text-xs md:text-sm font-bold text-slate-700">
                  New submission: <span className="text-primary italic">{sub.studentName}</span> completed {sub.examTitle}
                </p>
              </div>
              <span className="text-[9px] font-black text-slate-400 sm:ml-auto uppercase">
                {new Date(sub.time).toLocaleTimeString()}
              </span>
            </div>
          )) : (
            <p className="text-xs text-slate-300 text-center py-6 border border-dashed rounded-[1.5rem]">No recent activity logs</p>
          )}
        </div>
      </div>
    </div>
  );
}