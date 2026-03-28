'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  LuUsers,
  LuSchool,
  LuCircleCheck,
  LuCircleX,
  LuTrash2,
  LuClock,
  LuHash,
} from 'react-icons/lu';

const STATUS_BADGE = {
  pending:   'bg-amber-50 text-amber-600 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  rejected:  'bg-red-50 text-red-500 border-red-200',
};

export default function TeacherClassRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id || user?.id;
      const res = await axios.get(`/api/teacher/classes/requests?userId=${userId}`);
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      if (action === 'delete') {
        const confirm = await Swal.fire({
          title: 'Delete Request?',
          text: 'This action cannot be undone.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Delete',
          confirmButtonColor: '#ef4444',
        });
        if (!confirm.isConfirmed) return;
        await axios.delete(`/api/teacher/classes/requests?requestId=${requestId}`);
      } else {
        await axios.patch('/api/teacher/classes/requests', { requestId, status: action });
      }
      Swal.fire({ icon: 'success', title: 'Done!', timer: 1200, showConfirmButton: false });
      fetchRequests();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Action failed', 'error');
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Join <span className="text-primary">Requests</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">Review and manage student enrolment requests</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: requests.length, color: 'text-slate-700', bg: 'bg-slate-50' },
          { label: 'Pending', count: requests.filter(r => r.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Confirmed', count: requests.filter(r => r.status === 'confirmed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} p-6 rounded-3xl border border-white text-center`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LuUsers size={36} className="text-slate-200" />
          </div>
          <p className="text-xl font-black text-slate-400">No requests found</p>
          <p className="text-slate-300 font-bold mt-2">Students will appear here when they request to join your class.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div key={req._id} className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Info */}
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
                  {req.studentName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-lg">{req.studentName}</p>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <LuSchool size={12} /> {req.classId?.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <LuHash size={12} /> Roll: {req.classRoll}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${STATUS_BADGE[req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {req.status === 'pending' ? (
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => handleAction(req._id, 'confirmed')}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95"
                  >
                    <LuCircleCheck size={16} /> Confirm
                  </button>
                  <button
                    onClick={() => handleAction(req._id, 'rejected')}
                    className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-sm border border-red-200 hover:bg-red-100 transition-all active:scale-95"
                  >
                    <LuCircleX size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(req._id, 'delete')}
                    className="p-3 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAction(req._id, 'delete')}
                  className="p-3 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-2xl transition-all flex-shrink-0"
                >
                  <LuTrash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
