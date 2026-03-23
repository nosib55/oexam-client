'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaSearch,
  FaDownload,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaFilter,
  FaPenNib,
  FaSpinner,
} from 'react-icons/fa';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('All');

  // 
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id || user?.id;
        const res = await axios.get(`/api/teacher/results?userId=${userId}`);
        setResults(res.data);
      } catch (error) {
        console.error('Fetch Error:', error);
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // 
  const filteredResults = results.filter(
    r =>
      (examFilter === 'All' || r.examName === examFilter) &&
      (r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        r.studentEmail?.toLowerCase().includes(search.toLowerCase())),
  );

  //
  const total = results.length;
  const pass = results.filter(r => r.status === 'Pass').length;
  const fail = results.filter(r => r.status === 'Fail').length;
  const average =
    total > 0
      ? Math.round(results.reduce((acc, r) => acc + (r.marks || 0), 0) / total)
      : 0;

  const stats = [
    {
      label: 'Total Submissions',
      value: total,
      icon: <FaUserGraduate />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Passed Students',
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

  const uniqueExams = ['All', ...new Set(results.map(r => r.examName))];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
          Calculating Results...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-4 lg:p-0">
      {/* HEADER */}
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
          <button
            onClick={() => window.print()}
            className="bg-primary text-white h-14 rounded-2xl px-8 font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            <FaDownload className="group-hover:translate-y-0.5 transition-transform" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
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

      {/* FILTERS */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or email..."
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

      {/* RESULTS TABLE */}
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
                  key={r._id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6 text-sm font-black text-slate-300 text-center">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-slate-700 leading-tight">
                      {r.studentName}
                    </p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {r.studentEmail}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                      {r.examName}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-700">
                        {r.marks}%
                      </span>
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                          r.grade === 'A+' || r.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-600'
                            : r.grade === 'F'
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-blue-100 text-blue-600'
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
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <Link
                        href={`/dashboard/teacher/results/review/${r._id}`}
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
      </div>
    </div>
  );
}
