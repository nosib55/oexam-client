import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import Exam from '@/models/Exam';
import Question from '@/models/Question';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * POST: Submit student's exam answers
 * Re-validates answers on server side for security
 */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { studentId, examId, studentAnswers } = body;

    if (!studentId || !examId || !studentAnswers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch real exam data with populated questions (including correct answers)
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // 2. Process and Grade
    let totalObtainedMarks = 0;
    const processedAnswers = exam.questions.map(q => {
      // Handle potential ID mismatch (client might send _id or id)
      const qId = q._id.toString();
      const sAns = (studentAnswers[qId] || '').toString().trim();
      const cAns = (q.correctAnswer || '').toString().trim();

      let marks = 0;
      let correct = false;

      // Grading logic based on question type
      if (q.type === 'MCQ' || q.type === 'True/False') {
        if (sAns.toLowerCase() === cAns.toLowerCase()) {
          marks = q.marks || 1;
          correct = true;
        }
      } else if (q.type === 'Written') {
        // Simple keyword matching for written questions or leave for manual grading
        // For now, let's treat written as 0 marks until teacher verified, or manual flag
        marks = 0; 
        correct = false;
      }

      totalObtainedMarks += marks;
      return {
        questionId: qId,
        questionType: q.type,
        studentAnswer: sAns,
        correctAnswer: cAns,
        isCorrect: correct,
        marksObtained: Number(marks.toFixed(2)),
      };
    });

    // 3. Save result — totalMarks here refers to obtained marks
    // We use marksObtained field in model if it exists, otherwise totalMarks
    const newResult = await Result.create({
      student: new mongoose.Types.ObjectId(studentId),
      exam: new mongoose.Types.ObjectId(examId),
      answers: processedAnswers,
      marksObtained: Number(totalObtainedMarks.toFixed(2)), // For our new results API compatibility
      totalMarks: Number(totalObtainedMarks.toFixed(2)),   // Fallback
      isVerified: false,
    });

    return NextResponse.json({ 
      message: 'Exam submitted successfully', 
      resultId: newResult._id 
    }, { status: 201 });

  } catch (error) {
    console.error('Submission Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

