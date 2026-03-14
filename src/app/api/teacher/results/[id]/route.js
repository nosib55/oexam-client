import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { NextResponse } from 'next/server';

// show a spasific result
export async function GET(req, { params }) {
  try {
    await connectDB();
    const result = await Result.findById(params.id)
      .populate('student', 'fullName')
      .populate('exam', 'title');

    const formatted = {
      _id: result._id,
      studentName: result.student.fullName,
      examName: result.exam.title,
      answers: result.answers,
      totalMarks: result.totalMarks,
      isVerified: result.isVerified,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch script' },
      { status: 500 },
    );
  }
}

// update review
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { answers, totalMarks, isVerified } = await req.json();

    const updatedResult = await Result.findByIdAndUpdate(
      params.id,
      { answers, totalMarks, isVerified },
      { new: true },
    );

    return NextResponse.json(updatedResult);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
