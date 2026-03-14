'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LuArrowLeft,
  LuClock,
  LuBookOpen,
  LuLoader,
  LuCircleCheck,
} from 'react-icons/lu';
import toast from 'react-hot-toast';

const ExamPreview = () => {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myQuestions, setMyQuestions] = useState([]);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(`/api/teacher/exams/preview/${id}`);
        setExam(res.data);
        if (res.data.subject) {
          loadQuestionsBySubject(res.data.subject);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load exam preview');
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [id]);

  const loadQuestionsBySubject = async selectedSubject => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || (!storedUser._id && !storedUser.id)) {
        console.error('User not found in localStorage');
        return;
      }
      const userId = storedUser._id || storedUser.id;
      const res = await axios.get(
        `/api/teacher/questions?userId=${userId}&subject=${selectedSubject || ''}`,
      );
      setMyQuestions(res.data);
    } catch (err) {
      console.error('Fetch Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Failed to load questions');
    }
  };

  // Helper function to render options or answer area based on type
  const renderQuestionBody = q => {
    // For MCQ and True/False
    if (q.type === 'MCQ' || q.type === 'True/False') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {q.options?.map((opt, i) => {
            const isCorrect = q.correctAnswer === i || q.correctAnswer === opt;
            return (
              <div
                key={i}
                className={`relative p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-white border-slate-200 text-slate-500'
                } text-sm font-bold`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                      isCorrect
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {q.type === 'MCQ'
                      ? String.fromCharCode(65 + i)
                      : i === 0
                        ? 'T'
                        : 'F'}
                  </span>
                  {opt}
                </span>
                {isCorrect && (
                  <LuCircleCheck className="text-emerald-500" size={18} />
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // For Written Questions
    if (q.type === 'Written') {
      return (
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Answer Space
            </p>
            <div className="h-20 w-full flex items-center justify-center text-slate-300 italic text-xs">
              Students will type their descriptive answer here...
            </div>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <p className="text-[10px] font-black text-amber-600 uppercase mb-1">
              Model Answer / Key Points:
            </p>
            <p className="text-sm text-amber-900 font-medium">
              {q.correctAnswer || 'No answer key provided.'}
            </p>
          </div>
        </div>
      );
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <LuLoader className="animate-spin text-primary" size={40} />
          <p className="text-slate-500 font-medium">Loading Exam Preview...</p>
        </div>
      </div>
    );

  if (!exam)
    return (
      <div className="text-center p-20 font-bold text-red-500">
        Exam not found!
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold group"
        >
          <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />{' '}
          Back
        </button>
        <div className="flex items-center gap-3">
          <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
            {exam.status}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight">
          {exam.title}
        </h1>

        <div className="flex flex-wrap gap-6 text-slate-500 text-sm font-bold uppercase tracking-widest">
          <span className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
            <LuBookOpen className="text-primary" size={18} /> {exam.subject}
          </span>
          <span className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
            <LuClock className="text-primary" size={18} /> {exam.duration}{' '}
            Minutes
          </span>
        </div>

        <hr className="my-10 border-slate-100" />

        <div className="space-y-10">
          <h3 className="text-xl font-black text-slate-700 flex items-center gap-2">
            Questions{' '}
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md text-sm">
              {myQuestions.length}
            </span>
          </h3>

          <div className="grid gap-6">
            {myQuestions.map((q, index) => (
              <div
                key={q._id}
                className="group p-6 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-primary/20 transition-all duration-300 rounded-2xl border border-slate-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-primary text-[9px] text-white font-black rounded uppercase">
                      {q.type}
                    </span>
                    <span className="text-[9px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">
                      {q.difficulty || 'Easy'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-lg">
                    {q.marks || 1} Marks
                  </span>
                </div>

                <p className="font-bold text-slate-800 text-lg">
                  <span className="text-primary mr-2">Q{index + 1}.</span>{' '}
                  {q.questionText}
                </p>

                {/* Dynamic Content based on Type */}
                {renderQuestionBody(q)}
              </div>
            ))}
          </div>

          {myQuestions.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold italic">
                No questions found for this subject in your library.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPreview;
