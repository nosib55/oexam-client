'use client';

import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  LuTrophy,
  LuClock,
  LuTarget,
  LuChevronLeft,
  LuMedal,
  LuDownload,
  LuSearch,
  LuTrendingUp,
  LuZap
} from 'react-icons/lu';
import Link from 'next/link';

export default function ExamLeaderboardPage({ params }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [id]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/leaderboard?examId=${id}&showAll=true`);
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = data?.leaderboard?.filter(item => 
    item.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.student?.email?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  const topThree = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-20">
      {/* HEADER */}
      <div className="relative overflow-hidden p-8 md:p-12 rounded-[3.5rem] bg-slate-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Link 
              href="/dashboard/teacher/exams" 
              className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all"
            >
              <LuChevronLeft size={16} /> Back to Hub
            </Link>
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                Performance Analytics
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                Live <span className="text-primary text-glow">Leaderboard</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{data?.examTitle}</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.print()}
            className="h-16 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95 shadow-xl"
          >
            <LuDownload size={18} /> Export Results
          </button>
        </div>
      </div>

      {/* PODIUM SECTION */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto px-4">
          {/* SILVER - 2nd */}
          {topThree[1] && (
            <div className="order-2 md:order-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl text-center space-y-4 relative pt-12">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border-4 border-white shadow-lg">
                  <LuMedal size={24} />
               </div>
               <div className="space-y-1">
                  <p className="font-black text-slate-800 text-xl truncate">{topThree[1].student.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank 02</p>
               </div>
               <div className="flex justify-center gap-4 py-2">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Score</p>
                    <p className="text-lg font-black text-primary">{topThree[1].percentage}%</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100"></div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Time</p>
                    <p className="text-lg font-black text-slate-700">{topThree[1].completionTime}s</p>
                  </div>
               </div>
            </div>
          )}

          {/* GOLD - 1st */}
          <div className="order-1 md:order-2 bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-center space-y-6 relative pt-16 scale-110 ring-8 ring-primary/5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white border-8 border-slate-900 shadow-2xl">
                 <LuTrophy size={32} />
              </div>
              <div className="space-y-1">
                 <p className="font-black text-white text-2xl truncate">{topThree[0].student.name}</p>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">The Apex Student</p>
              </div>
              <div className="flex justify-center gap-6 py-2">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-white/40 uppercase">Top Score</p>
                    <p className="text-2xl font-black text-primary">{topThree[0].percentage}%</p>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-white/40 uppercase">Speed</p>
                    <p className="text-2xl font-black text-white">{topThree[0].completionTime}s</p>
                  </div>
               </div>
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Rank #1</div>
          </div>

          {/* BRONZE - 3rd */}
          {topThree[2] && (
            <div className="order-3 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl text-center space-y-4 relative pt-12">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border-4 border-white shadow-lg">
                  <LuMedal size={24} />
               </div>
               <div className="space-y-1">
                  <p className="font-black text-slate-800 text-xl truncate">{topThree[2].student.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank 03</p>
               </div>
               <div className="flex justify-center gap-4 py-2">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Score</p>
                    <p className="text-lg font-black text-amber-600">{topThree[2].percentage}%</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100"></div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Time</p>
                    <p className="text-lg font-black text-slate-700">{topThree[2].completionTime}s</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* FILTER & MAIN LIST */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
               Full Ranking Table
               <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase">{data?.totalSubmissions} Listed</span>
            </h3>
            <div className="relative w-full md:w-80">
               <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                type="text" 
                placeholder="Search candidates..." 
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rank</th>
                     <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                     <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                     <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Weightage</th>
                     <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Completion Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredLeaderboard.map((item) => (
                    <tr key={item.student._id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs mx-auto ${
                            item.rank <= 3 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {String(item.rank).padStart(2, '0')}
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <p className="text-sm font-bold text-slate-800">{item.student.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">{item.student.email}</p>
                       </td>
                       <td className="px-6 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                            item.percentage >= 80 ? 'bg-emerald-50 text-emerald-600' : 
                            item.percentage >= 40 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                          }`}>
                             {item.percentage >= 80 ? 'Master' : item.percentage >= 40 ? 'Proficient' : 'Novice'}
                          </span>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[100px]">
                                <div 
                                  className="h-full bg-primary rounded-full transition-all duration-1000" 
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                             </div>
                             <span className="text-sm font-black text-slate-800">{item.percentage}%</span>
                          </div>
                       </td>
                       <td className="px-6 py-6 text-right">
                          <p className="text-sm font-black text-slate-800 flex items-center justify-end gap-2">
                             <LuClock size={14} className="text-primary" /> {item.completionTime}s
                          </p>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
