'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaPenFancy,
} from 'react-icons/fa';

export default function ReviewScript() {
  const { id } = useParams(); // Result ID
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`/api/teacher/results/${id}`);
        setResult(res.data);
      } catch (error) {
        toast.error('Failed to load script');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  // to upading marks
  const handleMarkUpdate = (index, newMark) => {
    const updatedAnswers = [...result.answers];
    updatedAnswers[index].marksObtained = Number(newMark);
    setResult({ ...result, answers: updatedAnswers });
  };

  const saveVerification = async () => {
    setUpdating(true);
    try {
      // repeat calculate of total marks
      const finalTotal = result.answers.reduce(
        (acc, curr) => acc + curr.marksObtained,
        0,
      );

      await axios.put(`/api/teacher/results/${id}`, {
        answers: result.answers,
        totalMarks: finalTotal,
        isVerified: true,
      });

      toast.success('Script verified successfully!');
      router.push('/dashboard/teacher/results');
    } catch (error) {
      toast.error('Failed to save changes');
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

  if (!result) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Script details not found</p>
          <button onClick={() => router.back()} className="text-primary font-black text-xs uppercase hover:underline tracking-widest">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-all"
        >
          <FaArrowLeft /> Back to List
        </button>
        <span
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${result.isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}
        >
          {result.isVerified ? 'Verified' : 'Pending Review'}
        </span>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
        <h1 className="text-3xl font-black text-slate-800">
          {result.studentName}
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">
          {result.examName}
        </p>
      </div>

      {/* Answers List */}
      <div className="space-y-6">
        {result.answers.map((ans, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <span className="bg-slate-50 px-3 py-1 rounded-lg text-[10px] font-black text-slate-400 uppercase">
                Question {index + 1} ({ans.questionType})
              </span>
              {ans.isCorrect ? (
                <FaCheckCircle className="text-emerald-500" />
              ) : (
                <FaTimesCircle className="text-rose-500" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Student&apos;s Answer:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 text-slate-700 font-medium">
                {ans.studentAnswer || (
                  <span className="italic text-slate-300">
                    No answer provided
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Correct Answer:
                </p>
                <p className="text-sm font-bold text-emerald-600">
                  {ans.correctAnswer}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Assign Marks:
                </p>
                <input
                  type="number"
                  value={ans.marksObtained}
                  onChange={e => handleMarkUpdate(index, e.target.value)}
                  className="w-20 p-2 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary text-center font-bold text-slate-700"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <button
          onClick={saveVerification}
          disabled={updating}
          className="w-full bg-primary text-white h-16 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {updating ? <span className="animate-spin">⌛</span> : <FaSave />}
          <span>
            {result.isVerified ? 'Update Review' : 'Verify & Complete'}
          </span>
        </button>
      </div>
    </div>
  );
}
