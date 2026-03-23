import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose'; 


/**
 * GET: Fetch all questions for a specific teacher
 */
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const subject = searchParams.get('subject');

    console.log('API Hit with:', { userId, subject });

    //
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Valid User ID is required' },
        { status: 400 },
      );
    }

    //
    let query = { createdBy: new mongoose.Types.ObjectId(userId) };

    if (subject && subject !== 'undefined' && subject !== '') {
      query.subject = subject;
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error('SERVER ERROR (GET):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Create and save a new question
 */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      statement,
      subject,
      difficulty,
      type,
      options,
      correctAnswer,
      marks,
      userId,
      examId
    } = body;

    // 
    if (!statement || !subject || !userId) {
      return NextResponse.json(
        { error: 'Statement, Subject, and User ID are required' },
        { status: 400 },
      );
    }

    const finalAnswer =
      type === 'MCQ' || type === 'True/False'
        ? Number(correctAnswer)
        : correctAnswer;

    const newQuestion = await Question.create({
      questionText: statement,
      subject,
      difficulty,
      type,
      options,
      correctAnswer: finalAnswer,
      marks: marks || 1,
      createdBy: new mongoose.Types.ObjectId(userId),
    });
    
    if (examId && mongoose.Types.ObjectId.isValid(examId)) {
      const Exam = (await import('@/models/Exam')).default;
      await Exam.findByIdAndUpdate(examId, {
        $push: { questions: newQuestion._id },
      });
    }

    return NextResponse.json(
      { message: 'Question saved successfully!', data: newQuestion },
      { status: 201 },
    );
  } catch (error) {
    console.error('SERVER ERROR (POST):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
