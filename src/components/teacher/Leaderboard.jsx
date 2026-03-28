'use client';

import { useState, useEffect } from 'react';
import { examAPI } from '@/lib/examAPI';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiDownload } from 'react-icons/fi';

export default function Leaderboard({ examId, token }) {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (examId) {
      fetchLeaderboard();
    }
  }, [examId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await examAPI.getLeaderboard(examId);
      setLeaderboard(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchLeaderboard();
      toast.success('Leaderboard refreshed');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!leaderboard || !leaderboard.leaderboard) return;

    const headers = [
      'Rank',
      'Student Name',
      'Email',
      'Marks Obtained',
      'Total Marks',
      'Percentage',
      'Completion Time (s)',
      'Submitted At',
    ];

    const rows = leaderboard.leaderboard.map((entry) => [
      entry.rank,
      entry.student.name,
      entry.student.email,
      entry.marksObtained,
      entry.totalMarks,
      entry.percentage,
      entry.completionTime || '-',
      new Date(entry.submittedAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaderboard-${examId}-${Date.now()}.csv`;
    a.click();
  };

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  if (!leaderboard) {
    return <div className="alert alert-warning">No leaderboard data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{leaderboard.examTitle} - Leaderboard</h2>
          <p className="text-sm text-base-content/70">
            Total Submissions: {leaderboard.totalSubmissions}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-primary btn-sm gap-2"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={handleDownloadCSV}
            className="btn btn-secondary btn-sm gap-2"
          >
            <FiDownload /> Download
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full table-compact">
          <thead>
            <tr className="bg-base-200">
              <th className="text-center">Rank</th>
              <th>Student Name</th>
              <th>Email</th>
              <th className="text-right">Marks</th>
              <th className="text-center">%</th>
              <th className="text-right">Time (s)</th>
              <th className="text-right">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.leaderboard.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-base-content/70">
                  No submissions yet
                </td>
              </tr>
            ) : (
              leaderboard.leaderboard.map((entry) => (
                <tr
                  key={entry.rank}
                  className={entry.rank === 1 ? 'bg-yellow-100 dark:bg-yellow-900' : ''}
                >
                  <td className="text-center">
                    <span className="font-bold text-lg">
                      {entry.rank === 1 && '🥇'}
                      {entry.rank === 2 && '🥈'}
                      {entry.rank === 3 && '🥉'}
                      {entry.rank > 3 && entry.rank}
                    </span>
                  </td>
                  <td>
                    <div className="font-semibold">{entry.student.name}</div>
                  </td>
                  <td>
                    <div className="text-sm text-base-content/70">
                      {entry.student.email}
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="font-bold">
                      {entry.marksObtained}/{entry.totalMarks}
                    </span>
                  </td>
                  <td className="text-center">
                    <div
                      className={`badge ${
                        parseFloat(entry.percentage) >= 60
                          ? 'badge-success'
                          : 'badge-warning'
                      }`}
                    >
                      {entry.percentage}%
                    </div>
                  </td>
                  <td className="text-right">
                    {entry.completionTime
                      ? Math.round(entry.completionTime / 60) + ' min'
                      : '-'}
                  </td>
                  <td className="text-right text-sm text-base-content/70">
                    {new Date(entry.submittedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {leaderboard.leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="stat bg-base-100 border border-base-300">
            <div className="stat-title">Top Score</div>
            <div className="stat-value">
              {leaderboard.leaderboard[0].marksObtained}/
              {leaderboard.leaderboard[0].totalMarks}
            </div>
          </div>
          <div className="stat bg-base-100 border border-base-300">
            <div className="stat-title">Average Score</div>
            <div className="stat-value">
              {(
                leaderboard.leaderboard.reduce(
                  (sum, entry) => sum + entry.marksObtained,
                  0
                ) / leaderboard.leaderboard.length
              ).toFixed(2)}
            </div>
          </div>
          <div className="stat bg-base-100 border border-base-300">
            <div className="stat-title">Pass Rate (60%+)</div>
            <div className="stat-value">
              {Math.round(
                (leaderboard.leaderboard.filter(
                  (entry) => parseFloat(entry.percentage) >= 60
                ).length /
                  leaderboard.leaderboard.length) *
                  100
              )}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
