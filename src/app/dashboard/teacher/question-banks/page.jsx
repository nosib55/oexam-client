'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  FaPlus,
  FaSearch,
  FaFolder,
  FaBookOpen,
  FaTrash,
  FaPencilAlt,
  FaChevronRight,
  FaChartBar,
  FaChartPie
} from 'react-icons/fa';

export default function QuestionBanksPage() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBank, setNewBank] = useState({ name: '', subject: '', description: '' });

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
      console.error('Fetch Error:', error);
      toast.error('Failed to load question banks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBank = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/teacher/question-banks', newBank, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Question Bank created!');
      setIsModalOpen(false);
      setNewBank({ name: '', subject: '', description: '' });
      fetchBanks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create bank');
    }
  };

  const handleDeleteBank = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${name}"? This will not delete the questions within it.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/teacher/question-banks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Deleted successfully');
        fetchBanks();
      } catch (error) {
        toast.error('Deletion failed');
      }
    }
  };

  const filteredBanks = banks.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      {/* HEADER */}
      <div className="relative overflow-hidden p-8 md:p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
              Content Repository
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
              Question <span className="text-primary">Banks</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              Organize your assessments by topic. Reuse questions across different exams with ease.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white h-16 rounded-2xl px-10 font-black shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <FaPlus size={24} className="group-hover:rotate-90 transition-transform" />
            <span>Create New Bank</span>
          </button>
        </div>
      </div>

      {/* FILTERS & STATS */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or subject..."
            className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white border-none shadow-sm focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-white/50 rounded-[2.5rem] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBanks.map((bank) => (
            <div 
              key={bank._id}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative overflow-hidden"
            >
              {/* TOP STRIPE */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/10 group-hover:bg-primary transition-colors"></div>

              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                  <FaFolder size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <FaPencilAlt size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteBank(bank._id, bank.name)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-8 flex-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {bank.subject}
                </span>
                <h3 className="text-2xl font-black text-slate-800 leading-tight">
                  {bank.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 italic">
                  {bank.description || 'No description provided.'}
                </p>
              </div>

              {/* STATS PREVIEW */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FaBookOpen size={10} /> Questions
                  </p>
                  <p className="text-xl font-black text-slate-800">{bank.totalQuestions || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    Type Split
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">MCQ: {bank.questionTypes?.MCQ || 0}</span>
                  </div>
                </div>
              </div>

              <Link 
                href={`/dashboard/teacher/question-banks/${bank._id}`}
                className="mt-8 w-full bg-slate-50 group-hover:bg-primary group-hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Manage Questions
                <FaChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}

          {/* EMPTY STATE / ADD NEW CARD */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="min-h-[320px] rounded-[2.5rem] border-4 border-dashed border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-6 group"
          >
            <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
              <FaPlus size={32} />
            </div>
            <div className="text-center space-y-1">
              <p className="font-black text-slate-800 text-lg uppercase tracking-widest">New Bank</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Add a new category</p>
            </div>
          </button>
        </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <FaFolder size={28} />
                </div>
                <h2 className="text-3xl font-black text-slate-800">Create Question Bank</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Add a new repository for your content</p>
              </div>

              <form onSubmit={handleCreateBank} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bank Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Physics Unit 1: Dynamics"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
                    value={newBank.name}
                    onChange={(e) => setNewBank({...newBank, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject Area</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Physics"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
                    value={newBank.subject}
                    onChange={(e) => setNewBank({...newBank, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description (Optional)</label>
                  <textarea
                    rows="3"
                    placeholder="Briefly describe what's inside..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all resize-none"
                    value={newBank.description}
                    onChange={(e) => setNewBank({...newBank, description: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    Create Repository
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
