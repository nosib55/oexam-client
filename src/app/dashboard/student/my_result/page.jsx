'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LuTrophy,
  LuBookOpen,
  LuChartBar,
  LuCircleCheck,
  LuCircleX,
  LuChevronRight,
} from 'react-icons/lu';

const getGrade = (pct) => {
  if (pct >= 90) return { grade: 'A+', color: 'text-emerald-500' };
  if (pct >= 80) return { grade: 'A',  color: 'text-emerald-500' };
  if (pct >= 70) return { grade: 'B+', color: 'text-blue-500' };
  if (pct >= 60) return { grade: 'B',  color: 'text-blue-500' };
  if (pct >= 50) return { grade: 'C',  color: 'text-amber-500' };
  if (pct >= 40) return { grade: 'D',  color: 'text-orange-500' };
  return { grade: 'F', color: 'text-red-500' };
};

export default function MyResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get('/api/student/results', { headers });
      setResults(res.data || []);
    } catch (err) {
      // fallback - try with userId
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id || user?.id;
        const res = await axios.get(`/api/student/results?userId=${userId}`);
        setResults(res.data || []);
      } catch (_) {
        setError('Could not load results. Please ensure you are logged in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const totalPassed = results.filter(r => parseFloat(r.percentage) >= 40).length;
  const avgScore = results.length > 0
    ? (results.reduce((a, r) => a + parseFloat(r.percentage), 0) / results.length).toFixed(1)
    : 0;
  const bestRank = results.length > 0 ? Math.min(...results.map(r => r.rank)) : 0;

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Academic <span className="text-primary">Results</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Detailed breakdown of your examination performance</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem] flex items-center gap-5">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/30">
            <LuTrophy size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black text-primary/70 uppercase tracking-wider">Avg Score</p>
            <h3 className="text-3xl font-black text-primary">{avgScore}%</h3>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center gap-5">
          <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200">
            <LuCircleCheck size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black text-emerald-600/70 uppercase tracking-wider">Total Passed</p>
            <h3 className="text-3xl font-black text-emerald-600">{totalPassed} Exams</h3>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex items-center gap-5">
          <div className="bg-amber-400 text-white p-4 rounded-2xl shadow-lg shadow-amber-200">
            <LuChartBar size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black text-amber-600/70 uppercase tracking-wider">Best Rank</p>
            <h3 className="text-3xl font-black text-amber-600">#{bestRank || '—'}</h3>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-red-600 font-bold text-center">
          {error}
        </div>
      )}

      {/* Results List */}
      {results.length === 0 && !error ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
          <LuBookOpen size={48} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-400">No results yet</h2>
          <p className="text-slate-300 font-bold mt-2">Complete and submit your exams to see results here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-5 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment</th>
                  <th className="py-5 px-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="py-5 px-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                  <th className="py-5 px-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                  <th className="py-5 px-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                  <th className="py-5 px-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const pct = parseFloat(r.percentage);
                  const { grade, color } = getGrade(pct);
                  const passed = pct >= 40;
                  return (
                    <tr key={r._id} className="border-b border-slate-50 hover:bg-primary/5 transition-colors group">
                      <td className="py-5 px-8">
                        <p className="font-black text-slate-800 group-hover:text-primary transition-colors">{r.exam?.title || 'Exam'}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">{r.exam?.subject}</p>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className="text-sm font-bold text-slate-500">
                          {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-slate-800">{r.marksObtained}</span>
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 mt-1">/ {r.totalMarks}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`text-2xl font-black ${color}`}>{grade}</span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className="text-sm font-black text-slate-600">#{r.rank}</span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          {passed ? <LuCircleCheck size={12} /> : <LuCircleX size={12} />}
                          {passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
