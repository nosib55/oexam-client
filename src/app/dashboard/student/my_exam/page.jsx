'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  LuBookOpen,
  LuCalendar,
  LuClock,
  LuSearch,
  LuPlay,
  LuCircleCheck,
  LuCircleAlert,
  LuSchool,
} from 'react-icons/lu';

const STATUS_CONFIG = {
  draft:      { label: 'Scheduled',  badge: 'bg-blue-100 text-blue-600',    bar: 'bg-blue-500' },
  published:  { label: 'Scheduled',  badge: 'bg-blue-100 text-blue-600',    bar: 'bg-blue-500' },
  running:    { label: 'Live Now',   badge: 'bg-emerald-100 text-emerald-600 animate-pulse', bar: 'bg-emerald-500' },
  completed:  { label: 'Completed',  badge: 'bg-slate-100 text-slate-500',   bar: 'bg-slate-400' },
  stopped:    { label: 'Ended',      badge: 'bg-red-100 text-red-500',       bar: 'bg-red-400' },
};

export default function MyExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [myClasses, setMyClasses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    const userId = user._id || user.id;
    fetchAll(userId);
  }, []);

  const fetchAll = async (userId) => {
    try {
      setLoading(true);
      const [examRes, classRes] = await Promise.allSettled([
        axios.get(`/api/student/exams?userId=${userId}`),
        axios.get(`/api/student/class-join?userId=${userId}`),
      ]);

      if (examRes.status === 'fulfilled') setExams(examRes.value.data || []);
      if (classRes.status === 'fulfilled') {
        const confirmed = classRes.value.data.filter(r => r.status === 'confirmed').map(r => r.classId);
        setMyClasses(confirmed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = exams.filter(e => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) ||
                        e.subject?.toLowerCase().includes(search.toLowerCase());
    
    // If student has already submitted, it ALWAYS goes to completed tab
    if (e.isSubmitted) {
       return filter === 'completed' && matchSearch;
    }

    if (filter === 'upcoming') return matchSearch && ['draft', 'published', 'running'].includes(e.status);
    if (filter === 'completed') return matchSearch && ['completed', 'stopped'].includes(e.status);
    return matchSearch;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              My <span className="text-primary">Exams</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              {myClasses.length > 0 
                ? `Showing exams for ${myClasses.map(c => c.level).join(', ')}` 
                : 'Join a class to see your assigned exams'}
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exams..."
              className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {['all', 'upcoming', 'completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all capitalize ${
              filter === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Exams list */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : myClasses.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
          <LuSchool size={48} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-400">Not enrolled in any class</h2>
          <p className="text-slate-300 font-bold mt-2 mb-8">Join a class first to access your assigned exams.</p>
          <Link href="/dashboard/student/my_class">
            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              Browse Classes
            </button>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
          <LuBookOpen size={48} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-400">No exams found</h2>
          <p className="text-slate-300 font-bold mt-2">Your teacher hasn't published any exams yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(exam => {
            const s = STATUS_CONFIG[exam.status] || STATUS_CONFIG.published;
            const isDone = ['completed', 'stopped'].includes(exam.status) || exam.isSubmitted;
            const isLive = exam.status === 'running' && !exam.isSubmitted;
            return (
              <div key={exam._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col">
                <div className={`h-1.5 w-full ${s.bar}`}></div>
                <div className="p-8 flex flex-col flex-1 gap-6">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-lg w-fit">
                        {exam.subject}
                      </span>
                      {exam.classId && (
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <LuSchool size={10} /> {exam.classId.name} ({exam.classId.level})
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${s.badge}`}>
                      {s.label}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-800 group-hover:text-primary transition-colors leading-tight">
                      {exam.title}
                    </h2>
                  </div>

                  <div className="space-y-2.5 text-sm flex-1">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="flex items-center gap-2 text-slate-400 font-bold"><LuCalendar size={14} /> Date</span>
                      <span className="font-black text-slate-700">
                        {exam.scheduledAt ? new Date(exam.scheduledAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="flex items-center gap-2 text-slate-400 font-bold"><LuClock size={14} /> Duration</span>
                      <span className="font-black text-slate-700">{exam.duration} mins</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="flex items-center gap-2 text-slate-400 font-bold"><LuBookOpen size={14} /> Total Marks</span>
                      <span className="font-black text-slate-700">{exam.totalMarks}</span>
                    </div>
                  </div>

                  <div>
                    {isDone ? (
                      <Link href="/dashboard/student/my_result">
                        <button className="w-full py-4 rounded-2xl font-black text-sm bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                          <LuCircleCheck size={16} /> View Result
                        </button>
                      </Link>
                    ) : isLive ? (
                      <Link href={`/dashboard/student/my_exam/${exam._id}`} className="w-full block">
                        <button className="w-full py-4 rounded-2xl font-black text-sm bg-emerald-500 text-white shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 animate-pulse hover:bg-emerald-600 transition-all">
                          <LuPlay size={16} /> Enter Exam Now
                        </button>
                      </Link>
                    ) : (
                      <button className="w-full py-4 rounded-2xl font-black text-sm bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2">
                        <LuCircleAlert size={16} /> Not Started Yet
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
