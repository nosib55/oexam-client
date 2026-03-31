'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LuBookOpen,
  LuLogOut,
  LuCheck,
  LuClock,
  LuCalendar,
  LuPlay,
  LuTrophy,
  LuSchool,
  LuLightbulb,
  LuUser,
  LuMail,
  LuBuilding2,
} from 'react-icons/lu';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalExams: 0, passed: 0, avgScore: 0, upcoming: 0 });
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    const localUser = JSON.parse(stored);
    setUser(localUser);
    fetchFreshUser(localUser);
  }, []);

  // Fetch latest user info from /api/auth/me and merge
  const fetchFreshUser = async (localUser) => {
    try {
      const res = await axios.get('/api/auth/me');
      const freshUser = res.data;
      // Merge and update localStorage
      const merged = { ...localUser, ...freshUser, _id: freshUser._id || localUser._id || localUser.id, id: freshUser._id || localUser._id || localUser.id };
      setUser(merged);
      localStorage.setItem('user', JSON.stringify(merged));
      fetchDashboard(merged);
    } catch {
      // If /me fails (cookie expired etc.), use localStorage data
      fetchDashboard(localUser);
    }
  };

  const fetchDashboard = async (u) => {
    try {
      const userId = u?._id || u?.id;
      if (!userId) return;

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [classRes, examsRes] = await Promise.allSettled([
        axios.get(`/api/student/class-join?userId=${userId}`),
        axios.get(`/api/student/exams?userId=${userId}`),
      ]);

      if (classRes.status === 'fulfilled') {
        const confirmed = classRes.value.data.filter(r => r.status === 'confirmed').map(r => r.classId);
        setMyClasses(confirmed);
      }

      if (examsRes.status === 'fulfilled') {
        const all = examsRes.value.data || [];
        const now = new Date();
        const upcoming = all.filter(e => new Date(e.scheduledAt) > now);
        setUpcomingExams(upcoming.slice(0, 3));
        setStats(prev => ({ ...prev, totalExams: all.length, upcoming: upcoming.length }));
      }

      try {
        const resRes = await axios.get('/api/student/results', { headers });
        const results = resRes.data || [];
        setRecentResults(results.slice(0, 3));
        if (results.length > 0) {
          const passed = results.filter(r => parseFloat(r.percentage) >= 40).length;
          const avg = (results.reduce((a, r) => a + parseFloat(r.percentage), 0) / results.length).toFixed(0);
          setStats(prev => ({ ...prev, passed, avgScore: avg }));
        }
      } catch (_) { }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.clear();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Fallback: still clear local storage and redirect
      localStorage.clear();
      router.push('/auth/login');
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const statCards = [
    { label: 'Total Exams', value: stats.totalExams, icon: <LuBookOpen />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Exams Passed', value: stats.passed, icon: <LuCheck />, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Average Score', value: stats.avgScore > 0 ? `${stats.avgScore}%` : '—', icon: <LuTrophy />, color: 'text-amber-600 bg-amber-50' },
    { label: 'Upcoming', value: stats.upcoming, icon: <LuClock />, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 pb-10 p-4 lg:p-6">

      {/* HEADER */}
      <div className="relative overflow-hidden p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border bg-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {user?.image ? (
                <img src={user.image} alt={user?.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-lg border-2 border-primary/20" />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-lg">
                  {getInitials(user?.name)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>

            {/* Name & Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">Student Portal</span>
                {myClasses.length > 0 && (
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <LuSchool size={10} /> {myClasses[0].level} {myClasses.length > 1 ? `(+${myClasses.length - 1} more)` : ''}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                Welcome, <span className="text-primary">{user?.name || 'Student'}!</span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-1">
                {user?.email && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <LuMail size={12} className="text-primary" /> {user.email}
                  </span>
                )}
                {user?.institution && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <LuBuilding2 size={12} className="text-primary" /> {user.institution}
                  </span>
                )}
                {(user?.userClass || (myClasses.length > 0 && myClasses[0].level)) && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <LuUser size={12} className="text-primary" /> {user?.userClass || myClasses[0].level}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/student/my_exam">
              <button className="bg-primary hover:bg-primary/90 text-white h-12 md:h-14 rounded-2xl px-6 font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
                <LuPlay size={18} /> Take Exam
              </button>
            </Link>
            <button onClick={handleLogout} title="Logout" className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
              <LuLogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map(s => (
          <div key={s.label} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 md:p-4 rounded-2xl ${s.color} group-hover:scale-110 transition-transform`}>
                {React.cloneElement(s.icon, { size: 20 })}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{s.label}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">
              {loading ? <span className="animate-pulse text-slate-200">—</span> : s.value}
            </h2>
          </div>
        ))}
      </div>

      {/* UPCOMING EXAMS */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            Upcoming Exams
          </h3>
          <Link href="/dashboard/student/my_exam" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View All</Link>
        </div>

        <div className="p-6 md:p-8 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : upcomingExams.length === 0 ? (
            <div className="text-center py-12">
              <LuCalendar size={40} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-black">No upcoming exams scheduled</p>
              {myClasses.length === 0 && <p className="text-slate-300 text-sm mt-1">Join a class to see your exams</p>}
            </div>
          ) : (
            upcomingExams.map(exam => (
              <div key={exam._id} className="p-5 md:p-6 rounded-[1.5rem] border border-slate-100 bg-white hover:border-primary/20 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">{exam.status}</span>
                  <h4 className="text-lg font-black text-slate-800">{exam.title}</h4>
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-2">
                    <LuCalendar size={12} />
                    {exam.scheduledAt ? new Date(exam.scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'}
                    &nbsp;•&nbsp;<LuClock size={12} /> {exam.duration} min
                  </p>
                </div>
                <Link href="/dashboard/student/my_exam">
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all whitespace-nowrap">
                    <LuPlay size={14} /> Enter Exam
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RESULTS + INSIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <LuTrophy className="text-amber-400" size={22} />
            <h3 className="font-black text-lg text-slate-800">Recent Results</h3>
          </div>
          {recentResults.length === 0 ? (
            <p className="text-slate-300 font-bold text-center py-8">No results published yet</p>
          ) : (
            <div className="space-y-4">
              {recentResults.map(r => (
                <div key={r._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-primary/5 transition-all">
                  <div>
                    <p className="font-black text-slate-700 group-hover:text-primary transition-colors">{r.exam?.title || 'Exam'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{r.exam?.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-primary">{r.percentage}%</p>
                    <p className="text-[10px] font-bold text-slate-400">Rank #{r.rank}</p>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/student/my_result">
                <button className="w-full py-3 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-primary/20 transition-all mt-2 active:scale-95">
                  View All Results
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="bg-primary p-6 md:p-8 rounded-[2.5rem] text-white shadow-xl relative group overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div className="relative z-10">
            <LuLightbulb size={36} className="mb-4 group-hover:animate-bounce opacity-90" />
            <h4 className="text-2xl font-black">Performance Insight</h4>
            <p className="text-sm text-white/80 font-medium mt-3 leading-relaxed">
              {stats.avgScore > 0
                ? stats.avgScore >= 80
                  ? `Your average is ${stats.avgScore}%. Excellent work, ${(user?.name || '').split(' ')[0]}! Keep pushing.`
                  : stats.avgScore >= 60
                    ? `Your average is ${stats.avgScore}%. Good progress! Focus on your weaker subjects.`
                    : `Your average is ${stats.avgScore}%. You need improvement. Revise your weak areas.`
                : `Your performance data will appear here after you complete your first exam. Good luck!`
              }
            </p>
          </div>
          <Link href="/dashboard/student/my_result">
            <button className="relative z-10 w-full py-4 mt-8 bg-white text-primary rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              View Full Analytics
            </button>
          </Link>
          <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
