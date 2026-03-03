'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaSave,
  FaRegLightbulb,
  FaPlus,
  FaTrashAlt,
} from 'react-icons/fa';

export default function AddQuestionPage() {
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState(['', '', '', '']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 p-4 lg:p-0">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/teacher/questions"
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-lg transition-all"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Create Question
            </h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
              Question Bank Engine
            </p>
          </div>
        </div>

        <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
          <FaSave size={16} />
          <span>Save Question</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= MAIN FORM ================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            {/* Question Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Question Statement
              </label>
              <textarea
                placeholder="Type your question here..."
                className="w-full p-5 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 min-h-[120px] font-bold text-slate-700 transition-all"
              />
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Subject
                </label>
                <select className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm appearance-none cursor-pointer">
                  <option>ICT</option>
                  <option>Math</option>
                  <option>Physics</option>
                  <option>Biology</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Difficulty
                </label>
                <select className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm appearance-none cursor-pointer">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            {/* Type Switcher */}
            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Question Type
              </label>
              <div className="flex p-1.5 bg-slate-50 rounded-2xl w-fit">
                {['MCQ', 'Written'].map(type => (
                  <button
                    key={type}
                    onClick={() => setQuestionType(type)}
                    className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      questionType === type
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* MCQ Options Section */}
            {questionType === 'MCQ' && (
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Answer Options
                </label>
                <div className="grid gap-3">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-slate-600"
                        value={opt}
                        onChange={e => handleOptionChange(i, e.target.value)}
                      />
                      {i === 0 && (
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= SIDEBAR HELP ================= */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] border space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                <FaRegLightbulb size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight leading-tight">
                Pro Tips for <br /> Educators
              </h3>
              <ul className="space-y-4 text-slate-400 text-xs font-medium leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-primary font-black">•</span>
                  Keep questions clear and concise for better student
                  performance.
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-black">•</span>
                  For MCQ, ensure all distractors (wrong options) are plausible.
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-black">•</span>
                  Tagging correct subjects helps in automated exam generation.
                </li>
              </ul>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3 py-12">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
              <FaPlus />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Image Attachment
            </p>
            <button className="text-primary text-xs font-bold hover:underline cursor-pointer">
              Upload Reference Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
