import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // populate('questions')
    const exam = await Exam.findById(id).populate('questions');

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
