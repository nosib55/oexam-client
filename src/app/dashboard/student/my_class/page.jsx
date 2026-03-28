'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  LuSchool,
  LuPlus,
  LuSearch,
  LuHash,
  LuClock,
  LuCircleCheck,
  LuCircleX,
  LuBuilding2,
  LuGraduationCap,
  LuUsers,
  LuRefreshCw,
} from 'react-icons/lu';

const STATUS_STYLES = {
  pending:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200', icon: <LuClock       size={14} />, label: 'Pending'   },
  confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: <LuCircleCheck size={14} />, label: 'Confirmed' },
  rejected:  { bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-200',   icon: <LuCircleX    size={14} />, label: 'Rejected'  },
};

export default function StudentMyClass() {
  const [myRequests, setMyRequests] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinForm, setJoinForm] = useState({ studentName: '', classRoll: '' });
  const [submitting, setSubmitting] = useState(false);
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = user?._id || user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }
      const [reqRes, classRes] = await Promise.all([
        axios.get(`/api/student/class-join?userId=${userId}`),
        axios.get(`/api/teacher/classes/browse`),
      ]);
      setMyRequests(reqRes.data || []);
      setAllClasses(classRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openJoinModal = (cls) => {
    setSelectedClass(cls);
    setJoinForm({ studentName: user?.name || '', classRoll: '' });
    setShowJoinModal(true);
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const userId = user?._id || user?.id;
      await axios.post('/api/student/class-join', {
        classId: selectedClass._id,
        studentId: userId,
        studentName: joinForm.studentName,
        classRoll: joinForm.classRoll,
      });
      Swal.fire('Request Sent!', 'Your join request has been submitted. Wait for teacher approval.', 'success');
      setShowJoinModal(false);
      fetchData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Failed to send request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClasses = allClasses.filter((cls) =>
    cls.level?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.institution?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            My <span className="text-primary">Classes</span>
          </h1>
          <p className="text-slate-500 font-medium">Browse available classes and manage your enrolments</p>
        </div>
      </div>

      {/* My Enrolled / Pending Classes */}
      {myRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-1">My Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRequests.map((req) => {
              const s = STATUS_STYLES[req.status] || STATUS_STYLES.pending;
              return (
                <div key={req._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between gap-6 group hover:shadow-xl transition-all">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                      <LuSchool size={22} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-800 italic uppercase tracking-tight">
                        {req.classId?.level || 'Class'}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {req.classId?.institution}
                      </p>
                      <p className="text-xs text-slate-400 font-bold mt-1">Roll: {req.classRoll}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border ${s.bg} ${s.text} ${s.border}`}>
                    {s.icon} {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Browse All Classes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Browse All Classes</h2>
          <div className="relative max-w-xs w-full">
            <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="text"
              placeholder="Search by grade or institution..."
              className="w-full pl-12 pr-5 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((cls) => {
              const alreadyRequested = myRequests.some((r) => r.classId?._id === cls._id);
              return (
                <div key={cls._id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                      <LuGraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 italic uppercase tracking-tight group-hover:text-primary transition-colors">
                        {cls.level}
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        {cls.institution}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <LuHash size={13} />
                    <span className="text-[11px] font-black tracking-widest">{cls.code}</span>
                  </div>

                  <button
                    disabled={alreadyRequested}
                    onClick={() => openJoinModal(cls)}
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                      alreadyRequested
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95'
                    }`}
                  >
                    <LuPlus size={16} />
                    {alreadyRequested ? 'Request Sent' : 'Send Join Request'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LuSchool size={36} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-black text-xl">No classes available yet</p>
            <p className="text-slate-300 font-bold mt-2">Ask your teacher to create a class first.</p>
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      {showJoinModal && selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 border-t-8 border-primary">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors font-black text-xl"
            >✕</button>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Join <span className="text-primary">{selectedClass.level}</span>
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <LuBuilding2 size={12} className="text-slate-400" />
                  <p className="text-xs font-bold text-slate-400 italic">{selectedClass.institution}</p>
                </div>
              </div>

              <form onSubmit={handleJoinSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Md. Rafi Uddin"
                    className="w-full bg-slate-50 border-none p-5 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={joinForm.studentName}
                    onChange={(e) => setJoinForm({ ...joinForm, studentName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Roll Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 24 or SCH-24-12"
                    className="w-full bg-slate-50 border-none p-5 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={joinForm.classRoll}
                    onChange={(e) => setJoinForm({ ...joinForm, classRoll: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-5 rounded-[2.5rem] font-black uppercase tracking-[0.15em] shadow-xl shadow-primary/20 transition-all active:scale-[0.97] flex items-center justify-center gap-3 hover:bg-primary/90 disabled:opacity-60"
                >
                  {submitting ? <LuRefreshCw className="animate-spin" size={20} /> : <LuPlus size={20} />}
                  Send Join Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
