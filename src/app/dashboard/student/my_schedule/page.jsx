'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LuCalendar,
  LuClock,
  LuBookOpen,
  LuSchool,
  LuCircleAlert,
} from 'react-icons/lu';

const STATUS_CONFIG = {
  published:  { label: 'Scheduled',  bg: 'bg-blue-50',    text: 'text-blue-600',    bar: 'bg-blue-500' },
  running:    { label: 'Live Now',   bg: 'bg-emerald-50', text: 'text-emerald-600 animate-pulse', bar: 'bg-emerald-500' },
  completed:  { label: 'Completed',  bg: 'bg-slate-50',   text: 'text-slate-500',   bar: 'bg-slate-300' },
  stopped:    { label: 'Ended',      bg: 'bg-red-50',     text: 'text-red-500',     bar: 'bg-red-400' },
  draft:      { label: 'Draft',      bg: 'bg-slate-50',   text: 'text-slate-400',   bar: 'bg-slate-200' },
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function MySchedule() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myClass, setMyClass] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'weekly'

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    const userId = user._id || user.id;
    fetchData(userId);
  }, []);

  const fetchData = async (userId) => {
    try {
      const [examRes, classRes] = await Promise.allSettled([
        axios.get(`/api/student/exams?userId=${userId}`),
        axios.get(`/api/student/class-join?userId=${userId}`),
      ]);
      if (examRes.status === 'fulfilled') {
        // Only show scheduled/upcoming
        const upcoming = examRes.value.data.filter(e =>
          ['published', 'running'].includes(e.status)
        );
        setExams(upcoming);
      }
      if (classRes.status === 'fulfilled') {
        const confirmed = classRes.value.data.find(r => r.status === 'confirmed');
        if (confirmed) setMyClass(confirmed.classId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Exam <span className="text-primary">Schedule</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              {myClass
                ? `Upcoming exams for ${myClass.level} · ${myClass.institution}`
                : 'Join a class to view your exam schedule'}
            </p>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            {['list', 'weekly'].map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all capitalize ${viewMode === m ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!myClass ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
          <LuSchool size={48} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-400">Not enrolled in a class</h2>
          <p className="text-slate-300 font-bold mt-2">Request to join a class to view your scheduled exams.</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
          <LuCalendar size={48} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-400">No upcoming exams</h2>
          <p className="text-slate-300 font-bold mt-2">Your teacher hasn't published any exams yet. Check back later.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="space-y-4">
          {exams.map((exam, i) => {
            const s = STATUS_CONFIG[exam.status] || STATUS_CONFIG.published;
            const date = exam.scheduledAt ? new Date(exam.scheduledAt) : null;
            return (
              <div key={exam._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${s.bar}`}></div>
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 ml-4">
                  <div className="flex items-center gap-6">
                    <div className="bg-primary/10 text-primary p-5 rounded-2xl text-center min-w-[72px]">
                      {date ? (
                        <>
                          <p className="text-xl font-black leading-none">{date.getDate()}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest mt-1">
                            {date.toLocaleString('en-US', { month: 'short' })}
                          </p>
                        </>
                      ) : (
                        <LuCircleAlert size={24} />
                      )}
                    </div>
                    <div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
                      <h3 className="text-xl font-black text-slate-800 mt-2">{exam.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <LuBookOpen size={12} className="text-primary" /> {exam.subject}
                        </span>
                        {date && (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <LuClock size={12} className="text-primary" />
                            {date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <LuClock size={12} className="text-primary" /> {exam.duration} mins
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-800">{exam.totalMarks}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Marks</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* WEEKLY VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
          {DAYS.map((day, di) => {
            const dayExams = exams.filter(e => {
              if (!e.scheduledAt) return false;
              return new Date(e.scheduledAt).getDay() === di;
            });
            return (
              <div key={day} className="flex flex-col gap-3">
                <div className={`p-3 rounded-2xl text-center ${di === new Date().getDay() ? 'bg-primary text-white shadow-lg' : 'bg-slate-100'}`}>
                  <span className={`font-black text-[10px] uppercase tracking-[0.15em] ${di === new Date().getDay() ? 'text-white' : 'text-slate-500'}`}>
                    {day.substring(0, 3)}
                  </span>
                </div>
                {dayExams.length > 0 ? (
                  dayExams.map(e => (
                    <div key={e._id} className="bg-white p-4 rounded-2xl border border-primary/20 shadow-sm hover:shadow-md transition-all">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">{e.subject}</p>
                      <p className="font-black text-slate-800 text-sm mt-1 leading-tight">{e.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">{e.duration} min</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 p-8 rounded-2xl flex items-center justify-center opacity-40">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">Free</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
