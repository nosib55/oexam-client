'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaSave,
  FaRegLightbulb,
  FaCheckCircle,
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function EditQuestionPage() {
  const params = useParams(); //id from url
  const id = params?.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [questionData, setQuestionData] = useState({
    statement: '',
    subject: 'ICT',
    difficulty: 'Easy',
    marks: 1,
    type: 'MCQ',
    correctAnswer: 0,
  });

  const [options, setOptions] = useState(['', '', '', '']);

  // ================= FETCH EXISTING DATA =================
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/api/teacher/questions/${id}`);
        const data = res.data;

        //
        setQuestionData({
          statement: data.questionText,
          subject: data.subject,
          difficulty: data.difficulty,
          marks: data.marks,
          type: data.type,
          correctAnswer: data.correctAnswer,
        });
        setOptions(data.options);
      } catch (error) {
        toast.error('Failed to load question data');
        router.push('/dashboard/teacher/questions');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuestion();
  }, [id, router]);

  // ================= HANDLERS =================
  const handleTypeChange = type => {
    setQuestionData({ ...questionData, type });
    if (type === 'True/False') {
      setOptions(['True', 'False']);
      setQuestionData(prev => ({ ...prev, correctAnswer: 0 }));
    } else if (type === 'MCQ' && options.length !== 4) {
      setOptions(['', '', '', '']);
    }
  };

  const handleUpdate = async () => {
    const toastId = toast.loading('Updating question...');
    try {
      const payload = {
        questionText: questionData.statement,
        subject: questionData.subject,
        difficulty: questionData.difficulty,
        marks: Number(questionData.marks),
        type: questionData.type,
        correctAnswer: questionData.correctAnswer,
        options: options,
      };

      await axios.patch(`/api/teacher/questions/${id}`, payload);
      toast.success('Question updated!', { id: toastId });
      router.push('/dashboard/teacher/questions');
    } catch (error) {
      toast.error('Update failed', { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-slate-300">
        LOADING QUESTION...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20 p-4 lg:p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/teacher/questions"
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Edit Question
            </h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
              Update your database entry
            </p>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg flex items-center gap-2 active:scale-95"
        >
          <FaSave size={16} />
          <span>Update Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            {/* Question Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Question Statement
              </label>
              <textarea
                value={questionData.statement}
                onChange={e =>
                  setQuestionData({
                    ...questionData,
                    statement: e.target.value,
                  })
                }
                className="w-full p-5 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 min-h-[120px] font-bold text-slate-700 transition-all shadow-inner"
              />
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subject
                </label>
                <select
                  value={questionData.subject}
                  onChange={e =>
                    setQuestionData({
                      ...questionData,
                      subject: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm"
                >
                  <option>ICT</option>
                  <option>Math</option>
                  <option>Physics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Difficulty
                </label>
                <select
                  value={questionData.difficulty}
                  onChange={e =>
                    setQuestionData({
                      ...questionData,
                      difficulty: e.target.value,
                    })
                  }
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Marks
                </label>
                <input
                  type="number"
                  value={questionData.marks}
                  onChange={e =>
                    setQuestionData({ ...questionData, marks: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 text-sm"
                />
              </div>
            </div>

            {/* Type Switcher */}
            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Question Type
              </label>
              <div className="flex p-1.5 bg-slate-50 rounded-2xl w-fit">
                {['MCQ', 'True/False', 'Written'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      questionData.type === type
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Options Section */}
            {(questionData.type === 'MCQ' ||
              questionData.type === 'True/False') && (
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="grid gap-3">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setQuestionData({ ...questionData, correctAnswer: i })
                        }
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                          questionData.correctAnswer === i
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {questionData.correctAnswer === i ? (
                          <FaCheckCircle size={16} />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const newOpts = [...options];
                          newOpts[i] = e.target.value;
                          setOptions(newOpts);
                        }}
                        disabled={questionData.type === 'True/False'}
                        className={`flex-1 p-4 rounded-2xl border-none text-sm font-bold ${
                          questionData.correctAnswer === i
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                <FaRegLightbulb size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight">
                Editing Mode
              </h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase">
                You are modifying an existing question. Changes will reflect
                across all exams using this question.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
