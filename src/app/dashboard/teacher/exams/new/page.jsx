'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  LuSettings2,
  LuBookOpen,
  LuCircleCheck,
  LuChevronRight,
  LuChevronLeft,
  LuCalendar,
  LuClock,
  LuTarget,
  LuTimer,
  LuSearch,
  LuInfo,
} from 'react-icons/lu';

export default function NewExamPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    duration: '',
    totalMarks: 100,
    scheduledAt: '',
    autoStart: false,
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/teacher/question-banks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanks(res.data);
    } catch (error) {
      toast.error('Failed to load question banks');
    }
  };

  const markPerQuestion = selectedQuestions.length > 0 
    ? (formData.totalMarks / selectedQuestions.length).toFixed(2) 
    : 0;

  const handleNext = () => {
    if (step === 1) {
      if (!formData.title || !formData.duration || !formData.totalMarks || !formData.subject) {
        return toast.error('Please fill all basic details');
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedQuestions.length === 0) {
        return toast.error('Please select at least one question');
      }
      setStep(3);
    }
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setSelectedQuestions([]); // Reset questions when changing bank
  };

  const toggleQuestionSelection = (qId) => {
    setSelectedQuestions(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const selectAllQuestions = () => {
    if (selectedBank) {
      setSelectedQuestions(selectedBank.questions.map(q => q._id || q));
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        questionBankId: selectedBank._id,
        questionIds: selectedQuestions,
      };

      const res = await axios.post('/api/teacher/exams-v2', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        icon: 'success',
        title: 'Exam Created!',
        text: 'Your exam is ready for students.',
        confirmButtonColor: '#3b82f6',
      });
      router.push('/dashboard/teacher/exams');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* STEP HUD */}
      <div className="flex items-center justify-between mb-12 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        {[
          { num: 1, label: 'Standard Config', icon: <LuSettings2 size={18} /> },
          { num: 2, label: 'Curate Content', icon: <LuBookOpen size={18} /> },
          { num: 3, label: 'Final Quality Check', icon: <LuCircleCheck size={20} /> },
        ].map((s) => (
          <div key={s.num} className={`flex items-center gap-3 transition-all duration-500 ${step === s.num ? 'opacity-100 scale-105' : 'opacity-40'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${step === s.num ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400'}`}>
              {s.num}
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Step 0{s.num}</p>
              <p className={`text-sm font-black tracking-tight ${step === s.num ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</p>
            </div>
            {s.num < 3 && <div className="hidden lg:block w-12 h-0.5 bg-slate-100 mx-4"></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
          <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
             
             <div className="space-y-2 relative z-10 text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Assessment Parameters</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Configure the core logic of your exam</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Exam Title</label>
                  <input
                    type="text"
                    className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all text-lg shadow-inner"
                    placeholder="e.g. Advanced Thermodynamics - Midterm"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject Area</label>
                  <input
                    type="text"
                    className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all shadow-inner"
                    placeholder="e.g. Physics"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Marks</label>
                  <input
                    type="number"
                    className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all shadow-inner"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({...formData, totalMarks: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all shadow-inner"
                    placeholder="60"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Scheduled Start (Optional)</label>
                  <input
                    type="datetime-local"
                    className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all shadow-inner"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                  />
                </div>
             </div>

             <div className="pt-6 relative z-10">
                <button 
                  onClick={handleNext}
                  className="w-full bg-primary py-6 rounded-3xl text-white font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Source Questions <LuChevronRight size={20} />
                </button>
             </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT: BANK SELECTION */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Select Bank</h3>
                  <div className="space-y-3">
                    {banks.map(bank => (
                      <div 
                        key={bank._id}
                        onClick={() => handleBankSelect(bank)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                          selectedBank?._id === bank._id ? 'border-primary bg-primary/5' : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div>
                          <p className={`font-black tracking-tight ${selectedBank?._id === bank._id ? 'text-primary' : 'text-slate-700'}`}>{bank.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{bank.subject} • {bank.totalQuestions} Questions</p>
                        </div>
                        {selectedBank?._id === bank._id && <LuCircleCheck className="text-primary" size={20} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: QUESTION PICKER */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl min-h-[500px] flex flex-col">
                  {selectedBank ? (
                    <>
                      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">Pick Specifics</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Repository: {selectedBank.name}</p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={selectAllQuestions} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">Select All</button>
                           <button onClick={() => setSelectedQuestions([])} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Clear</button>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                        {selectedBank.questions.map((q, idx) => (
                          <div 
                            key={q._id}
                            onClick={() => toggleQuestionSelection(q._id)}
                            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 ${
                              selectedQuestions.includes(q._id) ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-50 bg-white hover:border-slate-200'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                              selectedQuestions.includes(q._id) ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {selectedQuestions.includes(q._id) ? <LuCircleCheck size={16} /> : idx + 1}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-slate-700 leading-relaxed">{q.questionText}</p>
                              <div className="flex gap-3">
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">{q.type}</span>
                                <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{q.difficulty}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                         <p className="text-sm font-black text-slate-800">
                           <span className="text-primary">{selectedQuestions.length}</span> Questions Selected
                         </p>
                         <button 
                          onClick={handleNext}
                          className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                         >
                           Continue to Preview
                         </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                        <LuSearch size={40} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-slate-800 uppercase">Awaiting Selection</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-[200px]">Select a question bank from the left to begin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
          <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full"></div>
             
             <div className="space-y-3 relative z-10 text-center">
                <LuCircleCheck className="text-emerald-500 mx-auto" size={48} />
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Final Distribution View</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Verify all details before publishing</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><LuTarget className="text-primary" /> Total Weight</p>
                   <p className="text-3xl font-black text-slate-800">{formData.totalMarks} pts</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><LuTimer className="text-primary" /> Time Block</p>
                   <p className="text-3xl font-black text-slate-800">{formData.duration} mins</p>
                </div>
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 space-y-1 ring-4 ring-primary/5">
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2"><LuInfo /> Mark/Question</p>
                   <p className="text-3xl font-black text-primary">{markPerQuestion} pt</p>
                </div>
             </div>

             <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                   <h3 className="text-xl font-black text-slate-800">Review Items ({selectedQuestions.length})</h3>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><LuCalendar className="text-primary" /> {formData.scheduledAt || 'Not Scheduled'}</div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><LuClock className="text-primary" /> {formData.scheduledAt ? new Date(formData.scheduledAt).toLocaleTimeString() : 'Manual Start'}</div>
                   </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3 scrollbar-hide">
                  {selectedBank.questions.filter(q => selectedQuestions.includes(q._id)).map((q, idx) => (
                    <div key={q._id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4">
                       <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400">{idx + 1}</span>
                       <p className="text-sm font-bold text-slate-600 line-clamp-1">{q.questionText}</p>
                       <span className="ml-auto px-3 py-1 bg-white rounded-lg text-[9px] font-black text-slate-400 uppercase">{q.type}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="pt-8 flex flex-col md:flex-row gap-6 relative z-10">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.3em] text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-slate-100"
                >
                  <LuChevronLeft size={18} /> Modify Selection
                </button>
                <button 
                  disabled={loading}
                  onClick={handleFinalize}
                  className="flex-[2] bg-slate-900 py-6 rounded-3xl text-white font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Finalizing...' : 'Launch Assessment'} <LuCircleCheck size={20} />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
