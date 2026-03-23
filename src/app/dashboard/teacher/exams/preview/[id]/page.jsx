'use client';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LuArrowLeft,
  LuClock,
  LuBookOpen,
  LuLoader,
  LuCircleCheck,
  LuInfo,
  LuPlay,
  LuSquare,
  LuCircleX,
} from 'react-icons/lu';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ExamPreview = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const id = params.id;
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [myQuestions, setMyQuestions] = useState([]);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(`/api/teacher/exams/${id}`);
        setExam(res.data);
        if (res.data?.subject) {
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
    setQuestionsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?._id || storedUser?.id;

      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      const res = await axios.get(
        `/api/teacher/question-bank?userId=${userId}&subject=${selectedSubject || ''}`,
      );
      setMyQuestions(res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('Failed to load questions library');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // update exam status
  const updateExamStatus = async (newStatus, confirmMsg) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: confirmMsg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'running' ? '#10b981' : '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${newStatus} it!`,
    });

    if (result.isConfirmed) {
      try {
        const updateData = { status: newStatus };
        if (newStatus === 'running') updateData.startTime = new Date();
        if (newStatus === 'closed') updateData.endTime = new Date();

        const res = await axios.patch(`/api/teacher/exams/${id}`, updateData);
        setExam(res.data);
        Swal.fire('Updated!', `Exam is now ${newStatus}.`, 'success');
        if (newStatus === 'published') router.push('/dashboard/teacher/exams');
      } catch (err) {
        console.error('Update Error:', err.response?.data || err.message);
        toast.error(`Failed to ${newStatus}`);
      }
    }
  };

  const renderQuestionBody = q => {
    if (q.type === 'MCQ' || q.type === 'True/False') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {q.options?.map((opt, i) => {
            const isCorrect =
              q.correctAnswer === i || String(q.correctAnswer) === String(opt);
            return (
              <div
                key={i}
                className={`relative p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-white border-slate-200 text-slate-500 shadow-sm'
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

    if (q.type === 'Written') {
      return (
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Student Input Field
            </p>
            <div className="text-slate-300 italic text-xs">
              Standard response area enabled...
            </div>
          </div>
          {q.correctAnswer && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-[10px] font-black text-amber-600 uppercase mb-1 flex items-center gap-1">
                <LuInfo size={10} /> Reference Answer:
              </p>
              <p className="text-sm text-amber-900 font-medium">
                {q.correctAnswer}
              </p>
            </div>
          )}
        </div>
      );
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <LuLoader className="animate-spin text-primary" size={40} />
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            Generating Preview...
          </p>
        </div>
      </div>
    );

  if (!exam)
    return (
      <div className="text-center p-20 font-bold text-red-500">
        Assessment not found!
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all font-black uppercase text-[10px] tracking-widest group"
        >
          <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />{' '}
          Back to Dashboard
        </button>
        <span
          className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
            exam.status === 'Running'
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'bg-primary/10 text-primary'
          }`}
        >
          {exam.status || 'Draft'}
        </span>
      </div>

      <div className="bg-white p-6 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-10 -mt-10" />

        <header className="relative space-y-6 mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            {exam.examName || exam.title}
          </h1>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <LuBookOpen className="text-primary" size={16} />
              <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">
                {exam.subject}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <LuClock className="text-primary" size={16} />
              <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">
                {exam.duration} Min
              </span>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
              <span className="text-xs font-black text-primary uppercase tracking-tighter">
                Total: {exam.totalMarks} Marks
              </span>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              Question Paper
            </h3>
            <span className="bg-slate-800 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">
              Items: {myQuestions.length}
            </span>
          </div>

          {questionsLoading ? (
            <div className="py-20 text-center space-y-3">
              <LuLoader
                className="animate-spin mx-auto text-slate-300"
                size={30}
              />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Fetching Subject Questions...
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {myQuestions.map((q, index) => (
                <div
                  key={q._id}
                  className="group relative p-8 bg-white hover:bg-slate-50/30 transition-all duration-300 rounded-[2rem] border border-slate-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[8px] font-black rounded-md uppercase tracking-tighter">
                        {q.type}
                      </span>
                      <span
                        className={`px-2 py-1 text-[8px] font-black rounded-md uppercase tracking-tighter ${
                          q.difficulty === 'Hard'
                            ? 'bg-red-50 text-red-500'
                            : 'bg-emerald-50 text-emerald-500'
                        }`}
                      >
                        {q.difficulty || 'Easy'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                      +{exam.markPerQuestion || q.marks || 1} Marks
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-xl leading-relaxed">
                    <span className="text-primary/40 mr-2">#{index + 1}</span>
                    {q.questionText}
                  </p>
                  {renderQuestionBody(q)}
                </div>
              ))}
            </div>
          )}

          {!questionsLoading && myQuestions.length === 0 && (
            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <LuBookOpen className="text-slate-300" size={24} />
              </div>
              <p className="text-slate-400 font-bold text-sm">
                No questions found for{' '}
                <span className="text-slate-600">"{exam.subject}"</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-wrap justify-center gap-4 pb-10">
        {/* Publish Button */}
        {(!exam.status || exam.status.toLowerCase() === 'draft') && (
          <button
            onClick={() =>
              updateExamStatus(
                'published',
                'Once published, students can see this exam!',
              )
            }
            className="bg-slate-800 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-primary transition-all active:scale-95 flex items-center gap-2"
          >
            <LuCircleCheck size={18} /> Publish Assessment
          </button>
        )}

        {/* Start Button */}
        {(exam.status === 'published' || exam.status === 'stopped') && (
          <button
            onClick={() =>
              updateExamStatus(
                'running',
                'This will make the exam LIVE for all students!',
              )
            }
            className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-500 transition-all active:scale-95 flex items-center gap-2"
          >
            <LuPlay size={18} /> Start Exam
          </button>
        )}

        {/* Stop/Pause Button */}
        {exam.status === 'running' && (
          <button
            onClick={() =>
              updateExamStatus(
                'stopped',
                'This will temporarily hide the exam from students.',
              )
            }
            className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2"
          >
            <LuSquare size={18} /> Stop Exam
          </button>
        )}

        {/* Close Button */}
        {(exam.status && exam.status !== 'closed' && exam.status.toLowerCase() !== 'draft') && (
          <button
            onClick={() =>
              updateExamStatus('closed', 'This will permanently end the exam.')
            }
            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-red-500 transition-all active:scale-95 flex items-center gap-2"
          >
            <LuCircleX size={18} /> Close Exam
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamPreview;
