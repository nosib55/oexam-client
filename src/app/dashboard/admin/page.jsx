"use client";

import React, { useState, useEffect } from "react";
import {
  LuUsers,
  LuUserCheck,
  LuSchool,
  LuFileText,
  LuLoader
} from "react-icons/lu";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const result = await res.json();
      if (res.ok) {
        setData(result);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <LuLoader size={40} className="animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium animate-pulse">Loading real-time analytics...</p>
      </div>
    );
  }

  const iconMap = {
    "Students": <LuUsers />,
    "Teachers": <LuUserCheck />,
    "Institutions": <LuSchool />,
    "Exams": <LuFileText />
  };

  const colorMap = {
    "Students": "bg-blue-100 text-blue-600",
    "Teachers": "bg-emerald-100 text-emerald-600",
    "Institutions": "bg-amber-100 text-amber-600",
    "Exams": "bg-indigo-100 text-indigo-600"
  };

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#6366f1"
  ];

  const stats = data?.stats.map(s => ({
    ...s,
    icon: iconMap[s.label],
    color: colorMap[s.label]
  })) || [];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          System Dashboard
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Live overview of your educational ecosystem
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
          >
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                {stat.label}
              </p>
              <h2 className="text-4xl font-black mt-2 text-gray-900 tracking-tighter">
                {stat.value}
              </h2>
            </div>
            <div className={`text-3xl p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Student Growth Trend
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Cumulative Data
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={data?.growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontWeight: 600, fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontWeight: 600, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#111827' }}
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={5}
                  dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="mb-8 font-bold text-gray-900 text-xl flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Resource Split
          </h3>
          <div className="h-80 relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data?.distributionData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data?.distributionData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={colors[index]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm mt-8">
        <h3 className="mb-8 font-bold text-gray-900 text-xl flex items-center gap-2">
          <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
          System Intelligence
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-gray-600">
          {data?.recentActivity.map((msg, i) => (
            <div key={i} className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-emerald-600">
                <LuFileText size={20} />
              </div>
              <p className="font-bold text-gray-800 leading-relaxed">
                {msg}
              </p>
              <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-widest">Just now</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
