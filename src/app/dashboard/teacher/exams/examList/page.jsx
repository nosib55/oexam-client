'use client';
import React, { useState, useEffect } from 'react';
import {
  LuSearch,
  LuFilter,
  LuEllipsisVertical,
  LuUsers,
  LuCalendar,
  LuLoader,
} from 'react-icons/lu';
import axios from 'axios';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const res = await axios.get(
            `/api/teacher/exams?userId=${user._id || user.id}`,
          );
          setExams(res.data);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // search filtering
  const filteredExams = exams.filter(
    exam =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LuLoader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER & SEARCH ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Exam Repository ({exams.length})
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <LuFilter size={20} />
          </button>
        </div>
      </div>

      {/* ================= TABLE CONTAINER ================= */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm">
        {/* if there no exam */}
        {filteredExams.length === 0 && (
          <div className="p-20 text-center font-bold text-slate-400">
            No exams found. Create your first exam!
          </div>
        )}

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredExams.map(exam => (
            <div
              key={exam._id}
              className="p-6 space-y-4 active:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      exam.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {exam.status}
                  </span>
                  <h3 className="font-black text-slate-800 mt-2 leading-tight">
                    {exam.title}
                  </h3>
                </div>
                <button className="p-2 text-slate-400">
                  <LuEllipsisVertical />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <LuCalendar className="text-primary" />
                  {new Date(exam.scheduledAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <LuUsers className="text-primary" />
                  {exam.questions?.length || 0} Questions
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Exam Details</th>
                <th className="px-6 py-5">Subject</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Questions</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredExams.map(exam => (
                <tr
                  key={exam._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 group-hover:text-primary transition-colors">
                      {exam.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                      Scheduled: {new Date(exam.scheduledAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-black text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                      {exam.subject}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        exam.status === 'published'
                          ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500">
                    {exam.questions?.length || 0} Qs
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-primary border border-transparent hover:border-slate-100">
                      <LuEllipsisVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamList;
