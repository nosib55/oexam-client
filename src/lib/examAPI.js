/**
 * Utility functions for exam management
 */

export const examAPI = {
  // Question Banks
  async getQuestionBanks(token) {
    const response = await fetch('/api/teacher/question-banks', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch question banks');
    return response.json();
  },

  async createQuestionBank(data, token) {
    const response = await fetch('/api/teacher/question-banks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create question bank');
    return response.json();
  },

  async updateQuestionBank(bankId, data, token) {
    const response = await fetch(`/api/teacher/question-banks/${bankId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update question bank');
    return response.json();
  },

  async deleteQuestionBank(bankId, token) {
    const response = await fetch(`/api/teacher/question-banks/${bankId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete question bank');
    return response.json();
  },

  async addQuestionToBank(bankId, questionData, token) {
    const response = await fetch(`/api/teacher/question-banks/${bankId}/questions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });
    if (!response.ok) throw new Error('Failed to add question to bank');
    return response.json();
  },

  async removeQuestionFromBank(bankId, questionId, token) {
    const response = await fetch(`/api/teacher/question-banks/${bankId}/questions`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionId }),
    });
    if (!response.ok) throw new Error('Failed to remove question from bank');
    return response.json();
  },

  // Exams
  async getExams(token) {
    const response = await fetch('/api/teacher/exams-v2', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch exams');
    return response.json();
  },

  async createExam(examData, token) {
    const response = await fetch('/api/teacher/exams-v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create exam');
    }
    return response.json();
  },

  async getExam(examId) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}`);
    if (!response.ok) throw new Error('Failed to fetch exam');
    return response.json();
  },

  async updateExam(examId, data, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update exam');
    return response.json();
  },

  async deleteExam(examId, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete exam');
    return response.json();
  },

  async startExam(examId, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}/start`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to start exam');
    return response.json();
  },

  async stopExam(examId, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}/stop`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to stop exam');
    return response.json();
  },

  async publishExam(examId, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}/publish`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to publish exam results');
    return response.json();
  },

  async unpublishExam(examId, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}/unpublish`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to unpublish exam results');
    return response.json();
  },

  async closeExam(examId, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}/close`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to close exam');
    return response.json();
  },

  // Results
  async getExamResults(examId, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}/results`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch exam results');
    return response.json();
  },

  async verifyResult(resultId, answers, token) {
    const response = await fetch(`/api/teacher/results/${resultId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers, isVerified: true }),
    });
    if (!response.ok) throw new Error('Failed to verify result');
    return response.json();
  },

  async publishResults(examId, publish, token) {
    const response = await fetch(`/api/teacher/exams-v2/${examId}/results/publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publish }),
    });
    if (!response.ok) throw new Error('Failed to publish results');
    return response.json();
  },

  // Leaderboard
  async getLeaderboard(examId, limit = 100) {
    const response = await fetch(
      `/api/leaderboard?examId=${examId}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
};
