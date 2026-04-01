import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [
    {
      questionId: { type: String },
      questionType: { type: String }, // MCQ, TrueFalse, Written
      studentAnswer: { type: String },
      correctAnswer: { type: String },
      isCorrect: { type: Boolean, default: false },
      marksObtained: { type: Number, default: 0 },
    },
  ],
  marksObtained: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false }, // Teacher verification
  resultPublished: { type: Boolean, default: true },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model('Result', resultSchema);
