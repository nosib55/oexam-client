'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaGraduationCap,
  FaUserCheck,
  FaUserClock,
  FaEnvelope,
  FaLayerGroup,
} from 'react-icons/fa';

const studentsData = [
  {
    id: 1,
    name: 'Ayesha Rahman',
    email: 'ayesha@example.com',
    class: '10',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Rakib Hasan',
    email: 'rakib@example.com',
    class: '9',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Nusrat Jahan',
    email: 'nusrat@example.com',
    class: '8',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Tanvir Ahmed',
    email: 'tanvir@example.com',
    class: '10',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Mim Akter',
    email: 'mim@example.com',
    class: '7',
    status: 'Pending',
  },
  {
    id: 6,
    name: 'Sabbir Hossain',
    email: 'sabbir@example.com',
    class: '9',
    status: 'Active',
  },
  {
    id: 7,
    name: 'Farhana Islam',
    email: 'farhana@example.com',
    class: '8',
    status: 'Active',
  },
  {
    id: 8,
    name: 'Jahidul Islam',
    email: 'jahid@example.com',
    class: '10',
    status: 'Pending',
  },
  {
    id: 9,
    name: 'Tania Sultana',
    email: 'tania@example.com',
    class: '7',
    status: 'Active',
  },
  {
    id: 10,
    name: 'Imran Khan',
    email: 'imran@example.com',
    class: '9',
    status: 'Active',
  },
  {
    id: 11,
    name: 'Sadia Rahman',
    email: 'sadia@example.com',
    class: '8',
    status: 'Pending',
  },
  {
    id: 12,
    name: 'Hasibul Hasan',
    email: 'hasib@example.com',
    class: '10',
    status: 'Active',
  },
];

export default function StudentsPage() {
  const [search, setSearch] = useState('');

  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = [
    {
      label: 'Total Students',
      value: studentsData.length,
      icon: <FaGraduationCap />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Active',
      value: studentsData.filter(s => s.status === 'Active').length,
      icon: <FaUserCheck />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Pending',
      value: studentsData.filter(s => s.status === 'Pending').length,
      icon: <FaUserClock />,
      color: 'text-amber-600 bg-amber-50',
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
              Directory
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
              Student <span className="text-primary">Management</span>
            </h1>
          </div>
          <Link href={'/dashboard/teacher/students/add'} className="bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 group">
            <FaUserPlus className="transition-transform group-hover:scale-110" />
            <span>Add New Student</span>
          </Link>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= SEARCH & SEARCH ================= */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name..."
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-2xl text-slate-400 font-bold text-sm">
          <FaLayerGroup size={14} />
          <span>Filters</span>
        </div>
      </div>

      {/* ================= STUDENTS TABLE ================= */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  #
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student Details
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Class
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
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6 text-sm font-black text-slate-300">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-700 leading-tight">
                          {student.name}
                        </p>
                        <span className="text-[10px] flex items-center gap-1 font-medium text-slate-400">
                          <FaEnvelope className="text-[8px]" /> {student.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="px-4 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-black">
                      Class {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        student.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
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

        {filteredStudents.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="text-4xl">🔎</div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              No students found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
