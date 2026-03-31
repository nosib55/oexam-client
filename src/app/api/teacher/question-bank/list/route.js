import connectDB from '@/lib/mongodb';
import QuestionBank from '@/models/QuestionBank';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * GET: Fetch all question banks for a specific teacher
 */
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Valid User ID is required' },
        { status: 400 },
      );
    }

    const banks = await QuestionBank.find({ createdBy: userId }).sort({ createdAt: -1 });

    return NextResponse.json(banks, { status: 200 });
  } catch (error) {
    console.error('SERVER ERROR (GET QuestionBanks):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Create a new question bank
 */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, subject, description, userId, totalQuestions } = body;

    if (!name || !subject || !userId) {
      return NextResponse.json(
        { error: 'Name, Subject, and User ID are required' },
        { status: 400 },
      );
    }

    const newBank = await QuestionBank.create({
      name,
      subject,
      description,
      totalQuestions: totalQuestions || 0,
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json(
      { message: 'Question bank created successfully!', data: newBank },
      { status: 201 },
    );
  } catch (error) {
    console.error('SERVER ERROR (POST QuestionBank):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
