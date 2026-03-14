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
} from 'react-icons/lu';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const NewExamSetup = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [formData, setFormData] = useState({
    examName: '',
    subject: '',
    duration: '',
    totalMarks: 100,
    examDate: '',
    examTime: '',
    negativeMarking: false,
    shuffleQuestions: false,
  });

  // auto mark calculation logic
  const markPerQuestion =
    questionsCount > 0
      ? (Number(formData.totalMarks) / questionsCount).toFixed(2)
      : 0;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  // 
  useEffect(() => {
    const fetchQuestionCount = async () => {
      if (formData.subject && user) {
        try {
          const res = await axios.get(
            `/api/teacher/questions/count?subject=${formData.subject}&userId=${user._id || user.id}`,
          );
          setQuestionsCount(res.data.count || 0);
        } catch (err) {
          console.error(
            'Count fetch failed:',
            err.response?.data || err.message,
          );
        }
      }
    };
    fetchQuestionCount();
  }, [formData.subject, user]);

  const handleSubmit = async () => {
    const { examName, duration, totalMarks, examDate, examTime, subject } =
      formData;

    if (
      !examName ||
      !duration ||
      !totalMarks ||
      !examDate ||
      !examTime ||
      !subject
    ) {
      return Swal.fire(
        'Missing Info',
        'Please fill all required fields to proceed.',
        'warning',
      );
    }

    try {
      Swal.fire({
        title: 'Configuring Exam...',
        didOpen: () => Swal.showLoading(),
      });

      const res = await axios.post('/api/teacher/exams/create', {
        ...formData,
        markPerQuestion, 
        userId: user?._id || user?.id,
      });

      if (res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Exam Configured!',
          text: 'Settings saved. Redirecting to question setup...',
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
      {/* Header Section */}
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

      <div className="bg-white p-6 md:p-12 rounded-[3rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 space-y-10">
        {/* Dynamic Marking Indicator Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
            <LuTarget className="text-slate-400 mb-2" />
            <span className="text-[10px] font-black text-slate-400 uppercase">
              Total Weight
            </span>
            <p className="text-2xl font-black text-slate-800">
              {formData.totalMarks}
            </p>
          </div>
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex flex-col items-center justify-center text-center ring-2 ring-primary/5">
            <LuCalculator className="text-primary mb-2" />
            <span className="text-[10px] font-black text-primary uppercase">
              Mark Per Question
            </span>
            <p className="text-3xl font-black text-primary">
              {markPerQuestion}
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
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
          {/* Exam Title */}
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

          {/* Date & Time Row */}
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

          {/* Subject & Marks Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="100"
              />
            </div>
          </div>

          {/* Duration */}
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
              placeholder="e.g. 60"
            />
          </div>

          {/* Advanced Rules Section */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-5">
            <div className="flex items-center gap-3 text-slate-800 font-black text-xs uppercase tracking-widest border-b border-slate-200 pb-4">
              <LuSettings2 className="text-primary" /> Advanced Examination
              Rules
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
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
