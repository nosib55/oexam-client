"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FaBookOpen, 
  FaCheckCircle, 
  FaClock, 
  FaTrophy, 
  FaArrowRight,
  FaCalendarCheck,
  FaFileAlt,
  FaChartLine
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const performanceData = [
  { name: "Jan", score: 65 },
  { name: "Feb", score: 72 },
  { name: "Mar", score: 68 },
  { name: "Apr", score: 85 },
  { name: "May", score: 78 },
  { name: "Jun", score: 90 },
];

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm hover:shadow-md transition-shadow group"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-base-content/60 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1 group-hover:text-primary transition-colors">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${color} bg-opacity-10 transition-transform group-hover:scale-110 duration-300`}>
        {React.cloneElement(icon, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
      </div>
    </div>
  </motion.div>
);

export default function StudentDashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-base-content tracking-tight">
            Welcome back, <span className="text-primary">MRB RAFI!</span>
          </h1>
          <div className="flex items-center gap-2 mt-2 text-base-content/60">
            <FaCalendarCheck className="text-primary/70" />
            <p className="font-medium">{currentDate}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-primary shadow-lg shadow-primary/20 gap-2">
            <FaBookOpen /> Take Exam
          </button>
          <button className="btn btn-outline btn-primary gap-2">
            <FaFileAlt /> My Results
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Exams" 
          value="24" 
          icon={<FaBookOpen />} 
          color="bg-primary" 
          delay={0.1}
        />
        <StatCard 
          title="Exams Passed" 
          value="21" 
          icon={<FaCheckCircle />} 
          color="bg-success" 
          delay={0.2}
        />
        <StatCard 
          title="Average Score" 
          value="82%" 
          icon={<FaTrophy />} 
          color="bg-warning" 
          delay={0.3}
        />
        <StatCard 
          title="Upcoming" 
          value="03" 
          icon={<FaClock />} 
          color="bg-info" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-base-100 p-8 rounded-2xl border border-base-300 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaChartLine className="text-primary" /> Performance Overview
              </h2>
              <p className="text-base-content/50 text-sm mt-1">Your academic progress over time</p>
            </div>
            <select className="select select-bordered select-sm rounded-lg bg-base-200/50">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2b4bee" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2b4bee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#fff',
                    padding: '12px'
                  }}
                  cursor={{ stroke: '#2b4bee', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2b4bee" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Upcoming Exams/Schedule */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-base-100 p-8 rounded-2xl border border-base-300 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming</h2>
            <span className="badge badge-primary badge-outline badge-sm">Next 7 Days</span>
          </div>
          <div className="space-y-5">
            {[
              { subject: "General Mathematics", time: "Tomorrow, 10:00 AM", tag: "Hard", color: "bg-error" },
              { subject: "Information Theory", time: "25 Feb, 02:30 PM", tag: "Medium", color: "bg-warning" },
              { subject: "English Composition", time: "28 Feb, 09:00 AM", tag: "Easy", color: "bg-success" },
            ].map((exam, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-base-200/40 hover:bg-base-200 transition-all cursor-pointer group border border-transparent hover:border-primary/20">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-base-content/90 group-hover:text-primary transition-colors">{exam.subject}</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase ${
                    exam.tag === 'Hard' ? 'bg-error/10 text-error' : 
                    exam.tag === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {exam.tag}
                  </span>
                </div>
                <div className="flex items-center text-sm text-base-content/50 font-medium">
                  <FaClock className="mr-2 text-xs text-primary/60" />
                  {exam.time}
                </div>
                <div className="w-full bg-base-300 h-1 rounded-full mt-1 overflow-hidden">
                  <div className={`h-full ${exam.color} w-2/3`}></div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm w-full mt-6 text-primary hover:bg-primary/5 rounded-xl">
            View Full Schedule <FaArrowRight className="ml-2 text-xs" />
          </button>
        </motion.div>
      </div>

      {/* Recent Activity / Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-base-300 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Recent Results</h2>
            <p className="text-base-content/50 text-sm">Last 3 completed assessments</p>
          </div>
          <div className="flex gap-2">
            <div className="join">
                <button className="btn btn-sm btn-ghost join-item border border-base-300">Filtered</button>
                <button className="btn btn-sm btn-primary join-item">All Time</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr className="bg-base-200/30 text-base-content/70">
                <th className="py-4 px-8 capitalize font-bold">Exam Title</th>
                <th className="py-4 capitalize font-bold text-center">Date Taken</th>
                <th className="py-4 capitalize font-bold text-center">Final Score</th>
                <th className="py-4 capitalize font-bold text-center">Status</th>
                <th className="py-4 capitalize font-bold text-right px-8">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Science Quiz", date: "15 Feb 2024", score: "88/100", status: "Passed", color: "success" },
                { name: "Computer Fundamentals", date: "12 Feb 2024", score: "95/100", status: "Passed", color: "success" },
                { name: "World History", date: "05 Feb 2024", score: "72/100", status: "Passed", color: "success" },
              ].map((result, i) => (
                <tr key={i} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 font-bold text-base-content/80 group-hover:text-primary">{result.name}</td>
                  <td className="text-center text-base-content/60 font-medium">{result.date}</td>
                  <td className="text-center">
                    <span className="font-black text-lg">{result.score}</span>
                  </td>
                  <td className="text-center">
                    <span className={`badge badge-${result.color} badge-md font-bold text-[10px] uppercase tracking-wider`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="text-right px-8">
                    <button className="btn btn-ghost btn-sm text-primary font-bold hover:bg-transparent hover:underline px-0">
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-base-200/20 text-center">
            <button className="text-primary font-bold text-sm hover:underline">Show More History</button>
        </div>
      </motion.div>
    </div>
  );
}
