import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  // Question type: MCQ, True/False or Written
  type: {
    type: String,
    enum: ['MCQ', 'True/False', 'Written'],
    default: 'MCQ',
    required: true,
  },
  // প্রশ্নের কঠিনতা
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  // Options for MCQ and True/False 
  // Can blank for Written , that's why required: false
  options: [
    {
      type: String,
      required: false,
    },
  ],
  // index of right answer(for MCQ/TF)
  // Written 
  correctAnswer: {
    type: Number,
    required: true,
  },
  marks: {
    type: Number,
    default: 1,
  },
  subject: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Question ||
  mongoose.model('Question', QuestionSchema);
