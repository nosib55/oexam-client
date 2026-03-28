'use client';

import { useState, useEffect } from 'react';
import { examAPI } from '@/lib/examAPI';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiEye } from 'react-icons/fi';

export default function ResultsManager({ examId, token }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [verifyingAnswers, setVerifyingAnswers] = useState({});
  const [publishStatus, setPublishStatus] = useState(false);
  const [checkingPublishStatus, setCheckingPublishStatus] = useState(true);

  useEffect(() => {
    if (examId) {
      fetchResults();
      checkPublishStatus();
    }
  }, [examId, token]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await examAPI.getExamResults(examId, token);
      setResults(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkPublishStatus = async () => {
    try {
      setCheckingPublishStatus(true);
      const exam = await examAPI.getExam(examId);
      setPublishStatus(exam.resultsPublished || false);
    } catch (error) {
      console.error('Error checking publish status:', error);
    } finally {
      setCheckingPublishStatus(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await examAPI.publishResults(examId, !publishStatus, token);
      toast.success(
        publishStatus
          ? 'Results hidden from students'
          : 'Results published to students'
      );
      setPublishStatus(!publishStatus);
      fetchResults();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVerifyAnswer = (resultId, index, marks) => {
    setVerifyingAnswers({
      ...verifyingAnswers,
      [`${resultId}-${index}`]: marks,
    });
  };

  const handleSubmitVerification = async (resultId) => {
    const result = results.find((r) => r._id === resultId);
    if (!result) return;

    const answers = result.answers
      .map((answer, index) => {
        const marks = verifyingAnswers[`${resultId}-${index}`];
        if (marks !== undefined) {
          return {
            questionId: answer.questionId._id || answer.questionId,
            marksObtained: marks,
          };
        }
        return null;
      })
      .filter((a) => a !== null);

    if (answers.length === 0) {
      toast.error('No changes to verify');
      return;
    }

    try {
      await examAPI.verifyResult(resultId, answers, token);
      toast.success('Result verified successfully');
      setVerifyingAnswers({});
      setSelectedResult(null);
      fetchResults();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Results Management</h2>
        <button
          onClick={handleTogglePublish}
          disabled={checkingPublishStatus}
          className={`btn btn-sm gap-2 ${
            publishStatus ? 'btn-warning' : 'btn-success'
          }`}
        >
          <FiEye /> {publishStatus ? 'Hide from Students' : 'Publish to Students'}
        </button>
      </div>

      {results.length === 0 ? (
        <div className="alert alert-info">
          <span>No submissions yet for this exam</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="table w-full table-compact">
              <thead>
                <tr className="bg-base-200">
                  <th>Student</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id}>
                    <td>
                      <div className="font-semibold">{result.student.name}</div>
                      <div className="text-xs text-base-content/70">
                        {result.student.email}
                      </div>
                    </td>
                    <td>
                      <span className="font-bold">{result.marksObtained}</span>
                    </td>
                    <td>{result.totalMarks}</td>
                    <td>
                      <div
                        className={`badge ${
                          (result.marksObtained / result.totalMarks) * 100 >= 60
                            ? 'badge-success'
                            : 'badge-warning'
                        }`}
                      >
                        {((result.marksObtained / result.totalMarks) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td>
                      {result.isVerified ? (
                        <span className="badge badge-success gap-1">
                          <FiCheckCircle /> Verified
                        </span>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                    </td>
                    <td className="text-sm text-base-content/70">
                      {new Date(result.submittedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setSelectedResult(
                            selectedResult?._id === result._id ? null : result
                          )
                        }
                        className="btn btn-ghost btn-xs"
                      >
                        {selectedResult?._id === result._id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedResult && (
            <div className="card bg-base-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Review: {selectedResult.student.name}
              </h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedResult.answers.map((answer, index) => (
                  <div key={index} className="card bg-base-100 p-4 border border-base-300">
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">
                        Q{index + 1}: {answer.questionId?.questionText || 'Question'}
                      </p>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-semibold">Type:</span>{' '}
                          {answer.questionType}
                        </p>
                        <p>
                          <span className="font-semibold">Student Answer:</span>{' '}
                          {answer.studentAnswer || 'Not answered'}
                        </p>
                        {answer.questionType !== 'Written' && (
                          <p>
                            <span className="font-semibold">Correct Answer:</span>{' '}
                            {answer.correctAnswer}
                          </p>
                        )}
                        <p
                          className={`${
                            answer.isCorrect
                              ? 'text-success font-semibold'
                              : 'text-error font-semibold'
                          }`}
                        >
                          {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </p>
                      </div>

                      {answer.questionType === 'Written' && (
                        <div>
                          <label className="label">
                            <span className="label-text text-xs">
                              Assign Marks
                            </span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            className="input input-bordered input-sm w-24"
                            value={
                              verifyingAnswers[`${selectedResult._id}-${index}`] ||
                              answer.marksObtained ||
                              ''
                            }
                            onChange={(e) =>
                              handleVerifyAnswer(
                                selectedResult._id,
                                index,
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => handleSubmitVerification(selectedResult._id)}
                  className="btn btn-primary btn-sm"
                >
                  Save Verification
                </button>
                <button
                  onClick={() => {
                    setSelectedResult(null);
                    setVerifyingAnswers({});
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
