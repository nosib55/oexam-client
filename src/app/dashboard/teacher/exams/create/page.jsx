'use client';
import React, { useState, useEffect } from 'react';
import { LuSettings2, LuCalendar, LuClock } from 'react-icons/lu'; 
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const NewExamSetup = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    examName: '',
    subject: 'Mathematics',
    duration: '',
    totalMarks: '',
    examDate: '', 
    examTime: '', 
    negativeMarking: false,
    shuffleQuestions: false,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSubmit = async () => {
    if (
      !formData.examName ||
      !formData.duration ||
      !formData.totalMarks ||
      !formData.examDate ||
      !formData.examTime
    ) {
      return Swal.fire(
        'Error',
        'Please fill all required fields including Date and Time',
        'error',
      );
    }

    try {
      Swal.fire({
        title: 'Configuring Exam...',
        didOpen: () => Swal.showLoading(),
      });

      const res = await axios.post('/api/teacher/exams/create', {
        ...formData,
        userId: user?._id || user?.id,
      });

      if (res.status === 201) {
        Swal.fire(
          'Success!',
          'Configuration saved. Now set your questions.',
          'success',
        );
        router.push(`/dashboard/teacher/examList/${res.data.examId}`);
      }
    } catch (err) {
      Swal.fire(
        'Error',
        err.response?.data?.error || 'Something went wrong!',
        'error',
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 my-16 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800">Create New Exam</h2>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          Configure your assessment settings
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-xl space-y-8">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Exam Title
            </label>
            <input
              type="text"
              onChange={e =>
                setFormData({ ...formData, examName: e.target.value })
              }
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-700"
              placeholder="e.g. Mid Term Exam"
            />
          </div>

          {/* Date and Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <LuCalendar size={12} /> Exam Date
              </label>
              <input
                type="date"
                onChange={e =>
                  setFormData({ ...formData, examDate: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <LuClock size={12} /> Start Time
              </label>
              <input
                type="time"
                onChange={e =>
                  setFormData({ ...formData, examTime: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Subject
              </label>
              <select
                onChange={e =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-600 appearance-none"
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Total Marks
              </label>
              <input
                type="number"
                onChange={e =>
                  setFormData({ ...formData, totalMarks: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-700"
                placeholder="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              onChange={e =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-700"
              placeholder="60"
            />
          </div>

          {/* Rules */}
          <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-4">
            <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest">
              <LuSettings2 /> Advanced Rules
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 shadow-sm hover:border-primary/30 transition-all">
                <input
                  type="checkbox"
                  onChange={e =>
                    setFormData({
                      ...formData,
                      negativeMarking: e.target.checked,
                    })
                  }
                  className="checkbox checkbox-primary checkbox-sm"
                />{' '}
                Negative Marking
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 shadow-sm hover:border-primary/30 transition-all">
                <input
                  type="checkbox"
                  onChange={e =>
                    setFormData({
                      ...formData,
                      shuffleQuestions: e.target.checked,
                    })
                  }
                  className="checkbox checkbox-primary checkbox-sm"
                />{' '}
                Shuffle Questions
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          Confirm & Set Questions
        </button>
      </div>
    </div>
  );
};

export default NewExamSetup;
