'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCalendarAlt,
  FaFileAlt,
  FaFilter,
  FaSpinner,
  FaLayerGroup,
} from 'react-icons/fa';

export default function ExamsPage() {
  const [examsData, setExamsData] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch all data (Exams and Questions)
  const fetchData = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        const userId = storedUser._id || storedUser.id;

        // 
        const [examsRes, questionsRes] = await Promise.all([
          axios.get(`/api/teacher/exams?userId=${userId}`),
          axios.get(`/api/teacher/questions?userId=${userId}`),
        ]);

        setExamsData(examsRes.data);
        setAllQuestions(questionsRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  //
  const getQuestionCountBySubject = (questions, subjectName) => {
    if (!questions || !subjectName) return 0;
    const filtered = questions.filter(
      q => q.subject?.toLowerCase() === subjectName.toLowerCase(),
    );
    return filtered.length;
  };

  // ================= DELETE HANDLER =================
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#F43F5E',
      confirmButtonText: 'Yes, delete it!',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[2rem] font-bold',
        confirmButton: 'rounded-xl px-6 py-3',
        cancelButton: 'rounded-xl px-6 py-3',
      },
    });

    if (result.isConfirmed) {
      const toastId = toast.loading('Deleting exam...');
      try {
        await axios.delete(`/api/teacher/exams/${id}`);
        setExamsData(prev => prev.filter(exam => exam._id !== id));
        toast.success('Exam removed from archive', { id: toastId });

        Swal.fire({
          title: 'Deleted!',
          text: 'The exam has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[2rem]' },
        });
      } catch (error) {
        toast.error('Deletion failed!', { id: toastId });
      }
    }
  };

  // Dynamic Filtering Logic
  const filteredExams = examsData.filter(exam => {
    const title = exam.title || exam.examName || '';
    return (
      title.toLowerCase().includes(search.toLowerCase()) &&
      (subjectFilter ? exam.subject === subjectFilter : true) &&
      (statusFilter ? exam.status === statusFilter : true)
    );
  });

  // Unique subjects for filter
  const uniqueSubjects = [
    ...new Set(examsData.map(exam => exam.subject)),
  ].filter(Boolean);

  // Calculate Stats Dynamically
  const stats = [
    {
      label: 'Total Exams',
      value: examsData.length,
      icon: <FaFileAlt />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Published',
      value: examsData.filter(e => e.status?.toLowerCase() === 'published')
        .length,
      icon: <FaCalendarAlt />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Saved Draft',
      value: examsData.filter(e => e.status?.toLowerCase() === 'draft').length,
      icon: <FaEdit />,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Questions Set',
      value: allQuestions.length,
      icon: <FaLayerGroup />,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
          Loading Console...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 p-4 lg:p-0">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden p-8 md:p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
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
            className="bg-primary text-white h-16 rounded-2xl px-5 font-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <FaPlus className="transition-transform group-hover:rotate-90" />
            <span className="uppercase text-xs tracking-widest">
              Create New Exam
            </span>
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
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

      {/* FILTERS */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-[2]">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
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
              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none font-black text-slate-500 text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            <FaFilter
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              size={12}
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC EXAMS TABLE */}
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
                  Questions
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
                  key={exam._id}
                  className="group hover:bg-slate-50/50 transition-all"
                >
                  <td className="px-8 py-6 bg-slate-50/30 group-hover:bg-white rounded-l-[2rem] border-y border-l border-transparent group-hover:border-slate-100 transition-all">
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors italic uppercase tracking-tighter">
                        {exam.title || exam.examName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaCalendarAlt size={10} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">
                          {exam.scheduledAt
                            ? new Date(exam.scheduledAt).toLocaleDateString()
                            : 'No date set'}
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
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700">
                        {getQuestionCountBySubject(allQuestions, exam.subject)}{' '}
                        Items
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        {exam.duration || 0} mins
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 bg-slate-50/30 group-hover:bg-white border-y border-transparent group-hover:border-slate-100 transition-all">
                    <span
                      className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                        exam.status?.toLowerCase() === 'published'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 bg-slate-50/30 group-hover:bg-white rounded-r-[2rem] border-y border-r border-transparent group-hover:border-slate-100 transition-all">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/dashboard/teacher/exams/preview/${exam._id}`}
                        className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-blue-600 hover:shadow-lg transition-all flex items-center justify-center border border-slate-100"
                      >
                        <FaEye size={14} />
                      </Link>
                      <Link
                        href={`/dashboard/teacher/exams/edit/${exam._id}`}
                        className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-amber-600 hover:shadow-lg transition-all flex items-center justify-center border border-slate-100"
                      >
                        <FaEdit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-rose-600 hover:shadow-lg transition-all flex items-center justify-center border border-slate-100"
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
      </div>

      {/* FOOTER NAV */}
      <div className="flex justify-center pt-4">
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
