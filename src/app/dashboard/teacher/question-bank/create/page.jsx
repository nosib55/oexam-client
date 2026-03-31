'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { LuChevronLeft, LuArrowRight, LuRocket, LuBookOpen, LuCircleHelp } from 'react-icons/lu';

export default function CreateQuestionBank() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    totalQuestions: '10'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        throw new Error('User not found. Please log in again.');
      }

      const userId = storedUser._id || storedUser.id;

      const res = await axios.post('/api/teacher/question-bank/list', {
        name: formData.title,
        totalQuestions: parseInt(formData.totalQuestions),
        subject: 'General', // Default, teacher can change in edit
        userId: userId,
      });

      if (res.status === 201) {
        // Redirect to edit page with the real DB ID
        router.push(`/dashboard/teacher/question-bank/${res.data.data._id}/edit`);
      }
    } catch (err) {
      console.error('Failed to create bank:', err);
      // Fallback to localStorage if API fails for some reason (optional)
      const id = Date.now().toString();
      router.push(`/dashboard/teacher/question-bank/${id}/edit`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/dashboard/teacher/question-bank"
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-500 font-bold hover:text-primary transition-colors text-sm uppercase tracking-widest mb-10"
        >
          <LuChevronLeft size={20} />
          Back to List
        </Link>

        {/* Form Container */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 bg-primary/5 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="p-4 bg-primary/10 text-primary rounded-3xl w-fit inline-block md:block mb-4">
                <LuBookOpen size={32} />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                New <span className="text-primary">Bank</span>
              </h1>
              <p className="text-slate-500 font-medium">Configure your question bank module metadata</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Title Input */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <LuRocket size={14} className="text-primary" />
                  Bank Title
                </label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="e.g. Science Final Examination - 2024"
                  className="w-full text-xl md:text-2xl font-bold bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 p-6 rounded-3xl outline-none transition-all placeholder:text-slate-300"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Range Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <LuCircleHelp size={14} className="text-indigo-500" />
                    Total Questions
                  </label>
                  <span className="text-2xl font-black text-primary">{formData.totalQuestions}</span>
                </div>
                
                <div className="space-y-4">
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5"
                    className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <span>10 Questions</span>
                    <span>100 Questions</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={!formData.title}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white p-6 rounded-[2rem] font-black group flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                <span>Initialize Bank</span>
                <LuArrowRight 
                  size={20} 
                  className="transition-transform group-hover:translate-x-1" 
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
