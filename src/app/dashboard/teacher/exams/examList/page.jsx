'use client';
import React, { useState, useEffect } from 'react';
import {
  LuSearch,
  LuFilter,
  LuUsers,
  LuCalendar,
  LuLoader,
  LuTrash2,
  LuPencil,
  LuEye,
} from 'react-icons/lu';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  //
  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const userId = user._id || user.id;

        //
        const [examsRes, questionsRes] = await Promise.all([
          axios.get(`/api/teacher/exams?userId=${userId}`),
          axios.get(`/api/teacher/questions?userId=${userId}`),
        ]);

        setExams(examsRes.data);
        setAllQuestions(questionsRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to sync repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //
  const getQuestionCountBySubject = subjectName => {
    if (!allQuestions || !subjectName) return 0;
    return allQuestions.filter(
      q => q.subject?.toLowerCase() === subjectName.toLowerCase(),
    ).length;
  };

  // ================= DELETE HANDLER =================
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Delete Exam?',
      text: 'This will permanently remove the exam record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const tid = toast.loading('Deleting exam...');
      try {
        await axios.delete(`/api/teacher/exams/${id}`);
        setExams(prev => prev.filter(e => e._id !== id));
        toast.success('Exam deleted', { id: tid });
      } catch (error) {
        toast.error('Failed to delete', { id: tid });
      }
    }
  };

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
        {filteredExams.length === 0 && (
          <div className="p-20 text-center font-bold text-slate-400">
            No exams found. Create your first exam!
          </div>
        )}

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredExams.map(exam => (
            <div key={exam._id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${exam.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {exam.status}
                  </span>
                  <h3 className="font-black text-slate-800 mt-2 leading-tight">
                    {exam.title}
                  </h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/teacher/exams/preview/${exam._id}`,
                      )
                    }
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <LuEye size={16} />
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/teacher/exams/edit/${exam._id}`)
                    }
                    className="p-2 text-blue-500 bg-blue-50 rounded-lg"
                  >
                    <LuPencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    className="p-2 text-rose-500 bg-rose-50 rounded-lg"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <LuCalendar className="text-primary" />
                  {new Date(exam.scheduledAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <LuUsers className="text-primary" />
                  {/*  */}
                  {getQuestionCountBySubject(exam.subject)} Questions
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
                <th className="px-6 py-5 text-center">Actions</th>
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
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${exam.status === 'published' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500">
                    {/* */}
                    {getQuestionCountBySubject(exam.subject)} Qs
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/teacher/exams/preview/${exam._id}`,
                          )
                        }
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <LuEye size={16} />
                      </button>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/teacher/exams/edit/${exam._id}`,
                          )
                        }
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                      >
                        <LuPencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                        <LuTrash2 size={16} />
                      </button>
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
};

export default ExamList;
