'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Search, TrendingUp, Users } from 'lucide-react';
import LeaderboardChart from '@/components/teacher/LeaderboardChart';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axios.get('/api/leaderboard');
        setLeaderboard(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredData = leaderboard.filter(item =>
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

 if (loading)
   return (
     <div className="h-screen flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
     </div>
   );

  const topThree = filteredData.slice(0, 3);
  const restOfStudents = filteredData.slice(3);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Top Performers <Trophy className="text-yellow-500 w-10 h-10" />
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Real-time academic rankings and achievements
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Find a student..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Top 3 Winner Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
        {/* Silver - 2nd Place */}
        {topThree[1] && (
          <div className="relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 text-center border border-slate-100 order-2 md:order-1 group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-100 p-3 rounded-2xl shadow-inner">
              <Medal className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-1">
              {topThree[1].studentName}
            </h3>
            <div className="text-3xl font-black text-slate-600 mb-2">
              {topThree[1].totalMarks}
            </div>
            <div className="inline-block px-4 py-1 bg-slate-50 text-slate-500 rounded-full text-sm font-bold">
              2nd Runner Up
            </div>
          </div>
        )}

        {/* Gold - 1st Place */}
        {topThree[0] && (
          <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-200/40 text-center border-2 border-blue-50 order-1 md:order-2 z-10 transform hover:scale-[1.03] transition-all duration-300">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-yellow-400 to-yellow-600 p-5 rounded-3xl shadow-lg shadow-yellow-200 animate-pulse">
              <Trophy className="text-white w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-2xl text-slate-900 mt-4 mb-1">
              {topThree[0].studentName}
            </h3>
            <div className="text-5xl font-black text-blue-600 mb-4 tracking-tighter">
              {topThree[0].totalMarks}
            </div>
            <div className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-200">
              Grand Champion
            </div>
          </div>
        )}

        {/* Bronze - 3rd Place */}
        {topThree[2] && (
          <div className="relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 text-center border border-slate-100 order-3 group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-50 p-3 rounded-2xl shadow-inner">
              <Award className="text-orange-400 w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-1">
              {topThree[2].studentName}
            </h3>
            <div className="text-3xl font-black text-slate-600 mb-2">
              {topThree[2].totalMarks}
            </div>
            <div className="inline-block px-4 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-bold">
              3rd Place
            </div>
          </div>
        )}
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-600 w-5 h-5" />
          <h2 className="text-xl font-bold text-slate-800">
            Performance Analytics
          </h2>
        </div>
        <LeaderboardChart data={leaderboard} />
      </div>

      {/* Modern Data Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="text-slate-400 w-5 h-5" />
            <span className="font-bold text-slate-700">Detailed Rankings</span>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredData.length} Students Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-5">Rank</th>
                <th className="px-8 py-5">Student</th>
                <th className="px-8 py-5 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {restOfStudents.map(student => (
                <tr
                  key={student.rank}
                  className="group hover:bg-blue-50/30 transition-all cursor-default"
                >
                  <td className="px-8 py-6">
                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {student.rank}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {student.studentName}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {student.studentEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black text-slate-700 tracking-tighter">
                        {student.totalMarks}
                      </span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${(student.totalMarks / (topThree[0]?.totalMarks || 100)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="py-20 text-center">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">
              We couldn&apos;t find any student matching that name.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
