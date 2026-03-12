'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaSave,
  FaRegLightbulb,
  FaPlus,
  FaCheckCircle,
} from 'react-icons/fa';
// import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AddQuestionPage() {
  const [questionData, setQuestionData] = useState({
    statement: '',
    subject: 'ICT',
    difficulty: 'Easy',
    marks: 1,
    type: 'MCQ',
    correctAnswer: 0, 
  });

  const [options, setOptions] = useState(['', '', '', '']);

  //
  const handleTypeChange = type => {
    setQuestionData({ ...questionData, type });
    if (type === 'True/False') {
      setOptions(['True', 'False']);
      setQuestionData(prev => ({ ...prev, type, correctAnswer: 0 }));
    } else {
      setOptions(['', '', '', '']);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...questionData,
        options,
      };

      console.log('Saving Question:', payload);
      // await axios.post('/api/teacher/questions', payload);
      toast.success('Question saved successfully!');
    } catch (error) {
      toast.error('Failed to save question');
    }
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

        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
        >
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
                value={questionData.statement}
                onChange={e =>
                  setQuestionData({
                    ...questionData,
                    statement: e.target.value,
                  })
                }
                placeholder="Type your question here..."
                className="w-full p-5 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 min-h-[120px] font-bold text-slate-700 transition-all shadow-inner"
              />
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Subject
                </label>
                <select
                  value={questionData.subject}
                  onChange={e =>
                    setQuestionData({
                      ...questionData,
                      subject: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm cursor-pointer"
                >
                  <option>ICT</option>
                  <option>Math</option>
                  <option>Physics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Difficulty
                </label>
                <select
                  value={questionData.difficulty}
                  onChange={e =>
                    setQuestionData({
                      ...questionData,
                      difficulty: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm cursor-pointer"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Marks
                </label>
                <input
                  type="number"
                  value={questionData.marks}
                  onChange={e =>
                    setQuestionData({ ...questionData, marks: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm"
                />
              </div>
            </div>

            {/* Type Switcher */}
            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Question Type
              </label>
              <div className="flex p-1.5 bg-slate-50 rounded-2xl w-fit">
                {['MCQ', 'True/False', 'Written'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      questionData.type === type
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* MCQ & True/False Options Section */}
            {(questionData.type === 'MCQ' ||
              questionData.type === 'True/False') && (
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Answer Options (Select the correct one)
                </label>
                <div className="grid gap-3">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <button
                        onClick={() =>
                          setQuestionData({ ...questionData, correctAnswer: i })
                        }
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                          questionData.correctAnswer === i
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {questionData.correctAnswer === i ? (
                          <FaCheckCircle size={16} />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </button>
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        className={`flex-1 p-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all ${
                          questionData.correctAnswer === i
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                        value={opt}
                        onChange={e => handleOptionChange(i, e.target.value)}
                        disabled={questionData.type === 'True/False'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= SIDEBAR HELP ================= */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <FaRegLightbulb size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight leading-tight">
                Pro Tips
              </h3>
              <ul className="space-y-4 text-slate-400 text-[11px] font-bold leading-relaxed uppercase tracking-wide">
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Try to similler option with MCQ
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Correct answer btn
                  (A, B, C...) mark by click
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
