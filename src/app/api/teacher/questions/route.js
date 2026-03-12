import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { NextResponse } from 'next/server';

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
    } = body;

    // velidation
    if (!statement || !subject || correctAnswer === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const newQuestion = await Question.create({
      statement,
      subject,
      difficulty,
      type,
      options,
      correctAnswer,
      marks,
      createdBy: userId, // userid from frontend
    });

    return NextResponse.json(
      { message: 'Question saved!', data: newQuestion },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
