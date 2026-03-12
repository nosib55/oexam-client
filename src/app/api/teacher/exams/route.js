import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectDB();

    // userId get from URL 
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    // user based exam lists leatest
    const exams = await Exam.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(exams, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
