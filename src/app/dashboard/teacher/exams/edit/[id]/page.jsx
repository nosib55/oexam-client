'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LuSave, LuArrowLeft, LuLoader } from 'react-icons/lu';

const EditExamPage = () => {
  const { id } = useParams(); // id from url
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    scheduledAt: '',
    status: 'draft',
  });

  // load data
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const res = await axios.get(`/api/teacher/exams/${id}`);
        const data = res.data;
        // date formet type
        if (data.scheduledAt) {
          data.scheduledAt = new Date(data.scheduledAt)
            .toISOString()
            .slice(0, 16);
        }
        setFormData(data);
      } catch (error) {
        toast.error('Failed to load exam details');
        router.push('/dashboard/teacher/exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [id, router]);

  const handleSubmit = async e => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.patch(`/api/teacher/exams/${id}`, formData);
      toast.success('Exam updated successfully!');
      router.push('/dashboard/teacher/exams'); // after update navigate to exam list
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <LuLoader className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <LuArrowLeft /> Back to List
        </button>
        <h2 className="text-2xl font-black text-slate-800">Edit Exam</h2>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6"
      >
        <div>
          <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">
            Exam Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">
              Subject
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={e =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">
              Schedule Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.scheduledAt}
              onChange={e =>
                setFormData({ ...formData, scheduledAt: e.target.value })
              }
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">
            Publish Status
          </label>
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700 transition-all appearance-none"
          >
            <option value="draft">Draft (Private)</option>
            <option value="published">Published (Public)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
        >
          {updating ? (
            <LuLoader className="animate-spin" />
          ) : (
            <LuSave size={20} />
          )}
          {updating ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
};

export default EditExamPage;
