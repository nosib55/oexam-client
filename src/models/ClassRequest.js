import mongoose from 'mongoose';

const ClassRequestSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    classRoll: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const ClassRequest = mongoose.models.ClassRequest || mongoose.model('ClassRequest', ClassRequestSchema);
export default ClassRequest;
