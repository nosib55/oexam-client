"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FaFileDownload, FaChartBar, FaGraduationCap, FaCheckCircle, FaTimesCircle, FaChevronRight 
} from "react-icons/fa";

export default function MyResult() {
  const results = [
    { id: 1, title: "Mathematics II", total: 100, score: 88, date: "2024-02-15", grade: "A", status: "Passed" },
    { id: 2, title: "General Science", total: 100, score: 95, date: "2024-02-12", grade: "A+", status: "Passed" },
    { id: 3, title: "English Grammar", total: 100, score: 72, date: "2024-02-05", grade: "B", status: "Passed" },
    { id: 4, title: "Intro to Computers", total: 50, score: 45, date: "2024-01-28", grade: "A", status: "Passed" },
    { id: 5, title: "Bengali Literature", total: 40, score: 38, date: "2024-01-20", grade: "O", status: "Passed" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Academic Performance</h1>
          <p className="text-base-content/60 font-medium mt-1">Detailed breakdown of your examination results and grading</p>
        </div>
        <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20 rounded-xl">
          <FaFileDownload /> Download All Results
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-primary/5 border border-primary/20 p-6 rounded-2xl flex items-center gap-4"
         >
            <div className="bg-primary text-white p-4 rounded-xl shadow-lg shadow-primary/30">
               <FaGraduationCap size={24} />
            </div>
            <div>
               <p className="text-sm font-black text-primary/70 uppercase tracking-wider">Overall CGPA</p>
               <h3 className="text-3xl font-black text-primary">3.82 / 4.0</h3>
            </div>
         </motion.div>
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="bg-success/5 border border-success/20 p-6 rounded-2xl flex items-center gap-4"
         >
            <div className="bg-success text-white p-4 rounded-xl shadow-lg shadow-success/30">
               <FaCheckCircle size={24} />
            </div>
            <div>
               <p className="text-sm font-black text-success/70 uppercase tracking-wider">Total Passed</p>
               <h3 className="text-3xl font-black text-success">21 Exams</h3>
            </div>
         </motion.div>
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="bg-info/5 border border-info/20 p-6 rounded-2xl flex items-center gap-4"
         >
            <div className="bg-info text-white p-4 rounded-xl shadow-lg shadow-info/30">
               <FaChartBar size={24} />
            </div>
            <div>
               <p className="text-sm font-black text-info/70 uppercase tracking-wider">Percentile</p>
               <h3 className="text-3xl font-black text-info">Top 8%</h3>
            </div>
         </motion.div>
      </div>

      {/* Results Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-base-100 rounded-3xl border border-base-300 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50 text-base-content/70">
                <th className="py-6 px-8 rounded-tl-3xl font-black uppercase text-xs tracking-widest">Course Assessment</th>
                <th className="text-center font-black uppercase text-xs tracking-widest">Date Taken</th>
                <th className="text-center font-black uppercase text-xs tracking-widest">Score Breakdown</th>
                <th className="text-center font-black uppercase text-xs tracking-widest">Grade</th>
                <th className="text-center font-black uppercase text-xs tracking-widest">Verdict</th>
                <th className="text-right px-8 rounded-tr-3xl font-black uppercase text-xs tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, i) => (
                <tr key={res.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-base-content group-hover:text-primary transition-colors text-lg tracking-tight">{res.title}</span>
                      <span className="text-xs text-base-content/40 font-bold mt-1">ASSESSMENT ID: EXT-00{res.id}42</span>
                    </div>
                  </td>
                  <td className="text-center font-bold text-base-content/60">
                    {new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="text-center">
                    <div className="flex flex-col items-center">
                        <span className="font-black text-xl text-base-content">{res.score}</span>
                        <div className="w-20 bg-base-200 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${(res.score/res.total)*100}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-base-content/30 mt-1 uppercase tracking-tighter">Out of {res.total}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="text-2xl font-black text-primary/80">{res.grade}</span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success font-black text-[10px] uppercase py-3.5 px-5 tracking-tighter border-none bg-success/10 text-success">{res.status}</span>
                  </td>
                  <td className="text-right px-8">
                    <button className="btn btn-ghost btn-sm text-primary font-black hover:bg-primary/5 rounded-lg gap-2">
                       Analytics <FaChevronRight className="text-[10px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
