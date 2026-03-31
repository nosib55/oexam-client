'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
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
  FaSpinner,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch data from API
  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/teacher/students');
      setStudents(res.data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete Handler
  const handleDelete = async id => {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true, 
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold',
      },
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/api/teacher/students/${id}`);

          if (res.status === 200) {
            setStudents(prev => prev.filter(student => student._id !== id));
            Swal.fire({
              title: 'Deleted!',
              text: 'Student has been removed.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: 'rounded-[2rem]',
              },
            });
          }
        } catch (error) {
          console.error('Delete Error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete student.',
            icon: 'error',
            customClass: {
              popup: 'rounded-[2rem]',
            },
          });
        }
      }
    });
  };
  
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`/api/teacher/students/${id}`, {
        status: newStatus,
      });
      if (res.status === 200) {
        setStudents(prev =>
          prev.map(student =>
            student._id === id ? { ...student, status: newStatus } : student,
          ),
        );
        toast.success(`Student status marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Filter Logic
  const filteredStudents = students.filter(
    student =>
      student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()),
  );

  // Stats Calculation
  const stats = [
    {
      label: 'Total Students',
      value: students.length,
      icon: <FaGraduationCap />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Active',
      value: students.filter(s => s.status === 'Active' || !s.status).length, // Defaulting to active
      icon: <FaUserCheck />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Pending',
      value: students.filter(s => s.status === 'Pending').length,
      icon: <FaUserClock />,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-4 lg:p-0">
      {/* HEADER */}
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
          <Link
            href="/dashboard/teacher/students/add"
            className="bg-primary text-white h-14 rounded-2xl px-8 font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 group transition-all"
          >
            <FaUserPlus className="transition-transform group-hover:scale-110" />
            <span>Add New Student</span>
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
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

      {/* SEARCH */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or email..."
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

      {/* STUDENTS TABLE */}
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
                  key={student._id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6 text-sm font-black text-slate-300">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      {student.profilePicture ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-100 shadow-sm">
                          <img
                            src={student.profilePicture}
                            alt={student.fullName}
                            className="w-full h-full object-cover"
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          {/* Fallback Avatar (Hidden by default) */}
                          <div
                            style={{ display: 'none' }}
                            className="w-full h-full bg-slate-100 items-center justify-center font-bold text-primary"
                          >
                            {student.fullName.charAt(0)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          {student.fullName.charAt(0)}
                        </div>
                      )}

                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-700 leading-tight">
                          {student.fullName}
                        </p>
                        <span className="text-[10px] flex items-center gap-1 font-medium text-slate-400">
                          <FaEnvelope className="text-[8px]" /> {student.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="px-4 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-black">
                      {student.className}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        student.status === 'active' || !student.status
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {student.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      {/*  */}
                      {student.status === 'pending' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(student._id, 'active')
                          }
                          className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Approve Student"
                        >
                          <FaUserCheck size={14} />
                        </button>
                      )}

                      {/* if active you can switch it panding */}
                      {student.status === 'active' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(student._id, 'pending')
                          }
                          className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                          title="Move to Pending"
                        >
                          <FaUserClock size={14} />
                        </button>
                      )}
                      <Link
                        href={`/dashboard/teacher/students/edit/${student._id}`}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <FaEdit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
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
