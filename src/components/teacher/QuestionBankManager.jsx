'use client';

import { useState, useEffect } from 'react';
import { examAPI } from '@/lib/examAPI';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function QuestionBankManager({ token }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBank, setExpandedBank] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBanks();
  }, [token]);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const data = await examAPI.getQuestionBanks(token);
      setBanks(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.subject) {
      toast.error('Name and subject are required');
      return;
    }

    try {
      if (editingId) {
        await examAPI.updateQuestionBank(editingId, formData, token);
        toast.success('Question bank updated successfully');
      } else {
        await examAPI.createQuestionBank(formData, token);
        toast.success('Question bank created successfully');
      }

      setFormData({ name: '', description: '', subject: '' });
      setEditingId(null);
      setShowForm(false);
      fetchBanks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (bankId) => {
    if (confirm('Are you sure you want to delete this question bank?')) {
      try {
        await examAPI.deleteQuestionBank(bankId, token);
        toast.success('Question bank deleted successfully');
        fetchBanks();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleEdit = (bank) => {
    setFormData({
      name: bank.name,
      description: bank.description,
      subject: bank.subject,
    });
    setEditingId(bank._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', subject: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading question banks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Question Banks</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-sm gap-2"
          >
            <FiPlus /> Create Bank
          </button>
        )}
      </div>

      {showForm && (
        <div className="card bg-base-200 p-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Question Bank' : 'Create Question Bank'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Bank Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Physics Unit 1"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Subject *</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Physics"
                className="input input-bordered w-full"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                placeholder="Bank description (optional)"
                className="textarea textarea-bordered w-full"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {banks.length === 0 ? (
          <div className="alert alert-info">
            <span>No question banks yet. Create one to get started!</span>
          </div>
        ) : (
          banks.map((bank) => (
            <div key={bank._id} className="card bg-base-100 border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{bank.name}</h3>
                    <p className="text-sm text-base-content/70">{bank.subject}</p>
                    {bank.description && (
                      <p className="text-sm mt-1">{bank.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-xs text-base-content/60">
                      <span>Questions: {bank.totalQuestions}</span>
                      <span>
                        Easy: {bank.difficulty.Easy} | Medium:{' '}
                        {bank.difficulty.Medium} | Hard: {bank.difficulty.Hard}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(bank)}
                      className="btn btn-ghost btn-xs"
                      title="Edit bank"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(bank._id)}
                      className="btn btn-ghost btn-xs text-error"
                      title="Delete bank"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedBank(
                          expandedBank === bank._id ? null : bank._id
                        )
                      }
                      className="btn btn-ghost btn-xs"
                    >
                      {expandedBank === bank._id ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                  </div>
                </div>

                {expandedBank === bank._id && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {bank.questions && bank.questions.length > 0 ? (
                      <div className="text-sm space-y-1">
                        <p className="font-semibold mb-2">Questions in this bank:</p>
                        {bank.questions.map((q, idx) => (
                          <div key={q._id} className="text-xs bg-base-200 p-2 rounded">
                            {idx + 1}. {q.questionText} <span className="badge badge-sm badge-neutral">{q.type}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-base-content/70">No questions in this bank yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
