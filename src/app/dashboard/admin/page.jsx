"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LuUsers,
  LuUserCheck,
  LuSchool,
  LuFileText,
  LuLoader,
  LuTrendingUp,
  LuActivity,
  LuFileChartPie
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
  CartesianGrid,
  Legend,
  AreaChart,
  Area
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
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <LuActivity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" size={24} />
        </div>
        <p className="text-slate-500 font-bold tracking-tight animate-pulse">Initializing Executive Dashboard...</p>
      </div>
    );
  }

  const iconMap = {
    "Students": <LuUsers />,
    "Teachers": <LuUserCheck />,
    "Institutions": <LuSchool />,
    "Exams": <LuFileText />
  };

  const themeColors = {
    "Students": "#6366f1", // Indigo
    "Teachers": "#10b981", // Emerald
    "Institutions": "#f59e0b", // Amber
    "Exams": "#f43f5e" // Rose
  };

  const totalResources = data?.distributionData?.reduce((acc, curr) => acc + curr.value, 0) || 0;

  const stats = data?.stats.map(s => ({
    ...s,
    icon: iconMap[s.label],
    color: themeColors[s.label]
  })) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 max-w-[1600px] mx-auto pb-20 p-2"
    >
      {/* Premium Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Intelligence <span className="text-blue-600 font-outline-2">Hub</span>
          </h1>
          <p className="text-slate-500 font-medium mt-4 text-lg max-w-xl">
            Your command center for platform performance, user engagement and resource orchestration.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Real-time Stream</span>
          </div>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform duration-700 group-hover:scale-150" style={{ backgroundColor: stat.color }}></div>

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div
                  className="w-14 h-14 rounded-2xl text-white flex items-center justify-center text-2xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
                  style={{ backgroundColor: stat.color, boxShadow: `0 10px 20px -5px ${stat.color}44` }}
                >
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-black">
                  <LuTrendingUp size={12} />
                  <span>+12%</span>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Growth Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <LuActivity className="text-blue-600" />
                Performance Trajectory
              </h3>
              <p className="text-slate-400 font-medium text-sm mt-1">Student acquisition over the last 8 quarters</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none focus:ring-2 ring-blue-500/10">
              <option>Monthly View</option>
              <option>Quarterly View</option>
            </select>
          </div>

          <div className="h-[450px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.growthData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 11 }}
                  dy={15}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 11 }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 p-6 rounded-[2rem] shadow-2xl shadow-blue-500/10 transition-all outline-none">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">
                              {payload[0].value} <span className="text-sm text-slate-400 font-bold ml-1">New Students</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={5}
                  fillOpacity={1}
                  fill="url(#colorGrowth)"
                  animationDuration={2500}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribution Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30 flex flex-col justify-between">
          <div className="text-center">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
              <LuFileChartPie size={24} className="text-indigo-600" />
              Structural Split
            </h3>
            <p className="text-slate-400 font-medium text-sm mt-1">Global ecosystem allocation</p>
          </div>

          <div className="h-[350px] relative my-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={125}
                  paddingAngle={10}
                  dataKey="value"
                  animationBegin={500}
                  animationDuration={2000}
                >
                  {data?.distributionData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={Object.values(themeColors)[index % 4]}
                      strokeWidth={0}
                      className="outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 800 }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] text-center">
              <span className="block text-5xl font-black text-slate-900 tracking-tighter tabular-nums">{totalResources}</span>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Entities</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {data?.distributionData?.map((entry, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: Object.values(themeColors)[index % 4] }}></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{entry.name}</span>
                  <span className="text-sm font-black text-slate-900 tabular-nums">{entry.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {data?.distributionData.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: Object.values(themeColors)[i] }}></div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{d.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-white p-8 md:p-14 rounded-[4rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 blur-[120px] rounded-full pointer-events-none -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>

        <div className="relative z-10 flex flex-col xl:flex-row gap-16">
          {/* Left Column: Context & Controls */}
          <div className="xl:w-1/3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
              <LuActivity size={12} className="animate-pulse" />
              <span>Live Intelligence Core</span>
            </div>

            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
              Operational <br /> Event Stream
            </h3>

            <p className="text-slate-500 font-medium leading-relaxed mb-12 text-lg">
              Real-time orchestration of platform resources. Monitoring user lifecycle events and system integrity.
            </p>

            {/* Health Metrics Dashboard */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-lg group/metric">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Inbound Traffic</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">2.4k</span>
                  <span className="text-[10px] font-black text-emerald-500 mb-1.5 ring-emerald-500/10 ring-1 px-1.5 rounded-md">/ hr</span>
                </div>
                <div className="h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-blue-500"
                  ></motion.div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-lg group/metric">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Verification Rate</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">98</span>
                  <span className="text-[10px] font-black text-indigo-500 mb-1.5 ring-indigo-500/10 ring-1 px-1.5 rounded-md">% acc</span>
                </div>
                <div className="h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    className="h-full bg-indigo-500"
                  ></motion.div>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 transform hover:-translate-y-1">
              System Audit Console
              <LuTrendingUp size={16} />
            </button>
          </div>

          {/* Right Column: The Stream */}
          <div className="xl:w-2/3">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <LuActivity size={20} />
                </div>
                <h4 className="font-black text-slate-900 tracking-tight">Recent Transactions</h4>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                Sync Stable
              </div>
            </div>

            <div className="space-y-4">
              {data?.recentActivity?.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-6 p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group/item cursor-default"
                >
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-mono text-xs font-black shadow-inner border border-slate-100 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:border-blue-600 transition-all duration-300 shrink-0 tabular-nums">
                    {new Date(Date.now() - (i * 3600000)).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Authentication</span>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-1">
                        <LuTrendingUp size={10} /> Live
                      </span>
                    </div>
                    <p className="text-lg font-black text-slate-900 tracking-tight leading-none">
                      {msg}
                    </p>
                  </div>

                  <div className="hidden sm:block">
                    <button className="px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black text-slate-500 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                      Trace Log
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Simulated Connection Pulse */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3 opacity-30">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Listening for events</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
