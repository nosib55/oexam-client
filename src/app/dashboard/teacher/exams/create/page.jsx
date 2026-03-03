import React from 'react';
import { LuSettings2 } from 'react-icons/lu';

const NewExamSetup = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 my-24">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800">Create New Exam</h2>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          Configure your assessment settings
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-xl space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Exam Title
            </label>
            <input
              type="text"
              placeholder="e.g. Advanced Chemistry Final"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-xs">
                Subject
              </label>
              <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-600 appearance-none">
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                placeholder="60"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-primary font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-4">
            <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest">
              <LuSettings2 /> Exam Rules
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />{' '}
                Negative Marking
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />{' '}
                Shuffle Questions
              </label>
            </div>
          </div>
        </div>

        <button className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
          Confirm & Set Questions
        </button>
      </div>
    </div>
  );
};

export default NewExamSetup;
