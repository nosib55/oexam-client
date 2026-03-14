const { useState } = require("react");
const { FaUserCheck } = require("react-icons/fa");

// dashboard/teacher/results/[id]/page.jsx
const ResultDetails = ({ resultId }) => {
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    await axios.put(`/api/teacher/results/${resultId}`, { isVerified: true });
    toast.success('Result Verified!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black">{result?.student?.fullName}</h2>
          <p className="text-slate-400 font-bold">
            Exam: {result?.exam?.title}
          </p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-primary">
            {result?.totalMarks}
          </span>
          <p className="text-[10px] font-black uppercase text-slate-300">
            Total Marks
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {result?.answers.map((ans, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border ${ans.isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'}`}
          >
            <p className="font-bold text-slate-700">Q: {ans.questionId}</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p className="text-sm">
                Student&lsquo;s Answer:{' '}
                <span className="font-bold">{ans.studentAnswer}</span>
              </p>
              <p className="text-sm">
                Correct Answer:{' '}
                <span className="font-bold text-emerald-600">
                  {ans.correctAnswer}
                </span>
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span
                className={`text-[10px] font-black uppercase px-2 py-1 rounded ${ans.questionType === 'Written' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
              >
                {ans.questionType}
              </span>
              <span className="font-black text-slate-600">
                Marks: {ans.marksObtained}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!result?.isVerified && (
        <button
          onClick={handleVerify}
          className="w-full bg-primary text-white h-16 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <FaUserCheck /> Verify Result
        </button>
      )}
    </div>
  );
};
