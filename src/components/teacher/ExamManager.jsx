'use client';

import { useState, useEffect } from 'react';
import { examAPI } from '@/lib/examAPI';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPlay,
  FiSquare,
  FiEye,
  FiEyeOff,
  FiX,
} from 'react-icons/fi';

export default function ExamManager({ token }) {
  const [exams, setExams] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 60,
    totalMarks: 100,
    questionBankId: '',
    questionIds: [],
    scheduledAt: '',
    autoStart: false,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsData, banksData] = await Promise.all([
        examAPI.getExams(token),
        examAPI.getQuestionBanks(token),
      ]);
      setExams(examsData);
      setBanks(banksData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBankSelect = (bankId) => {
    setFormData({ ...formData, questionBankId: bankId, questionIds: [] });
    const bank = banks.find((b) => b._id === bankId);
    if (bank) {
      setBankQuestions(bank.questions || []);
      setSelectedBank(bankId);
    }
  };

  const toggleQuestion = (questionId) => {
    const currentIds = formData.questionIds;
    if (currentIds.includes(questionId)) {
      setFormData({
        ...formData,
        questionIds: currentIds.filter((id) => id !== questionId),
      });
    } else {
      setFormData({
        ...formData,
        questionIds: [...currentIds, questionId],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.subject ||
      !formData.questionBankId ||
      formData.questionIds.length === 0
    ) {
      toast.error('Please fill all required fields and select at least one question');
      return;
    }

    try {
      const submitData = {
        ...formData,
        questionIds:
          formData.questionIds.length === bankQuestions.length
            ? undefined
            : formData.questionIds,
      };

      if (editingId) {
        await examAPI.updateExam(editingId, submitData, token);
        toast.success('Exam updated successfully');
      } else {
        await examAPI.createExam(submitData, token);
        toast.success('Exam created successfully');
      }

      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      duration: 60,
      totalMarks: 100,
      questionBankId: '',
      questionIds: [],
      scheduledAt: '',
      autoStart: false,
    });
    setEditingId(null);
    setShowForm(false);
    setSelectedBank(null);
    setBankQuestions([]);
  };

  const handleDelete = async (examId) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        await examAPI.deleteExam(examId, token);
        toast.success('Exam deleted successfully');
        fetchData();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleStartExam = async (examId) => {
    try {
      await examAPI.startExam(examId, token);
      toast.success('Exam started successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStopExam = async (examId) => {
    try {
      await examAPI.stopExam(examId, token);
      toast.success('Exam stopped successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePublishResults = async (examId) => {
    try {
      await examAPI.publishExam(examId, token);
      toast.success('Results published successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnpublishResults = async (examId) => {
    try {
      await examAPI.unpublishExam(examId, token);
      toast.success('Results unpublished successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCloseExam = async (examId) => {
    try {
      await examAPI.closeExam(examId, token);
      toast.success('Exam closed successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      draft: 'badge-info',
      scheduled: 'badge-warning',
      running: 'badge-success',
      stopped: 'badge-error',
      published: 'badge-success',
      unpublished: 'badge-neutral',
      closed: 'badge-neutral',
    };
    return colors[status] || 'badge-neutral';
  };

  if (loading) {
    return <div className="text-center py-8">Loading exams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Exams</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-sm gap-2"
          >
            <FiPlus /> Create Exam
          </button>
        )}
      </div>

      {showForm && (
        <div className="card bg-base-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {editingId ? 'Edit Exam' : 'Create Exam'}
            </h3>
            <button
              onClick={resetForm}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Exam Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Physics Midterm"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
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
                  <span className="label-text">Duration (minutes) *</span>
                </label>
                <input
                  type="number"
                  placeholder="60"
                  className="input input-bordered w-full"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Total Marks *</span>
                </label>
                <input
                  type="number"
                  placeholder="100"
                  className="input input-bordered w-full"
                  value={formData.totalMarks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalMarks: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Question Bank *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.questionBankId}
                  onChange={(e) => handleBankSelect(e.target.value)}
                >
                  <option value="">Select a question bank</option>
                  {banks.map((bank) => (
                    <option key={bank._id} value={bank._id}>
                      {bank.name} ({bank.totalQuestions} questions)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Scheduled Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full"
                  value={formData.scheduledAt}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledAt: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                placeholder="Exam description (optional)"
                className="textarea textarea-bordered w-full"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Auto-start at scheduled time</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={formData.autoStart}
                  onChange={(e) =>
                    setFormData({ ...formData, autoStart: e.target.checked })
                  }
                />
              </label>
            </div>

            {bankQuestions.length > 0 && (
              <div>
                <label className="label">
                  <span className="label-text">
                    Select Questions ({formData.questionIds.length}/
                    {bankQuestions.length})
                  </span>
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 p-2 border border-base-300 rounded">
                  {bankQuestions.map((question) => (
                    <label
                      key={question._id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={formData.questionIds.includes(question._id)}
                        onChange={() => toggleQuestion(question._id)}
                      />
                      <span className="text-sm flex-1">
                        {question.questionText}
                      </span>
                      <span className="badge badge-sm badge-neutral">
                        {question.type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm">
                {editingId ? 'Update' : 'Create'} Exam
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {exams.length === 0 ? (
          <div className="alert alert-info">
            <span>No exams yet. Create one to get started!</span>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam._id} className="card bg-base-100 border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{exam.title}</h3>
                      <span className={`badge ${getStatusBadgeColor(exam.status)}`}>
                        {exam.status}
                      </span>
                      {exam.resultsPublished && (
                        <span className="badge badge-primary">Results Published</span>
                      )}
                    </div>
                    <p className="text-sm text-base-content/70">{exam.subject}</p>
                    {exam.description && (
                      <p className="text-sm mt-1">{exam.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-xs text-base-content/60">
                      <span>Duration: {exam.duration} min</span>
                      <span>Total Marks: {exam.totalMarks}</span>
                      <span>
                        Mark/Q: {(exam.markPerQuestion || 0).toFixed(2)}
                      </span>
                      <span>Questions: {exam.questions?.length}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap justify-end">
                    {exam.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleStartExam(exam._id)}
                          className="btn btn-success btn-xs gap-1"
                          title="Start exam"
                        >
                          <FiPlay size={14} /> Start
                        </button>
                      </>
                    )}

                    {exam.status === 'running' && (
                      <button
                        onClick={() => handleStopExam(exam._id)}
                        className="btn btn-error btn-xs gap-1"
                        title="Stop exam"
                      >
                        <FiSquare size={14} /> Stop
                      </button>
                    )}

                    {['running', 'stopped'].includes(exam.status) && (
                      <>
                        {!exam.resultsPublished ? (
                          <button
                            onClick={() => handlePublishResults(exam._id)}
                            className="btn btn-info btn-xs gap-1"
                            title="Publish results"
                          >
                            <FiEye size={14} /> Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublishResults(exam._id)}
                            className="btn btn-warning btn-xs gap-1"
                            title="Hide results"
                          >
                            <FiEyeOff size={14} /> Hide
                          </button>
                        )}

                        <button
                          onClick={() => handleCloseExam(exam._id)}
                          className="btn btn-neutral btn-xs"
                          title="Close exam"
                        >
                          Close
                        </button>
                      </>
                    )}

                    {exam.status === 'draft' && (
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="btn btn-ghost btn-xs text-error"
                        title="Delete exam"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
