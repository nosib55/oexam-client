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
      label: 'Active',
      value: examsData.filter(e => e.status === 'Active').length,
      icon: <FaCalendarAlt />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Draft',
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
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-4 lg:p-0">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl transition-all">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              Exam Controller
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
              Manage <span className="text-primary">Exams</span>
            </h1>
          </div>
          <Link href={'/dashboard/teacher/exams/create'} className="bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 group">
            <FaPlus className="transition-transform group-hover:rotate-90" />
            <span>Create New Exam</span>
          </Link>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <div
                className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}
              >
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Exam Title..."
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
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

          <select
            className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* ================= EXAMS TABLE ================= */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Exam Info
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subject
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Metrics
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Scheduled
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredExams.map(exam => (
                <tr
                  key={exam.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                      {exam.title}
                    </p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      ID: #{exam.id}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {exam.subject}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">
                        {exam.duration} mins
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {exam.totalMarks} Marks
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-slate-500">
                      {exam.date}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        exam.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : exam.status === 'Draft'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <FaEye size={14} />
                      </button>
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-all">
                        <FaEdit size={14} />
                      </button>
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
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
          <div className="py-20 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              No exams matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
