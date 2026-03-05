'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaSearch,
  FaDownload,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaFilter,
  FaPenNib,
} from 'react-icons/fa';

const resultsData = [
  {
    id: 1,
    student: 'Ayesha Rahman',
    exam: 'Mid Term ICT',
    marks: 85,
    grade: 'A',
    status: 'Pass',
  },
  {
    id: 2,
    student: 'Rakib Hasan',
    exam: 'Mid Term ICT',
    marks: 42,
    grade: 'D',
    status: 'Fail',
  },
  {
    id: 3,
    student: 'Nusrat Jahan',
    exam: 'Final Math',
    marks: 76,
    grade: 'B',
    status: 'Pass',
  },
  {
    id: 4,
    student: 'Tanvir Ahmed',
    exam: 'Final Math',
    marks: 91,
    grade: 'A+',
    status: 'Pass',
  },
  {
    id: 5,
    student: 'Mim Akter',
    exam: 'Physics Test',
    marks: 58,
    grade: 'C',
    status: 'Pass',
  },
  {
    id: 6,
    student: 'Sabbir Hossain',
    exam: 'Physics Test',
    marks: 37,
    grade: 'F',
    status: 'Fail',
  },
  {
    id: 7,
    student: 'Farhana Islam',
    exam: 'Mid Term ICT',
    marks: 88,
    grade: 'A',
    status: 'Pass',
  },
  {
    id: 8,
    student: 'Jahidul Islam',
    exam: 'Final Math',
    marks: 64,
    grade: 'B',
    status: 'Pass',
  },
  {
    id: 9,
    student: 'Tania Sultana',
    exam: 'Physics Test',
    marks: 73,
    grade: 'B',
    status: 'Pass',
  },
  {
    id: 10,
    student: 'Imran Khan',
    exam: 'Mid Term ICT',
    marks: 49,
    grade: 'D',
    status: 'Fail',
  },
];

export default function ResultsPage() {
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('All');

  const filteredResults = resultsData.filter(
    r =>
      (examFilter === 'All' || r.exam === examFilter) &&
      r.student.toLowerCase().includes(search.toLowerCase()),
  );

  const total = resultsData.length;
  const pass = resultsData.filter(r => r.status === 'Pass').length;
  const fail = resultsData.filter(r => r.status === 'Fail').length;
  const average = Math.round(
    resultsData.reduce((acc, r) => acc + r.marks, 0) / total,
  );

  const stats = [
    {
      label: 'Total Submissions',
      value: total,
      icon: <FaUserGraduate />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Success Rate',
      value: pass,
      icon: <FaCheckCircle />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Failed Cases',
      value: fail,
      icon: <FaTimesCircle />,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      label: 'Class Average',
      value: `${average}%`,
      icon: <FaChartLine />,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  const uniqueExams = ['All', ...new Set(resultsData.map(r => r.exam))];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-4 lg:p-0">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl transition-all">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              Academic Performance
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
              Results & <span className="text-primary">Grading</span>
            </h1>
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-2xl px-8 font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group">
            <FaDownload className="group-hover:translate-y-0.5 transition-transform" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
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
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student results..."
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="relative md:w-1/4">
          <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <select
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
            value={examFilter}
            onChange={e => setExamFilter(e.target.value)}
          >
            {uniqueExams.map((exam, index) => (
              <option key={index} value={exam}>
                {exam === 'All' ? 'All Exams' : exam}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= RESULTS TABLE ================= */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  #
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student Information
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Exam Name
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Score & Grade
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Result
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredResults.map((r, index) => (
                <tr
                  key={r.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6 text-sm font-black text-slate-300 text-center">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-slate-700 leading-tight">
                      {r.student}
                    </p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      ID: #{r.id}00{r.id}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                      {r.exam}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-700">
                        {r.marks}%
                      </span>
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                          r.grade.includes('A')
                            ? 'bg-emerald-100 text-emerald-600'
                            : r.grade === 'B'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        {r.grade}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        r.status === 'Pass'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${r.status === 'Pass' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      ></span>
                      {r.status}
                    </span>
                  </td>
                  {/* Table Body */}
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <Link
                        href={`/dashboard/teacher/script-check`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                      >
                        <FaPenNib size={12} />
                        <span>Review Script</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="text-4xl">📊</div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              No matching results found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
