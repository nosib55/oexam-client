'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaBookOpen,
  FaCheckCircle,
  FaLayerGroup,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]); // Real Data State
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    subject: 'All',
    type: 'All',
    difficulty: 'All',
  });

  // ================= FETCH REAL DATA =================
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id || user?.id;
        // console.log(userId);
        const res = await axios.get(`/api/teacher/questions?userId=${userId}`);
        setQuestions(res.data);
      } catch (error) {
        console.error('Fetch Error:', error);
        toast.error('Failed to load questions from database');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // ================= DELETE FUNCTION =================
  const handleDelete = async id => {
    // Show SweetAlert2 Confirmation Dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      border: 'none',
    });

    // If the user confirms, proceed with deletion
    if (result.isConfirmed) {
      const toastId = toast.loading('Deleting from database...');

      try {
        // API call to delete
        await axios.delete(`/api/teacher/questions/${id}`);

        // Update local state to remove the question
        setQuestions(prev => prev.filter(q => q._id !== id));

        // Show Success Message
        Swal.fire({
          title: 'Deleted!',
          text: 'Your question has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });

        toast.success('Question removed', { id: toastId });
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete. Try again.', { id: toastId });

        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong while deleting.',
          icon: 'error',
        });
      }
    }
  };

  //
  const subjects = ['All', ...new Set(questions.map(q => q.subject))];
  const types = ['All', ...new Set(questions.map(q => q.type))];
  const difficulties = ['All', ...new Set(questions.map(q => q.difficulty))];

  // filter
  const filteredQuestions = questions.filter(
    q =>
      (q.questionText || '')
        .toLowerCase()
        .includes(filters.title.toLowerCase()) &&
      (filters.subject === 'All' || q.subject === filters.subject) &&
      (filters.type === 'All' || q.type === filters.type) &&
      (filters.difficulty === 'All' || q.difficulty === filters.difficulty),
  );

  const stats = [
    {
      label: 'Total Bank',
      value: questions.length,
      icon: <FaBookOpen />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'MCQs',
      value: questions.filter(q => q.type === 'MCQ').length,
      icon: <FaCheckCircle />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Written',
      value: questions.filter(q => q.type === 'Written').length,
      icon: <FaLayerGroup />,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  const resetFilters = () => {
    setFilters({ title: '', subject: 'All', type: 'All', difficulty: 'All' });
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center font-black text-slate-300 animate-pulse tracking-[0.5em] uppercase">
        Connecting to Bank...
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-4 lg:p-0">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] bg-white border border-slate-100 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              Database Linked
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
              Question <span className="text-primary">Bank</span>
            </h1>
          </div>
          <Link
            href="/dashboard/teacher/questions/add"
            className="bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            <FaPlus className="transition-transform group-hover:rotate-90" />
            <span>Add New Question</span>
          </Link>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= FILTERS SECTION ================= */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
              value={filters.title}
              onChange={e => setFilters({ ...filters, title: e.target.value })}
            />
          </div>

          {[
            { label: 'Subject', key: 'subject', options: subjects },
            { label: 'Type', key: 'type', options: types },
            { label: 'Difficulty', key: 'difficulty', options: difficulties },
          ].map(filter => (
            <select
              key={filter.key}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-slate-600 cursor-pointer appearance-none transition-all"
              value={filters[filter.key]}
              onChange={e =>
                setFilters({ ...filters, [filter.key]: e.target.value })
              }
            >
              {filter.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt === 'All' ? `All ${filter.label}s` : opt}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* ================= DATA TABLE (REAL DATA) ================= */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  #
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Question Details
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Metadata
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Difficulty
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center pr-12">
                  Marks
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredQuestions.map((q, index) => (
                <tr
                  key={q._id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6 text-sm font-black text-slate-300">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors leading-tight mb-1">
                      {q.questionText}
                    </p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {q.subject}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                      {q.type}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-600'
                          : q.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center pr-12">
                    <span className="text-xs font-black text-slate-600">
                      {q.marks}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/dashboard/teacher/questions/edit/${q._id}`}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all"
                      >
                        <FaEdit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
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
        {filteredQuestions.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="text-4xl text-slate-200 uppercase font-black">
              Empty Bank
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              No matching questions found in database
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
