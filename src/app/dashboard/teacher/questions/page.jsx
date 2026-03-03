"use client";

import { useState } from "react";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaBookOpen, 
  FaCheckCircle, 
  FaLayerGroup 
} from "react-icons/fa";

const questionsData = [
  { id: 1, title: "What is React?", subject: "ICT", type: "MCQ", difficulty: "Easy", status: "Published" },
  { id: 2, title: "Explain Photosynthesis", subject: "Biology", type: "Written", difficulty: "Medium", status: "Draft" },
  { id: 3, title: "Solve 2x + 5 = 15", subject: "Math", type: "MCQ", difficulty: "Easy", status: "Published" },
  { id: 4, title: "What is Newton’s Second Law?", subject: "Physics", type: "Written", difficulty: "Hard", status: "Published" },
  { id: 5, title: "Define Democracy", subject: "Civics", type: "MCQ", difficulty: "Medium", status: "Draft" },
  { id: 6, title: "HTML stands for?", subject: "ICT", type: "MCQ", difficulty: "Easy", status: "Published" },
  { id: 7, title: "Explain World War II", subject: "History", type: "Written", difficulty: "Hard", status: "Published" },
  { id: 8, title: "What is Ohm’s Law?", subject: "Physics", type: "MCQ", difficulty: "Medium", status: "Draft" },
  { id: 9, title: "Define Ecosystem", subject: "Biology", type: "Written", difficulty: "Easy", status: "Published" },
  { id: 10, title: "What is CSS?", subject: "ICT", type: "MCQ", difficulty: "Easy", status: "Published" },
  { id: 11, title: "Factorize x² - 9", subject: "Math", type: "Written", difficulty: "Medium", status: "Draft" },
  { id: 12, title: "Who discovered Gravity?", subject: "Physics", type: "MCQ", difficulty: "Easy", status: "Published" },
];

export default function QuestionsPage() {
  const [filters, setFilters] = useState({
    title: "",
    subject: "All",
    type: "All",
    difficulty: "All",
    status: "All",
  });

  const subjects = ["All", ...new Set(questionsData.map(q => q.subject))];
  const types = ["All", ...new Set(questionsData.map(q => q.type))];
  const difficulties = ["All", ...new Set(questionsData.map(q => q.difficulty))];
  const statuses = ["All", ...new Set(questionsData.map(q => q.status))];

  const filteredQuestions = questionsData.filter((q) =>
    q.title.toLowerCase().includes(filters.title.toLowerCase()) &&
    (filters.subject === "All" || q.subject === filters.subject) &&
    (filters.type === "All" || q.type === filters.type) &&
    (filters.difficulty === "All" || q.difficulty === filters.difficulty) &&
    (filters.status === "All" || q.status === filters.status)
  );

  const stats = [
    { label: "Total Questions", value: questionsData.length, icon: <FaBookOpen />, color: "text-blue-600 bg-blue-50" },
    { label: "Published", value: questionsData.filter(q => q.status === "Published").length, icon: <FaCheckCircle />, color: "text-emerald-600 bg-emerald-50" },
    { label: "Drafts", value: questionsData.filter(q => q.status === "Draft").length, icon: <FaLayerGroup />, color: "text-amber-600 bg-amber-50" },
  ];

  const resetFilters = () => {
    setFilters({ title: "", subject: "All", type: "All", difficulty: "All", status: "All" });
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-4 lg:p-0">
      
      {/* ================= PREMIUM HEADER ================= */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] bg-white border border-slate-100 shadow-2xl transition-all hover:shadow-primary/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              Resource Management
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
              Question <span className="text-primary">Bank</span>
            </h1>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 group">
            <FaPlus className="transition-transform group-hover:rotate-90" />
            <span>Add New Question</span>
          </button>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* ================= FILTERS SECTION ================= */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <FaFilter className="text-primary" />
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Advanced Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            />
          </div>

          {[
            { label: "Subject", key: "subject", options: subjects },
            { label: "Type", key: "type", options: types },
            { label: "Difficulty", key: "difficulty", options: difficulties },
            { label: "Status", key: "status", options: statuses },
          ].map((filter) => (
            <select
              key={filter.key}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-slate-600 cursor-pointer appearance-none transition-all"
              value={filters[filter.key]}
              onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
            >
              {filter.options.map((opt, i) => (
                <option key={i} value={opt}>{opt === "All" ? `All ${filter.label}s` : opt}</option>
              ))}
            </select>
          ))}
        </div>

        <div className="flex justify-end">
          <button onClick={resetFilters} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
            Clear all filters
          </button>
        </div>
      </div>

      {/* ================= DATA TABLE ================= */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Details</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredQuestions.map((q, index) => (
                <tr key={q.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-black text-slate-300">{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors leading-tight">{q.title}</p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{q.subject}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                      {q.type}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      q.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600" :
                      q.difficulty === "Medium" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${q.status === "Published" ? "bg-primary animate-pulse" : "bg-slate-300"}`}></span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${q.status === "Published" ? "text-slate-700" : "text-slate-400"}`}>
                        {q.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all">
                        <FaEdit size={14} />
                      </button>
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuestions.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="text-4xl">🔍</div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching questions found</p>
            <button onClick={resetFilters} className="text-primary text-xs font-black underline">Reset Filters</button>
          </div>
        )}
      </div>

    </div>
  );
}