import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    level: {
      type: String, // e.g., "Class 1", "Class 10", "College 1st Year", etc.
      required: true,
    },
    studentCount: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development
const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);
export default Class;
