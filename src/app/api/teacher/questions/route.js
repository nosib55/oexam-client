import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { NextResponse } from 'next/server';

/**
 * GET: Fetch all questions for a specific teacher
 * Request URL: /api/teacher/questions?userId=...
 */
export async function GET(req) {
  try {
    await connectDB();

    // Extract query parameters from URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Validation: Ensure userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    // Fetch questions created by the user, sorted by newest first
    const questions = await Question.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Create and save a new question
 * Request Body: { questionText: statement, subject, difficulty, type, options, correctAnswer, marks, userId }
 */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      statement, // Maps to questionText in Model
      subject,
      difficulty,
      type,
      options,
      correctAnswer,
      marks,
      userId,
    } = body;

    // Validation: Check for required fields
    if (!statement || !subject || correctAnswer === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Create new document in MongoDB
    const newQuestion = await Question.create({
      questionText: statement, // Mapping frontend 'statement' to model 'questionText'
      subject,
      difficulty,
      type,
      options,
      correctAnswer,
      marks,
      createdBy: userId,
    });

    return NextResponse.json(
      { message: 'Question saved successfully!', data: newQuestion },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
