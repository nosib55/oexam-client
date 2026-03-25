'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import {
  LuClock,
  LuPlay,
  LuCircleCheck,
  LuTriangleAlert,
  LuMaximize,
  LuChevronRight,
  LuChevronLeft,
  LuSend,
  LuLoader,
  LuTimer,
} from 'react-icons/lu';

export default function ExamHall() {
  const router = useRouter();
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Exam state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: answerText }
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    const localUser = JSON.parse(stored);
    setUser(localUser);
    fetchExam(localUser);
  }, []);

  const fetchExam = async (u) => {
    try {
      const res = await axios.get(`/api/student/exams/${id}?userId=${u._id || u.id}`);
      setExam(res.data);
      // Initialize timer if not already set (use duration from exam)
      // duration is in minutes
      setTimeLeft(res.data.duration * 60);

      // check if student has already submitted this exam
       try {
          const checkRes = await axios.get(`/api/student/results?userId=${u._id || u.id}`);
          if (checkRes.data.some(r => r.exam?._id === id)) {
             Swal.fire({
                icon: 'info',
                title: 'Assessment Complete',
                text: 'You have already submitted this exam.',
                confirmButtonText: 'View Result',
             }).then(() => router.push('/dashboard/student/my_result'));
             return;
          }
       } catch(_) {}

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load exam. Access denied.');
      Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: err.response?.data?.error || 'Access to this exam hall is unauthorized or currently unavailable.',
          confirmButtonText: 'Go Back',
      }).then(() => router.push('/dashboard/student/my_exam'));
    } finally {
      setLoading(false);
    }
  };

  // Timer logic
  useEffect(() => {
    if (!loading && timeLeft > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            // Auto submit
            autoSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, timeLeft, isSubmitting]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQuestion = exam?.questions ? exam.questions[currentIdx] : null;
  
  const resolveOptions = (q) => {
    if (!q) return [];
    if (q.type === 'True/False') return ['True', 'False'];
    if (q.options && q.options.length > 0) {
       // Filter out empty strings if it's MCQ but keep at least 2? No, let's keep all if they are present
       return q.options.filter(o => o !== '') || [];
    }
    return [];
  };

  const currentOptions = resolveOptions(currentQuestion);

  const handleAnswerChange = (qId, ans) => {
    setAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const autoSubmit = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Time is up!',
      text: 'Your exam is being automatically submitted now.',
      timer: 2000,
      showConfirmButton: false,
    });
    handleExamSubmit(true);
  };

  const handleExamSubmit = async (silent = false) => {
    if (!silent) {
       const confirm = await Swal.fire({
           icon: 'question',
           title: 'Ready for Review?',
           text: `You have answered ${Object.keys(answers).length} of ${exam.questions?.length} items. Do you want to finalize now?`,
           showCancelButton: true,
           confirmButtonText: 'Yes, Submit Final',
           cancelButtonText: 'Let me double check',
           confirmButtonColor: '#10b981',
           cancelButtonColor: '#fef2f2',
       });
       if (!confirm.isConfirmed) return;
    }

    try {
      setIsSubmitting(true);
      const studentId = user._id || user.id;

      // Prepare a clean list of questions for the API, even if simple.
      // API expects questions to process (insecure for prod but for this draft)
      const examData = {
          questions: exam.questions.map(q => ({
             id: q._id,
             type: q.type,
             marks: q.marks || 1,
             // Note: In real setup, we get correct answers from DB on POST
             correctAnswer: q.correctAnswer // Currently sending it if it came from API, will fix API if it's missing
          }))
      };

      const res = await axios.post('/api/student/submit-exam', {
         studentId,
         examId: id,
         studentAnswers: answers,
         examData: examData
      });

      if (res.status === 201) {
         Swal.fire({
            icon: 'success',
            title: 'Exam Submitted!',
            text: 'Your hard work is safe! Redirecting to results page...',
            timer: 3000,
            showConfirmButton: false,
         });
         router.push('/dashboard/student/my_result');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Submission failed. Please try again or contact support.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
     <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-8 gap-6">
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold tracking-widest uppercase">Opening Personal Exam Hall...</p>
     </div>
  );

  if (error) return (
     <div className="h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md bg-white p-12 rounded-[3.5rem] shadow-xl border border-red-50">
           <LuTriangleAlert size={64} className="text-red-500 mx-auto mb-6" />
           <h1 className="text-2xl font-black text-slate-800">403 Unauthorized</h1>
           <p className="text-slate-500 font-bold mt-4">{error}</p>
           <button onClick={() => router.push('/dashboard/student/my_exam')} className="mt-8 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20">Go Back</button>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16 flex flex-col">
       {/* EXAM HALL HEADER */}
       <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="bg-primary/5 p-3 rounded-2xl text-primary">
                   <LuPlay size={24} />
                </div>
                <div>
                   <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">{exam.title}</h1>
                   <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">HALL ID: {exam._id?.slice(-8)} · {exam.subject}</p>
                </div>
             </div>

             <div className="flex items-center gap-6">
                {/* Timer Display */}
                <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-black text-xl transition-all shadow-sm ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-800'}`}>
                   <LuTimer className={timeLeft < 300 ? 'text-red-500' : 'text-primary'} />
                   <span>{formatTime(timeLeft)}</span>
                </div>
                <button onClick={() => handleExamSubmit()} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 active:scale-95">
                   <LuSend size={18} /> Finish Assessment
                </button>
             </div>
          </div>
       </header>

       <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* QUESTION NAVIGATION (Side) */}
          <aside className="lg:col-span-1 space-y-6 flex flex-col h-fit sticky top-28">
             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Assessment Grid</h3>
                <div className="grid grid-cols-5 gap-3">
                   {exam.questions?.map((q, i) => (
                      <button 
                         key={q._id} 
                         onClick={() => setCurrentIdx(i)}
                         className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all border-2 ${
                            currentIdx === i ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' :
                            answers[q._id] ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                            'bg-slate-50 border-slate-100 text-slate-400 hover:border-primary/20 hover:text-primary'
                         }`}>
                         {i + 1}
                      </button>
                   ))}
                </div>
             </div>

             <div className="p-6 bg-slate-800 rounded-[2.5rem] text-white shadow-xl">
                <LuMaximize size={24} className="mb-4 text-primary opacity-80" />
                <h4 className="text-base font-black">Focus Mode</h4>
                <p className="text-[10px] font-bold text-white/50 tracking-wide mt-2 leading-relaxed">Ensure you are in a quiet environment. Your progress is saved as you answer. Don't refresh the page.</p>
             </div>
          </aside>

          {/* MAIN QUESTION CARD */}
          <div className="lg:col-span-3 space-y-6">
             {currentQuestion ? (
                <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm min-h-[500px] flex flex-col justify-between relative overflow-hidden">
                   
                   <div className="absolute top-0 right-0 p-8">
                      <span className="text-xs font-black text-slate-200 uppercase tracking-widest">Question {currentIdx + 1} / {exam.questions.length}</span>
                   </div>

                   <div className="space-y-10">
                      <div className="space-y-4">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${
                            currentQuestion.type === 'MCQ' ? 'bg-blue-50 text-blue-600' : 
                            currentQuestion.type === 'Written' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                         }`}>
                            {currentQuestion.type} Assessment · {currentQuestion.marks || 1} Points
                         </span>
                         <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                            {currentQuestion.questionText}
                         </h2>
                      </div>

                      {/* ANSWERS INPUT */}
                      {currentQuestion.type === 'MCQ' || currentQuestion.type === 'True/False' ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentOptions.map((opt, i) => (
                               <button 
                                  key={i}
                                  onClick={() => handleAnswerChange(currentQuestion._id, i)}
                                  className={`p-6 rounded-3xl text-left font-bold transition-all border-2 flex items-center justify-between group ${
                                     answers[currentQuestion._id] === i 
                                     ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                                     : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                                  }`}>
                                  <span>{opt}</span>
                                  <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                                     answers[currentQuestion._id] === i ? 'border-primary bg-primary text-white' : 'border-slate-200'
                                  }`}>
                                     {answers[currentQuestion._id] === i && <LuCircleCheck size={14} />}
                                  </div>
                               </button>
                            ))}
                         </div>
                      ) : (
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 select-none uppercase tracking-widest ml-1">Type your response below</label>
                            <textarea
                               value={answers[currentQuestion._id] || ''}
                               onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                               className="w-full h-48 bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg leading-relaxed placeholder:text-slate-300"
                               placeholder="Start writing your answer here..."
                            ></textarea>
                         </div>
                      )}
                   </div>

                   {/* BOTTOM NAVIGATION */}
                   <div className="pt-12 flex justify-between gap-4 mt-auto">
                      <button 
                         disabled={currentIdx === 0}
                         onClick={() => setCurrentIdx(prev => prev - 1)}
                         className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
                            currentIdx === 0 ? 'opacity-20 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                         }`}>
                         <LuChevronLeft size={20} /> Preview Question
                      </button>

                      {currentIdx === exam.questions.length - 1 ? (
                         <button onClick={() => handleExamSubmit()} className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-600 transition-all">
                             Submit Final Assessment <LuSend size={20} />
                         </button>
                      ) : (
                        <button 
                           onClick={() => setCurrentIdx(prev => prev + 1)}
                           className="px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 flex items-center gap-2 hover:translate-x-1 transition-all">
                           Next Question <LuChevronRight size={20} />
                        </button>
                      )}
                   </div>
                </div>
             ) : (
                <div className="bg-white p-12 rounded-[3rem] text-center border">
                   <LuLoader size={48} className="animate-spin text-primary/30 mx-auto mb-6" />
                   <p className="font-bold text-slate-400 uppercase tracking-widest">Constructing Assessment Scene...</p>
                </div>
             )}
          </div>
       </main>
    </div>
  );
}
