'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  LuSave, LuArrowLeft, LuLoader, LuSettings2, 
  LuCalendar, LuClock, LuTarget, LuBookOpen, 
  LuTimer, LuCalculator, LuListChecks, LuSchool 
} from 'react-icons/lu';
import Swal from 'sweetalert2';

const EditExamPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  
  const [classes, setClasses] = useState([]);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [questionsCount, setQuestionsCount] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: '',
    totalMarks: 100,
    scheduledAt: '',
    status: 'draft',
    classId: '',
    questionBankId: '',
    negativeMarking: false,
    shuffleQuestions: false,
    manualMarking: false,
    perQuestionMark: 1
  });

  const markPerQuestion = formData.manualMarking 
    ? formData.perQuestionMark 
    : (questionsCount > 0 ? (Number(formData.totalMarks) / questionsCount).toFixed(2) : 0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      const uid = storedUser?._id || storedUser?.id;
      fetchInitialData(uid);
    }
  }, []);

  const fetchInitialData = async (uid) => {
    setLoading(true);
    try {
      const [classRes, bankRes, examRes] = await Promise.all([
        axios.get(`/api/teacher/classes?userId=${uid}`),
        axios.get(`/api/teacher/question-bank/list?userId=${uid}`),
        axios.get(`/api/teacher/exams/${id}`)
      ]);

      setClasses(classRes.data || []);
      setQuestionBanks(bankRes.data || []);
      
      const examData = examRes.data;
      if (examData.scheduledAt) {
        examData.scheduledAt = new Date(examData.scheduledAt).toISOString().slice(0, 16);
      }
      
      setFormData({
        title: examData.title || '',
        subject: examData.subject || '',
        duration: examData.duration || '',
        totalMarks: examData.totalMarks || 100,
        scheduledAt: examData.scheduledAt || '',
        status: examData.status || 'draft',
        classId: examData.classId || '',
        questionBankId: examData.questionBankId || '',
        negativeMarking: examData.negativeMarking || false,
        shuffleQuestions: examData.shuffleQuestions || false,
        manualMarking: examData.manualMarking || false,
        perQuestionMark: examData.perQuestionMark || 1
      });

      if (examData.questionBankId) {
        const bank = bankRes.data.find(b => b._id === examData.questionBankId);
        setQuestionsCount(bank?.questions?.length || examData.questions?.length || 0);
      } else if (examData.questions) {
        setQuestionsCount(examData.questions.length);
      }

    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load exam details');
      router.push('/dashboard/teacher/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleBankChange = (bankId) => {
    const selectedBank = questionBanks.find(b => b._id === bankId);
    if (selectedBank) {
      setFormData(prev => ({ 
        ...prev, 
        questionBankId: bankId,
        subject: selectedBank.subject 
      }));
      setQuestionsCount(selectedBank.questions?.length || 0);
    } else {
      setFormData(prev => ({ ...prev, questionBankId: '' }));
      setQuestionsCount(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.duration || !formData.classId || !formData.scheduledAt) {
      return toast.error('Please fill all required fields');
    }

    setUpdating(true);
    try {
      const finalTotalMarks = formData.manualMarking 
        ? (formData.perQuestionMark * questionsCount) 
        : formData.totalMarks;

      const payload = {
        ...formData,
        totalMarks: finalTotalMarks,
        markPerQuestion
      };

      // If bank changed, we should ideally refresh the questions array in the model
      // The API's PATCH handler might not handle question array update from bank automaticlly
      // Let's check if we should send questions too
      if (formData.questionBankId) {
        const bank = questionBanks.find(b => b._id === formData.questionBankId);
        if (bank) {
          payload.questions = bank.questions || [];
        }
      }

      await axios.patch(`/api/teacher/exams/${id}`, payload);
      toast.success('Exam updated successfully!');
      router.push('/dashboard/teacher/exams');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <LuArrowLeft /> Back to List
        </button>
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Edit Assessment</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Update exam structure & criteria</p>
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      <div className="bg-white p-6 md:p-12 rounded-[3rem] border border-slate-200/60 shadow-2xl space-y-10">
        {/* Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
            <LuTarget className="text-slate-400 mb-2" />
            <span className="text-[10px] font-black text-slate-400 uppercase">Total Weight</span>
            <p className="text-2xl font-black text-slate-800">{formData.totalMarks}</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex flex-col items-center text-center ring-2 ring-primary/5">
            <LuCalculator className="text-primary mb-2" />
            <span className="text-[10px] font-black text-primary uppercase">Mark Per Question</span>
            <p className="text-3xl font-black text-primary">{markPerQuestion}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
            <LuBookOpen className="text-slate-400 mb-2" />
            <span className="text-[10px] font-black text-slate-400 uppercase">Bank Questions</span>
            <p className="text-2xl font-black text-slate-800">{questionsCount}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Exam Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <LuSchool size={12} className="text-primary" /> Assign to Class
              </label>
              <select
                required
                value={formData.classId}
                onChange={e => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all cursor-pointer"
              >
                <option value="">Select a class...</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.level} — {cls.institution}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <LuCalendar size={12} className="text-primary" /> Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.scheduledAt}
                onChange={e => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Question Bank</label>
              <select
                value={formData.questionBankId}
                onChange={e => handleBankChange(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              >
                <option value="">Manual Selection (No Bank)</option>
                {questionBanks.map(bank => (
                  <option key={bank._id} value={bank._id}>{bank.name} ({bank.subject})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject Area</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Marks</label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={e => setFormData({ ...formData, totalMarks: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <LuTimer size={12} className="text-primary" /> Duration (Min)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Exam Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all cursor-pointer appearance-none"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Scheduled)</option>
                <option value="running">Running (Live)</option>
                <option value="stopped">Stopped (Paused)</option>
                <option value="closed">Closed (Ended)</option>
              </select>
            </div>
          </div>

          {/* Mark Distribution Section */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-5">
            <div className="flex items-center gap-3 text-slate-800 font-black text-xs uppercase tracking-widest border-b border-slate-200 pb-4">
              <LuListChecks className="text-primary" /> Mark Distribution Preview
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase">Calculation</span>
                  <span className="text-sm font-bold text-slate-700">
                    {formData.totalMarks} Marks ÷ {questionsCount} Questions
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase">Per Question</span>
                  <p className="text-lg font-black text-primary">{markPerQuestion} pt</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex-1 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 font-bold text-sm text-slate-600 shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                <span>Negative Marking</span>
                <input
                  type="checkbox"
                  checked={formData.negativeMarking}
                  onChange={e => setFormData({ ...formData, negativeMarking: e.target.checked })}
                  className="checkbox checkbox-primary rounded-lg"
                />
              </label>
              <label className="flex-1 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 font-bold text-sm text-slate-600 shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                <span>Shuffle Questions</span>
                <input
                  type="checkbox"
                  checked={formData.shuffleQuestions}
                  onChange={e => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                  className="checkbox checkbox-primary rounded-lg"
                />
              </label>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
               <label className="flex items-center justify-between bg-indigo-50/50 px-6 py-4 rounded-2xl border border-indigo-100 font-bold text-sm text-indigo-900 shadow-sm hover:border-indigo-300 transition-all cursor-pointer">
                <div className="flex flex-col">
                  <span>Manual Mark Allocation</span>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">Define fixed marks for every item</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.manualMarking}
                  onChange={e => setFormData({ ...formData, manualMarking: e.target.checked })}
                  className="checkbox checkbox-indigo rounded-lg"
                />
              </label>

              {formData.manualMarking && (
                <div className="mt-4 p-6 bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-500/5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-3">Custom Marks Per Item</label>
                  <div className="flex items-center gap-4">
                     <input 
                      type="number"
                      value={formData.perQuestionMark}
                      onChange={(e) => setFormData({...formData, perQuestionMark: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-2 border-indigo-50 p-4 rounded-xl font-black text-indigo-600 outline-none focus:border-indigo-200 transition-all"
                    />
                    <div className="bg-indigo-600 text-white px-6 py-4 rounded-xl font-black text-sm whitespace-nowrap">
                       Total: {(formData.perQuestionMark * questionsCount).toFixed(0)} Pts
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-[0.97] flex items-center justify-center gap-3"
          >
            {updating ? <LuLoader className="animate-spin" /> : <LuSave size={20} />}
            {updating ? 'updating assessment...' : 'SAVE ASSESSMENT CHANGES'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditExamPage;
