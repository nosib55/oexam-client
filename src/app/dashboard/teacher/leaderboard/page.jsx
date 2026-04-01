import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Search } from 'lucide-react';

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

  // 
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
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center justify-center gap-3">
          <Trophy className="text-yellow-500 w-10 h-10" /> Academic Leaderboard
        </h1>
        <p className="text-gray-500 mt-2">
          Celebrating our top performers and their hard work!
        </p>
      </div>

      {/* Top 3 Winners Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-gray-300 text-center order-2 md:order-1 h-64 flex flex-col justify-center">
            <Medal className="mx-auto text-gray-400 w-12 h-12 mb-2" />
            <h3 className="font-bold text-lg text-gray-700">
              {topThree[1].studentName}
            </h3>
            <p className="text-2xl font-black text-purple-600">
              {topThree[1].totalMarks}
            </p>
            <span className="text-sm text-gray-400">Rank #2</span>
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div className="bg-gradient-to-b from-yellow-50 to-white p-8 rounded-2xl shadow-xl border-b-4 border-yellow-500 text-center order-1 md:order-2 h-80 flex flex-col justify-center scale-105 z-10">
            <Trophy className="mx-auto text-yellow-500 w-16 h-16 mb-2 animate-bounce" />
            <h3 className="font-bold text-xl text-gray-800">
              {topThree[0].studentName}
            </h3>
            <p className="text-4xl font-black text-yellow-600">
              {topThree[0].totalMarks}
            </p>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold mt-2">
              Champion
            </span>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-orange-300 text-center order-3 h-60 flex flex-col justify-center">
            <Award className="mx-auto text-orange-400 w-12 h-12 mb-2" />
            <h3 className="font-bold text-lg text-gray-700">
              {topThree[2].studentName}
            </h3>
            <p className="text-2xl font-black text-purple-600">
              {topThree[2].totalMarks}
            </p>
            <span className="text-sm text-gray-400">Rank #3</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search student name..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Rest of the Students Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                Rank
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                Student Name
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-right">
                Marks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {restOfStudents.map(student => (
              <tr
                key={student.rank}
                className="hover:bg-purple-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-500">
                  #{student.rank}
                </td>
                <td className="px-6 py-4 text-gray-800 font-semibold">
                  {student.studentName}
                </td>
                <td className="px-6 py-4 text-right font-bold text-purple-700">
                  {student.totalMarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
