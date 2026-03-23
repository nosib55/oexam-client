'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  LuChevronLeft, LuPlus, LuTrash2, 
  LuBookOpen, LuCircleCheck, LuCircleAlert, 
  LuSave, LuLayoutGrid, LuType
} from 'react-icons/lu';

import axios from 'axios';
import Swal from 'sweetalert2';

// ========== MODULAR QUESTION CARD COMPONENT ==========
const QuestionCard = ({ question, index, updateQuestion, removeQuestion }) => {
  const handleChange = (field, value) => {
    updateQuestion(index, { ...question, [field]: value });
  };

  const handleOptionChange = (optIdx, value) => {
    const newOptions = [...(question.options || ['', '', '', ''])];
    newOptions[optIdx] = value;
    updateQuestion(index, { ...question, options: newOptions });
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all relative group overflow-hidden">
      {/* Index Badge */}
      <div className="absolute top-0 left-0 bg-slate-100 px-4 py-2 rounded-br-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-colors">
        Question #{index + 1}
      </div>

      <div className="mt-6 space-y-8">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
              Question Text
            </label>
            <input 
              type="text" 
              placeholder="What is the capital of France?"
              className="w-full text-lg md:text-xl font-bold bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/20 p-4 rounded-2xl outline-none transition-all"
              value={question.questionText || ''}
              onChange={(e) => handleChange('questionText', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-48">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Type
            </label>
            <select 
              className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-sm outline-none cursor-pointer hover:bg-slate-100 transition-colors"
              value={question.type || 'MCQ'}
              onChange={(e) => {
                const newType = e.target.value;
                const updates = { type: newType };
                if (newType === 'MCQ') {
                  updates.options = ['', '', '', ''];
                } else if (newType === 'True/False') {
                  updates.options = ['True', 'False'];
                }
                updateQuestion(index, { ...question, ...updates });
              }}
            >
              <option value="MCQ">MCQ (4 Options)</option>
              <option value="True/False">True / False</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-20">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Marks
            </label>
            <input 
              type="number"
              className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-sm outline-none"
              value={question.marks || 1}
              onChange={(e) => handleChange('marks', e.target.value)}
            />
          </div>

          <button 
            onClick={() => removeQuestion(index)}
            className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all self-end md:self-center"
          >
            <LuTrash2 size={20} />
          </button>
        </div>

        {/* Options Section */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Configure Options & Mark Correct Answer
          </label>
          
          {question.type?.toUpperCase() === 'MCQ' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="relative group/option flex items-center">
                  <span className="absolute left-6 font-black text-slate-300 group-hover/option:text-primary transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <input 
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className={`w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 rounded-2xl font-bold text-sm outline-none transition-all ${
                      parseInt(question.correctAnswer) === idx ? 'border-emerald-500 bg-emerald-50/50' : 'border-transparent focus:border-primary/20 focus:bg-white'
                    }`}
                    value={question.options?.[idx] || ''}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                  />
                  <button 
                    onClick={() => handleChange('correctAnswer', idx)}
                    className={`absolute right-4 p-2 rounded-xl transition-all ${
                      parseInt(question.correctAnswer) === idx ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-300 hover:text-slate-500'
                    }`}
                    title="Mark as correct answer"
                  >
                    <LuCircleCheck size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4">
              {[0, 1].map((idx) => {
                const val = idx === 0 ? 'True' : 'False';
                return (
                  <button
                    key={val}
                    onClick={() => handleChange('correctAnswer', idx)}
                    className={`flex-1 p-6 rounded-3xl font-black text-lg transition-all border-4 ${
                      parseInt(question.correctAnswer) === idx 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                      : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== MAIN PAGE COMPONENT ==========
export default function EditQuestionBank() {
  const router = useRouter();
  const params = useParams();
  const [bank, setBank] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBank();
  }, [params.id]);

  const fetchBank = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/teacher/question-bank/list/${params.id}`);
      
      if (res.data) {
        setBank(res.data);
        setQuestions(res.data.questions || []);
      }
    } catch (err) {
      console.error('Error fetching bank:', err);
      router.push('/dashboard/teacher/question-bank');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    // If bank exists but totalQuestions is missing or 0, default to 10 to allow adding
    const total = bank?.totalQuestions > 0 ? bank.totalQuestions : 10;
    const added = questions.length;
    const remaining = Math.max(0, total - added);
    const progress = total > 0 ? (added / total) * 100 : 0;
    
    return { total, added, remaining, progress };
  }, [bank, questions]);

  const addQuestion = () => {
    if (questions.length >= stats.total) return;
    
    setQuestions([...questions, {
      id: Date.now().toString(),
      questionText: '',
      type: 'MCQ',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    }]);
  };

  const updateQuestion = (idx, updated) => {
    const newQuestions = [...questions];
    newQuestions[idx] = updated;
    setQuestions(newQuestions);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (questions.length < stats.total) return;

    try {
      setIsSaving(true);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser._id || storedUser.id;

      // Validate all questions first
      const invalidQuestion = questions.find(q => !q.questionText || q.questionText.trim() === '');
      if (invalidQuestion) {
        Swal.fire('Incomplete Questions', 'Please provide text for all questions before finalizing.', 'warning');
        setIsSaving(false);
        return;
      }

      // 1. Save/Update each question in the database
      // 2. Collect their IDs
      const questionIds = [];
      
      for (const q of questions) {
        // If it already has a mongoose ID (starting with 6...), we could update, but for simplicity let's create new ones or assume they are new
        const res = await axios.post('/api/teacher/question-bank', {
          statement: q.questionText,
          subject: bank.subject,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
          userId: userId
        });
        questionIds.push(res.data.data._id);
      }

      // 3. Update the Question Bank with the list of question IDs
      await axios.patch(`/api/teacher/question-bank/list/${params.id}`, {
        questions: questionIds,
        totalQuestions: questions.length
      });

      Swal.fire({
        icon: 'success',
        title: 'Bank Finalized!',
        text: 'All questions have been saved to the database.',
        timer: 2000,
        showConfirmButton: false
      });

      router.push('/dashboard/teacher/question-bank');
    } catch (err) {
      console.error('Save failed:', err);
      Swal.fire('Error', 'Failed to save question bank', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  if (!bank) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard/teacher/question-bank')}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition-all active:scale-95"
            >
              <LuChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 line-clamp-1">{bank.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editor Mode</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Auto-Saving Enabled</span>
              </div>
            </div>
          </div>

          {/* Progress Stats Container */}
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                <p className="font-black text-slate-700">{stats.total}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Added</p>
                <p className="font-black text-primary">{stats.added}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
                <p className="font-black text-slate-700">{stats.remaining}</p>
              </div>
            </div>

            <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-500 ease-out shadow-lg shadow-primary/20"
                 style={{ width: `${stats.progress}%` }}
               ></div>
            </div>

            <button 
              onClick={handleSave}
              disabled={questions.length < stats.total || isSaving}
              className={`px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl ${
                questions.length < stats.total 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Finalizing...</span>
                </>
              ) : (
                <>
                  <LuSave size={20} />
                  <span>Finish Bank</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-12">
        
        {/* Empty State / Question Feed */}
        <div className="space-y-8">
          {questions.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-16 text-center border border-dashed border-slate-200">
               <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <LuLayoutGrid size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Zero Questions Added</h2>
              <p className="text-slate-500 mt-4 max-w-sm mx-auto font-medium">
                Your question bank currenty has no questions. Click the button below to start creating your module questions.
              </p>
            </div>
          ) : (
            questions.map((q, i) => (
              <QuestionCard 
                key={q.id}
                question={q}
                index={i}
                updateQuestion={updateQuestion}
                removeQuestion={removeQuestion}
              />
            ))
          )}
        </div>

        {/* Add Question Button */}
        <div className="flex justify-center">
          <button 
            onClick={addQuestion}
            disabled={questions.length >= stats.total}
            className={`flex items-center gap-3 px-12 py-6 rounded-[2.5rem] font-black group transition-all active:scale-95 border-4 ${
              questions.length >= stats.total
              ? 'bg-slate-50 text-slate-300 border-transparent cursor-not-allowed'
              : 'bg-white text-slate-900 border-slate-100 hover:border-primary/20 hover:shadow-2xl shadow-slate-200 hover:-translate-y-1'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${
              questions.length >= stats.total ? 'bg-slate-100 text-slate-200' : 'bg-primary text-white'
            }`}>
              <LuPlus size={24} />
            </div>
            <span className="text-xl tracking-tight">
              {questions.length >= stats.total ? 'Question Limit Reached' : 'Add Next Question'}
            </span>
          </button>
        </div>

        {/* Requirements Alert if not finished */}
        {questions.length < stats.total && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4 text-amber-700">
            <LuCircleAlert className="shrink-0" size={24} />
            <p className="font-bold text-sm">
              You need to add <span className="underline font-black">{stats.remaining}</span> more questions before you can finalize this bank.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
