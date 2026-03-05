'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaFilter,
  FaTv,
} from 'react-icons/fa';

const examsData = [
  {
    id: 1,
    title: 'Mid Term Math Exam',
    subject: 'Mathematics',
    duration: 60,
    totalMarks: 100,
    status: 'Active',
    date: '2026-03-10',
  },
  {
    id: 2,
    title: 'Physics Final Test',
    subject: 'Physics',
    duration: 90,
    totalMarks: 100,
    status: 'Draft',
    date: '2026-03-15',
  },
  {
    id: 3,
    title: 'Chemistry Quiz',
    subject: 'Chemistry',
    duration: 45,
    totalMarks: 50,
    status: 'Completed',
    date: '2026-02-15',
  },
  {
    id: 4,
    title: 'English Grammar Test',
    subject: 'English',
    duration: 60,
    totalMarks: 75,
    status: 'Active',
    date: '2026-03-20',
  },
  {
    id: 5,
    title: 'ICT Practical Exam',
    subject: 'ICT',
    duration: 120,
    totalMarks: 100,
    status: 'Draft',
    date: '2026-04-01',
  },
];

export default function ExamsPage() {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredExams = examsData.filter(exam => {
    return (
      exam.title.toLowerCase().includes(search.toLowerCase()) &&
      (subjectFilter ? exam.subject === subjectFilter : true) &&
      (statusFilter ? exam.status === statusFilter : true)
    );
  });

  const stats = [
    {
      label: 'Total Exams',
      value: examsData.length,
      icon: <FaFileAlt />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Active Now',
      value: examsData.filter(e => e.status === 'Active').length,
      icon: <FaCalendarAlt />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Saved Draft',
      value: examsData.filter(e => e.status === 'Draft').length,
      icon: <FaEdit />,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Completed',
      value: examsData.filter(e => e.status === 'Completed').length,
      icon: <FaClock />,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 p-4 lg:p-0">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden p-8 md:p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              Academic Management
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
              Exam <span className="text-primary">Console</span>
            </h1>
          </div>
          <Link
            href={'/dashboard/teacher/exams/create'}
            className="bg-slate-900 hover:bg-primary text-white h-16 rounded-[2rem] px-10 font-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <FaPlus className="transition-transform group-hover:rotate-90 text-primary" />
            <span className="uppercase text-xs tracking-widest">
              Create New Exam
            </span>
          </Link>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex justify-between items-center mb-6">
              <div
                className={`p-4 rounded-2xl ${stat.color} transition-all group-hover:scale-110 shadow-inner`}
              >
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right w-1/2">
                {stat.label}
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= FILTERS & QUICK NAV ================= */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-[2]">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by exam title..."
              className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-slate-700 transition-all placeholder:text-slate-300"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="relative flex-1 group">
            <select
              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none font-black text-slate-500 text-[10px] uppercase tracking-widest appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all"
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
            >
              <option value="">All Subjects</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>English</option>
              <option>ICT</option>
            </select>
            <FaFilter
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-primary"
              size={12}
            />
          </div>

          <div className="relative flex-1 group">
            <select
              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none font-black text-slate-500 text-[10px] uppercase tracking-widest appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Completed</option>
            </select>
            <FaFilter
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-primary"
              size={12}
            />
          </div>
        </div>

        {/* Live Monitoring Quick Link */}
        <Link
          href="/dashboard/teacher/exams/monitor"
          className="xl:w-64 bg-rose-50 border border-rose-100 p-8 rounded-[3rem] flex flex-col items-center justify-center gap-3 hover:bg-rose-100 transition-all group overflow-hidden relative"
        >
          <div className="absolute top-2 right-6">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
          </div>
          <FaTv className="text-rose-600 text-3xl group-hover:scale-125 transition-transform" />
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">
            Live Monitoring
          </span>
        </Link>
      </div>

      {/* ================= EXAMS TABLE ================= */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-400">
                <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  Detailed Info
                </th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  Category
                </th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  Time & Marks
                </th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map(exam => (
                <tr
                  key={exam.id}
                  className="group hover:bg-slate-50/50 transition-all"
                >
                  <td className="px-8 py-6 bg-slate-50/30 group-hover:bg-white rounded-l-[2rem] border-y border-l border-transparent group-hover:border-slate-100 transition-all">
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors italic uppercase tracking-tighter">
                        {exam.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaCalendarAlt size={10} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">
                          Scheduled: {exam.date}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 bg-slate-50/30 group-hover:bg-white border-y border-transparent group-hover:border-slate-100 transition-all">
                    <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-4 py-2 rounded-xl uppercase tracking-widest">
                      {exam.subject}
                    </span>
                  </td>
                  <td className="px-6 py-6 bg-slate-50/30 group-hover:bg-white border-y border-transparent group-hover:border-slate-100 transition-all">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <FaClock size={12} className="text-slate-300" />
                        <span className="text-xs font-black text-slate-700">
                          {exam.duration}m
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {exam.totalMarks} Points
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 bg-slate-50/30 group-hover:bg-white border-y border-transparent group-hover:border-slate-100 transition-all">
                    <span
                      className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                        exam.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : exam.status === 'Draft'
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 bg-slate-50/30 group-hover:bg-white rounded-r-[2rem] border-y border-r border-transparent group-hover:border-slate-100 transition-all">
                    <div className="flex justify-center gap-3">
                      <button
                        className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-blue-600 hover:shadow-lg transition-all flex items-center justify-center border border-slate-100 active:scale-90 shadow-sm"
                        title="Preview"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-amber-600 hover:shadow-lg transition-all flex items-center justify-center border border-slate-100 active:scale-90 shadow-sm"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-rose-600 hover:shadow-lg transition-all flex items-center justify-center border border-slate-100 active:scale-90 shadow-sm"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExams.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
              <FaSearch className="text-slate-200" size={30} />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
              No matching exams found
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Link */}
      <div className="flex justify-center pt-8">
        <Link
          href={'/dashboard/teacher/exams/examList'}
          className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all"
        >
          <span className="w-12 h-[1px] bg-slate-200 group-hover:bg-primary transition-all"></span>
          View All Archives
          <span className="w-12 h-[1px] bg-slate-200 group-hover:bg-primary transition-all"></span>
        </Link>
      </div>
    </div>
  );
}
