"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaClock, 
  FaClipboardList, 
  FaChevronRight,
  FaExclamationCircle
} from "react-icons/fa";

export default function MyExams() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const exams = [
    { id: 1, title: "General Mathematics", subject: "Math", date: "2024-02-28", duration: "2 Hours", status: "Upcoming", difficulty: "Hard", room: "Online" },
    { id: 2, title: "Science & Environment", subject: "Science", date: "2024-03-05", duration: "45 Mins", status: "Scheduled", difficulty: "Medium", room: "Room 101" },
    { id: 3, title: "English Language I", subject: "English", date: "2024-03-10", duration: "1 Hour", status: "Scheduled", difficulty: "Easy", room: "Online" },
    { id: 4, title: "Financial Accounting", subject: "Commerce", date: "2024-02-15", duration: "3 Hours", status: "Completed", difficulty: "Hard", room: "Main Hall" },
    { id: 5, title: "Geography & Maps", subject: "Social", date: "2024-02-10", duration: "1.5 Hours", status: "Completed", difficulty: "Easy", room: "Room 204" },
  ];

  const filteredExams = exams.filter(exam => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return exam.status === 'Upcoming' || exam.status === 'Scheduled';
    if (activeTab === 'completed') return exam.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content tracking-tight">My Examination Portal</h1>
          <p className="text-base-content/60 mt-1 font-medium italic">Manage and track your academic assessment schedule</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
           <div className="relative group">
             <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 group-focus-within:text-primary transition-colors" />
             <input type="text" placeholder="Search exams..." className="input input-bordered pl-12 w-full sm:w-64 rounded-xl focus:ring-2 focus:ring-primary/20 bg-base-100" />
           </div>
           <button className="btn btn-primary gap-2 rounded-xl shadow-lg shadow-primary/10">
             <FaFilter /> Filter
           </button>
        </div>
      </div>

      {/* Tabs & Quick Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-2">
        <div className="flex gap-2 p-1 bg-base-200/50 rounded-xl">
          {['all', 'upcoming', 'completed'].map((tab) => (
            <button 
              key={tab}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                ? 'bg-base-100 text-primary shadow-sm' 
                : 'text-base-content/50 hover:text-base-content'
              } capitalize`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-base-content/40">
           <FaExclamationCircle className="text-warning" />
           <span>Next exam in 14 hours</span>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredExams.map((exam, i) => (
           <motion.div 
             key={exam.id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group overflow-hidden"
           >
             <div className="card-body p-0">
                <div className={`h-1.5 w-full ${
                  exam.status === 'Completed' ? 'bg-success' : 
                  exam.status === 'Upcoming' ? 'bg-primary' : 'bg-info'
                }`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">
                      {exam.subject}
                    </span>
                    <div className={`badge badge-sm font-black border-none py-2 px-3 ${
                        exam.status === 'Completed' ? 'bg-success/10 text-success' : 
                        exam.status === 'Upcoming' ? 'bg-primary/10 text-primary animate-pulse' : 'bg-info/10 text-info'
                    }`}>
                        {exam.status}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-extrabold text-base-content group-hover:text-primary transition-colors leading-tight mb-4">
                    {exam.title}
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm py-2 border-b border-base-200">
                      <div className="flex items-center text-base-content/60 font-medium">
                        <FaCalendarAlt className="mr-2 text-primary/60" />
                        Date
                      </div>
                      <span className="font-bold text-base-content/80">
                        {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-base-200">
                      <div className="flex items-center text-base-content/60 font-medium">
                        <FaClock className="mr-2 text-primary/60" />
                        Duration
                      </div>
                      <span className="font-bold text-base-content/80">{exam.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1">
                      <div className="flex items-center text-base-content/60 font-medium">
                        <FaClipboardList className="mr-2 text-primary/60" />
                        Complexity
                      </div>
                      <span className={`font-black text-[10px] uppercase px-2 py-0.5 rounded ${
                        exam.difficulty === 'Hard' ? 'bg-error/10 text-error' : 
                        exam.difficulty === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      }`}>{exam.difficulty}</span>
                    </div>
                  </div>

                  <div className="card-actions mt-8">
                    {exam.status === 'Completed' ? (
                      <button className="btn btn-outline btn-success btn-sm w-full rounded-xl gap-2">
                        View Assessment Report <FaChevronRight className="text-[10px]" />
                      </button>
                    ) : (
                      <button className="btn btn-primary btn-sm w-full rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02]">
                        Enter Exam Hall
                      </button>
                    )}
                  </div>
                </div>
             </div>
           </motion.div>
         ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-base-100 rounded-2xl border-2 border-dashed border-base-300">
            <div className="bg-base-200 p-6 rounded-full mb-4">
                <FaClipboardList className="text-4xl text-base-content/20" />
            </div>
            <h3 className="text-xl font-bold">No exams found</h3>
            <p className="text-base-content/50">There are no exams matching your current filter.</p>
        </div>
      )}
    </div>
  );
}
