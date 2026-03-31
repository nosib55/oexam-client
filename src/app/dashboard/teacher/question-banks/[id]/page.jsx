'use client';

import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaPencilAlt,
  FaChevronLeft,
  FaBookOpen,
  FaLayerGroup,
  FaCheckCircle,
  FaQuestionCircle,
} from 'react-icons/fa';
import Link from 'next/link';

export default function QuestionBankDetailPage({ params }) {
  const { id } = use(params);
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    questionText: '',
    type: 'MCQ',
    difficulty: 'Easy',
    options: ['', '', '', ''],
    correctAnswer: 0, // index for MCQ, 0/1 for T/F
    marks: 1
  });

  useEffect(() => {
    fetchBank();
  }, [id]);

  const fetchBank = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/teacher/question-banks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBank(res.data);
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Clean up options if True/False
      const payload = { ...formData };
      if (formData.type === 'True/False') {
        payload.options = ['True', 'False'];
      }

      await axios.post(`/api/teacher/question-banks/${id}/questions`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Question added to bank!');
      setIsModalOpen(false);
      resetForm();
      fetchBank();
    } catch (error) {
      toast.error('Failed to add question');
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      type: 'MCQ',
      difficulty: 'Easy',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    });
  };

  const handleDeleteQuestion = async (qId) => {
    const result = await Swal.fire({
      title: 'Remove question?',
      text: "This will remove it from this bank, but keep it in your global database.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, remove it'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/teacher/question-banks/${id}/questions`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { questionId: qId }
        });
        toast.success('Question removed');
        fetchBank();
      } catch (error) {
        toast.error('Removal failed');
      }
    }
  };

  const filteredQuestions = bank?.questions?.filter(q => 
    q.questionText.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (!bank) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Bank not found or failed to load.</p>
      <Link href="/dashboard/teacher/question-banks" className="text-primary font-bold">Go back to Hub</Link>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      {/* HEADER */}
      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full"></div>
        
        <Link 
          href="/dashboard/teacher/question-banks" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-black uppercase tracking-widest text-[10px] mb-6 transition-all"
        >
          <FaChevronLeft size={16} /> Back to Hub
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {bank.subject}
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
              {bank.name}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                <FaBookOpen className="text-primary" /> {bank.totalQuestions || 0} Questions
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                <FaLayerGroup className="text-emerald-500" /> {bank.questionTypes?.MCQ || 0} MCQs
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white h-16 rounded-2xl px-10 font-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <FaPlus size={24} />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search questions in this bank..."
            className="w-full pl-16 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="grid grid-cols-1 gap-6">
        {filteredQuestions.map((q, idx) => (
          <div 
            key={q._id}
            className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-300 w-6 uppercase">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                    q.type === 'MCQ' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {q.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-600`}>
                    {q.difficulty}
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-slate-800 leading-relaxed">
                  {q.questionText}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {q.options.map((opt, i) => (
                    <div 
                      key={i}
                      className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
                        (q.type === 'MCQ' && i === q.correctAnswer) || 
                        (q.type === 'True/False' && i === q.correctAnswer)
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                          : 'bg-slate-50 border-slate-100 text-slate-500'
                      }`}
                    >
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-white/50 flex items-center justify-center text-[10px] uppercase">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="truncate">{opt}</span>
                      {(q.type === 'MCQ' && i === q.correctAnswer) && (
                        <FaCheckCircle size={16} className="ml-auto shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <FaPencilAlt size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mx-auto text-slate-200">
              <FaQuestionCircle size={40} />
            </div>
            <div className="space-y-1">
              <p className="font-black text-slate-800 text-lg uppercase">Zero Questions Found</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Start building your knowledge base today</p>
            </div>
          </div>
        )}
      </div>

      {/* ADD QUESTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-3xl my-auto animate-in zoom-in duration-300 shadow-2xl overflow-hidden">
            <div className="p-10 space-y-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Add New Question</h2>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Adding to repository: {bank.name}</p>
                </div>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                  {['MCQ', 'True/False'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, type, options: type === 'MCQ' ? ['', '', '', ''] : ['True', 'False']})}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.type === type ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Question Statement</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Ask something interesting..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all resize-none"
                    value={formData.questionText}
                    onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Difficulty</label>
                    <select
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 appearance-none"
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Weight (Marks)</label>
                    <input
                      type="number"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
                      value={formData.marks}
                      onChange={(e) => setFormData({...formData, marks: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Options & Correct Answer</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.options.map((opt, i) => (
                      <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        formData.correctAnswer === i ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 focus-within:border-primary/30'
                      }`}>
                        <div 
                          onClick={() => setFormData({...formData, correctAnswer: i})}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                            formData.correctAnswer === i ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-300'
                          }`}
                        >
                          {formData.correctAnswer === i ? <FaCheckCircle size={14} /> : i + 1}
                        </div>
                        <input
                          required
                          readOnly={formData.type === 'True/False'}
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 text-sm"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...formData.options];
                            newOpts[i] = e.target.value;
                            setFormData({...formData, options: newOpts});
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    Add to Knowledge Base
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
