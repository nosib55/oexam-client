"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  LuSearch,
  LuEye,
  LuTrash2,
  LuUserCheck,
  LuX,
  LuTrendingUp,
  LuActivity
} from "react-icons/lu";

export default function TeacherPage() {

  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const res = await fetch("/api/admin/teachers");
    const data = await res.json();
    setTeachers(data);
  };

  const handleDelete = async (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete instructor "${name}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete instructor",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[2rem]",
        confirmButton: "rounded-xl font-bold px-6 py-3",
        cancelButton: "rounded-xl font-bold px-6 py-3"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/admin/teachers/${id}`, {
            method: "DELETE"
          });
          if (res.ok) {
            Swal.fire({
              title: "Deleted!",
              text: "Teacher account has been removed.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
              background: "#ffffff",
              customClass: { popup: "rounded-[2rem]" }
            });
            fetchTeachers();
          } else {
            Swal.fire("Error", "Failed to delete teacher", "error");
          }
        } catch (err) {
          Swal.fire("Error", "An error occurred", "error");
        }
      }
    });
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    teacher.email.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };


  return (

    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-[1400px] mx-auto space-y-10 pb-20 p-4"
    >
      {/* Executive Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm w-fit">
            <LuActivity size={12} className="animate-pulse" />
            <span>Instructor Intelligence Core</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
             Teacher <span className="text-blue-600 font-outline-1">Faculty</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">
             Comprehensive management of academic instructors and their institutional affiliations.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center justify-center min-w-[140px] group transition-all hover:-translate-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Faculty</span>
              <span className="text-3xl font-black text-slate-900 tabular-nums">{teachers.length}</span>
           </div>
           <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center justify-center min-w-[140px] group transition-all hover:-translate-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Health</span>
              <span className="text-sm font-black text-emerald-500 flex items-center gap-1">
                <LuTrendingUp size={14} /> STABLE
              </span>
           </div>
        </div>
      </motion.div>



      {/* Management Core */}
      <motion.div variants={itemVariants} className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-300/20 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-slate-50/30">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-white text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-lg border border-slate-100">
               <LuUserCheck size={28} />
             </div>
             <div>
               <h2 className="font-black text-2xl text-slate-900 tracking-tight">Faculty Registries</h2>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Real-time instructor stream</p>
             </div>
           </div>

           <div className="relative group w-full xl:w-[450px]">
             <LuSearch 
               className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" 
               size={20} 
             />
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Identify instructor by name or digital identity..."
               className="w-full bg-white border border-slate-100 pl-14 pr-12 py-4 rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm shadow-sm"
             />
             
             {search && (
               <button 
                 onClick={() => setSearch("")}
                 className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
               >
                 <LuX size={18} />
               </button>
             )}
           </div>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="p-8 pb-4 pl-12">Instructor Information</th>
                <th className="pb-4">Affiliated Hub</th>
                <th className="pb-4">Operations Zone</th>
                <th className="pb-4">Credential Status</th>
                <th className="text-right pr-12 pb-4">Executive Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">

              {filteredTeachers.map(teacher => (
                <tr key={teacher._id} className="hover:bg-blue-50/20 transition-all duration-300 group/row">
                  <td className="p-8 pl-12">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-black group-hover/row:bg-blue-600 group-hover/row:text-white transition-all duration-300">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight text-lg leading-none">{teacher.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {teacher._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-500 font-bold text-sm tracking-tight">{teacher.institution || "UNASSIGNED"}</td>
                  <td className="text-slate-900 font-black text-xs">{teacher.location}</td>
                  <td>
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                      {teacher.isVerified ? "Verified" : "Provisional"}
                    </span>
                  </td>
                  <td className="text-right pr-12">
                    <div className="flex items-center justify-end gap-3 opacity-100 xl:opacity-0 group-hover/row:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => setSelectedTeacher(teacher)}
                        className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title="View Intelligence"
                      >
                        <LuEye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher._id, teacher.name)}
                        className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title="Terminate Registry"
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTeachers.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <LuSearch size={48} className="text-slate-200" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No instructor matching your parameters</p>
            </div>
          )}
        </div>
      </motion.div>



      {/* Intelligence Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 -z-10"></div>
              
              <div className="flex justify-between items-start mb-10">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Instructor Intelligence</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 italic">Detailed Resource Audit</p>
                </div>
                <button 
                  onClick={() => setSelectedTeacher(null)}
                  className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all shadow-sm"
                >
                  <LuX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {[
                  { label: "Faculty Name", val: selectedTeacher.name, icon: "👤" },
                  { label: "Digital Identity", val: selectedTeacher.email, icon: "📧" },
                  { label: "Affiliated Hub", val: selectedTeacher.institution, icon: "🏛️" },
                  { label: "Operations Zone", val: selectedTeacher.location, icon: "📍" },
                  { label: "Verification Status", val: selectedTeacher.isVerified ? "VERIFIED" : "PROVISIONAL", icon: "🛡️" },
                  { label: "Service Record", val: "ACTIVE", icon: "📅" },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <span>{item.icon}</span> {item.label}
                    </span>
                    <p className="text-lg font-black text-slate-900 tracking-tight">{item.val || "N/A"}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedTeacher(null)}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-sm hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                CLOSE INTELLIGENCE CORE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

  );
}