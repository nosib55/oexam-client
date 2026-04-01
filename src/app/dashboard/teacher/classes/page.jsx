'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  LuUsers, 
  LuPlus, 
  LuSchool, 
  LuHash, 
  LuGraduationCap,
  LuTrash2,
  LuChevronRight
} from 'react-icons/lu';

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Class 1',
    level: 'Class 1',
    section: '',
    subject: ''
  });

  const levels = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'HSC 1st Year', 'HSC 2nd Year', 'College / University'
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const userId = user._id || user.id;
        const res = await axios.get(`/api/teacher/classes?userId=${userId}`);
        setClasses(res.data);
      }
    } catch (err) {
      console.error('Fetch classes failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      const userId = user._id || user.id;
      const institution = user.institution || 'Unknown Institution';

      const res = await axios.post('/api/teacher/classes', {
        ...formData,
        userId,
        institution
      });

      if (res.status === 201) {
        Swal.fire('Success', 'Class created successfully!', 'success');
        setShowModal(false);
        setFormData({ name: 'Class 1', level: 'Class 1', section: '', subject: '' });
        fetchClasses();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to create class', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Deleting this class will also remove all its join requests!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/api/teacher/classes/${id}`);
          if (res.status === 200) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Class removed successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              background: '#ffffff',
              customClass: { popup: 'rounded-[2rem]' }
            });
            fetchClasses();
          }
        } catch (err) {
          Swal.fire('Error', 'Failed to delete class', 'error');
        }
      }
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Academic <span className="text-primary">Classes</span>
            </h1>
            <p className="text-slate-500 font-medium">Manage your classrooms and student allocations</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <LuPlus className="transition-transform group-hover:rotate-90" />
            <span>Create New Class</span>
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls._id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cls._id);
                  }}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <LuTrash2 size={18} />
                </button>
              </div>

              <div className="flex flex-col h-full space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                    <LuSchool size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 line-clamp-1 group-hover:text-primary transition-colors italic uppercase tracking-tighter">
                      {cls.name}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {cls.institution}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 text-center">Assigned Grade</span>
                  <p className="text-2xl font-black text-slate-800 italic uppercase">
                    {cls.level}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <LuHash className="text-slate-300" size={14} />
                    <span className="text-[11px] font-black text-slate-500 tracking-widest">{cls.code}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    <LuUsers size={12} />
                    {cls.studentCount} Students
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 italic">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <LuGraduationCap size={44} className="text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-400">No Educational Classes Defined</h2>
          <p className="text-slate-300 mt-2 font-medium">Click the button above to start organizing your students.</p>
        </div>
      )}

      {/* Modal Integration */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300 border-t-8 border-primary">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors font-black text-xl"
              >
                ✕
              </button>
              
              <div className="space-y-8">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Setup <span className="text-primary">Class</span></h2>
                  <p className="text-slate-500 font-medium">Initialize a new academic group module</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <LuSchool size={12} className="text-primary"/> Select Grade Level
                    </label>
                    <div className="relative group">
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[2rem] font-black text-2xl text-slate-700 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none cursor-pointer shadow-inner pr-16"
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value, name: e.target.value})}
                      >
                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                        <LuChevronRight size={28} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="p-3 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-200 text-white">
                      <LuSchool size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-0.5">Auto-detected Institute</span>
                      <p className="text-sm font-black text-emerald-900 italic">
                        {JSON.parse(localStorage.getItem('user'))?.institution || 'Registered Institution'}
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.97] mt-4 flex items-center justify-center gap-3 hover:bg-slate-800 hover:shadow-slate-200"
                  >
                    <LuPlus size={20}/>
                    <span>Initialize Class</span>
                  </button>
                </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
