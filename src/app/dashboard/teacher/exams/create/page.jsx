'use client';
import React, { useState, useEffect } from 'react';
import {
  LuSettings2,
  LuCalendar,
  LuClock,
  LuTarget,
  LuBookOpen,
  LuTimer,
  LuCalculator,
  LuListChecks,
  LuSchool,
} from 'react-icons/lu';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const NewExamSetup = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [questionBankId, setQuestionBankId] = useState('');
  const [questionBanks, setQuestionBanks] = useState([]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    examName: '',
    subject: '',
    duration: '',
    totalMarks: 100,
    examDate: '',
    examTime: '',
    negativeMarking: false,
    shuffleQuestions: false,
    manualMarking: false,
    perQuestionMark: 1
  });

  // each questions mark 
  const markPerQuestion = formData.manualMarking 
    ? formData.perQuestionMark 
    : (questionsCount > 0 ? (Number(formData.totalMarks) / questionsCount).toFixed(2) : 0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      const uid = storedUser?._id || storedUser?.id;
      fetchQuestionBanks(uid);
      fetchClasses(uid);
    }
  }, []);

  const fetchClasses = async (userId) => {
    try {
      const res = await axios.get(`/api/teacher/classes?userId=${userId}`);
      setClasses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const fetchQuestionBanks = async (userId) => {
    try {
      const res = await axios.get(`/api/teacher/question-bank/list?userId=${userId}`);
      setQuestionBanks(res.data || []);
    } catch (err) {
      console.error('Failed to fetch question banks:', err);
    }
  };

  // 
  useEffect(() => {
    const fetchQuestionCount = async () => {
      // If we have a bank selected, get its count. Otherwise try by subject (fallback)
      if (user) {
        try {
          let url = '';
          if (questionBankId) {
            // Updated count API logic might be needed if count only filters by subject
            // For now, if bank is selected, we might want to fetch that specific bank's count
            const selectedBank = questionBanks.find(b => b._id === questionBankId);
            if (selectedBank) {
              setQuestionsCount(selectedBank.questions?.length || 0);
              return;
            }
          }

          if (formData.subject) {
            const res = await axios.get(
              `/api/teacher/question-bank/count?subject=${formData.subject}&userId=${user._id || user.id}`,
            );
            setQuestionsCount(res.data.count || 0);
          }
        } catch (err) {
          console.error(
            'Count fetch failed:',
            err.response?.data || err.message,
          );
        }
      }
    };
    fetchQuestionCount();
  }, [formData.subject, questionBankId, user, questionBanks]);

  const handleSubmit = async () => {
    const { examName, duration, totalMarks, examDate, examTime, subject } =
      formData;

    if (
      !examName ||
      !duration ||
      !totalMarks ||
      !examDate ||
      !examTime ||
      !classId ||
      (!subject && !questionBankId)
    ) {
      return Swal.fire(
        'Missing Info',
        'Please fill all required fields including the class.',
        'warning',
      );
    }

    const finalTotalMarks = formData.manualMarking 
      ? (formData.perQuestionMark * questionsCount) 
      : formData.totalMarks;

    try {
      Swal.fire({
        title: 'Configuring Exam...',
        didOpen: () => Swal.showLoading(),
      });

      const res = await axios.post('/api/teacher/exams/create', {
        ...formData,
        totalMarks: finalTotalMarks,
        questionBankId,
        classId,
        markPerQuestion, 
        userId: user?._id || user?.id,
      });

      if (res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Exam Configured!',
          text: 'Settings saved. Redirecting to preview...',
          timer: 2000,
          showConfirmButton: false,
        });
        router.push(`/dashboard/teacher/exams/preview/${res.data.examId}`);
      }
    } catch (err) {
      Swal.fire(
        'Setup Failed',
        err.response?.data?.error || 'Could not save configuration',
        'error',
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-16 px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-2">
          <LuSettings2 size={28} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Setup New Assessment
        </h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
          Define exam structure & marking criteria
        </p>
      </div>

      <div className="bg-white p-6 md:p-12 rounded-[3rem] border border-slate-200/60 shadow-2xl space-y-10">
        {/*  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
            <LuTarget className="text-slate-400 mb-2" />
            <span className="text-[10px] font-black text-slate-400 uppercase">
              Total Weight
            </span>
            <p className="text-2xl font-black text-slate-800">
              {formData.totalMarks}
            </p>
          </div>
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex flex-col items-center text-center ring-2 ring-primary/5">
            <LuCalculator className="text-primary mb-2" />
            <span className="text-[10px] font-black text-primary uppercase">
              Mark Per Question
            </span>
            <p className="text-3xl font-black text-primary">
              {markPerQuestion}
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
            <LuBookOpen className="text-slate-400 mb-2" />
            <span className="text-[10px] font-black text-slate-400 uppercase">
              Bank Questions
            </span>
            <p className="text-2xl font-black text-slate-800">
              {questionsCount}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Exam Title
            </label>
            <input
              type="text"
              value={formData.examName}
              onChange={e =>
                setFormData({ ...formData, examName: e.target.value })
              }
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              placeholder="e.g. Science Monthly Assessment"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
              <LuSchool size={12} className="text-primary" /> Assign to Class
            </label>
            <select
              value={classId}
              onChange={e => setClassId(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select a class...</option>
              {classes.length === 0 && (
                <option disabled>No classes found — create one first</option>
              )}
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.level} — {cls.institution}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <LuCalendar size={12} className="text-primary" /> Exam Date
              </label>
              <input
                type="date"
                onChange={e =>
                  setFormData({ ...formData, examDate: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <LuClock size={12} className="text-primary" /> Start Time
              </label>
              <input
                type="time"
                onChange={e =>
                  setFormData({ ...formData, examTime: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Select Question Bank
              </label>
              <select
                value={questionBankId}
                onChange={e => {
                  const bankId = e.target.value;
                  setQuestionBankId(bankId);
                  const selectedBank = questionBanks.find(b => b._id === bankId);
                  if (selectedBank) {
                    setFormData({ ...formData, subject: selectedBank.subject });
                  }
                }}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              >
                <option value="">Choose a bank...</option>
                {questionBanks.map(bank => (
                  <option key={bank._id} value={bank._id}>
                    {bank.name} ({bank.subject})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Subject Area
              </label>
              <input
                type="text"
                placeholder="Physics, Chemistry..."
                value={formData.subject}
                onChange={e =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Total Exam Marks
              </label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={e =>
                  setFormData({ ...formData, totalMarks: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <LuTimer size={12} className="text-primary" /> Duration (Minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={e =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 transition-all"
              />
            </div>
          </div>

          {/* ৪. প্রতি প্রশ্নের মার্ক প্রিভিউ সেকশন */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-5">
            <div className="flex items-center gap-3 text-slate-800 font-black text-xs uppercase tracking-widest border-b border-slate-200 pb-4">
              <LuListChecks className="text-primary" /> Mark Distribution
              Preview
            </div>

            <div className="space-y-3">
              {questionsCount > 0 ? (
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Calculation
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {formData.totalMarks} Marks ÷ {questionsCount} Questions
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Per Question
                    </span>
                    <p className="text-lg font-black text-primary">
                      {markPerQuestion} pt
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs font-bold text-slate-400 italic text-center py-2">
                  Select a question bank to see mark distribution...
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex-1 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 font-bold text-sm text-slate-600 shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                <span>Negative Marking</span>
                <input
                  type="checkbox"
                  checked={formData.negativeMarking}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      negativeMarking: e.target.checked,
                    })
                  }
                  className="checkbox checkbox-primary rounded-lg"
                />
              </label>
              <label className="flex-1 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 font-bold text-sm text-slate-600 shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                <span>Shuffle Questions</span>
                <input
                  type="checkbox"
                  checked={formData.shuffleQuestions}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      shuffleQuestions: e.target.checked,
                    })
                  }
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
                  onChange={e =>
                    setFormData({
                      ...formData,
                      manualMarking: e.target.checked,
                    })
                  }
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
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-[0.97] flex items-center justify-center gap-3"
        >
          Confirm Configuration & Proceed
        </button>
      </div>
    </div>

  );
};

export default NewExamSetup;
