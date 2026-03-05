import React from 'react';
import {
  LuSearch,
  LuFilter,
  LuEllipsisVertical,
  LuUsers,
  LuCalendar,
} from 'react-icons/lu';

const ExamList = () => {
  const exams = [
    {
      id: 1,
      title: 'Term Final Examination',
      subject: 'Physics',
      date: '20 Oct 2024',
      status: 'Upcoming',
      students: 45,
    },
    {
      id: 2,
      title: 'Weekly Quiz - 04',
      subject: 'Math',
      date: '15 Oct 2024',
      status: 'Live',
      students: 120,
    },
    {
      id: 3,
      title: 'Monthly Assessment',
      subject: 'Biology',
      date: '10 Oct 2024',
      status: 'Completed',
      students: 38,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= HEADER & SEARCH ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Exam Repository
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exams..."
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
        {/* Mobile View (Card Style) - Visible only on small screens */}
        <div className="block md:hidden divide-y divide-slate-100">
          {exams.map(exam => (
            <div
              key={exam.id}
              className="p-6 space-y-4 active:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      exam.status === 'Live'
                        ? 'bg-emerald-50 text-emerald-600'
                        : exam.status === 'Upcoming'
                          ? 'bg-blue-50 text-blue-600'
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
                  {exam.date}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <LuUsers className="text-primary" />
                  {exam.students} Students
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                  {exam.subject}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (Table Style) - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Exam Details</th>
                <th className="px-6 py-5">Subject</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Enrolled</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {exams.map(exam => (
                <tr
                  key={exam.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 group-hover:text-primary transition-colors">
                      {exam.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                      Scheduled: {exam.date}
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
                        exam.status === 'Live'
                          ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
                          : exam.status === 'Upcoming'
                            ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <LuUsers size={14} className="text-slate-300" />
                      {exam.students} Students
                    </div>
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
