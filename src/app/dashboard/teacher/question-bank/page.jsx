'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuPlus, LuSearch, LuBookOpen, LuMoreVertical, LuTrash2, LuPen } from 'react-icons/lu';

import axios from 'axios';
import Swal from 'sweetalert2';

export default function QuestionBankList() {
  const [banks, setBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        const userId = storedUser._id || storedUser.id;
        const res = await axios.get(`/api/teacher/question-bank/list?userId=${userId}`);
        setBanks(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch banks:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBank = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the question bank forever.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/teacher/question-bank/list/${id}`);
        setBanks(banks.filter(bank => bank._id !== id));
        Swal.fire('Deleted!', 'Question bank has been removed.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete bank', 'error');
      }
    }
  };

  const filteredBanks = (banks || []).filter(bank => 
    (bank.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Question <span className="text-primary">Banks</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage and organize your assessment content</p>
          </div>
          <Link href="/dashboard/teacher/question-bank/create">
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
              <LuPlus size={20} />
              Create New Bank
            </button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search question banks..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {filteredBanks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanks.map((bank) => (
              <div key={bank._id} className="group bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                    <LuBookOpen size={24} />
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/teacher/question-bank/${bank._id}/edit`}>
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <LuPen size={18} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => deleteBank(bank._id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <LuTrash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {bank.name}
                </h3>
                
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Qs</span>
                    <span className="text-lg font-black text-slate-700">{bank.totalQuestions}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Added</span>
                    <span className="text-lg font-black text-slate-700">{(bank.questions || []).length}</span>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {bank.totalQuestions > 0 
                          ? Math.round(((bank.questions || []).length / bank.totalQuestions) * 100) 
                          : 0}% Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-12 text-center border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LuBookOpen size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Question Banks Found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first question bank module"}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/teacher/question-bank/create">
                <button className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95">
                  Start Creating
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
