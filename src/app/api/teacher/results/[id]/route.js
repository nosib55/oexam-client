import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { NextResponse } from 'next/server';

// show a specific result
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const result = await Result.findById(id)
      .populate('student', 'name fullName email')
      .populate('exam', 'title');

    if (!result) {
        return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    const formatted = {
      _id: result._id,
      studentName: result.student?.name || result.student?.fullName || 'Anonymous',
      examName: result.exam?.title || 'Unknown Exam',
      answers: result.answers,
      totalMarks: result.totalMarks,
      isVerified: result.isVerified,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Fetch result error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch script' },
      { status: 500 },
    );
  }
}

// update review
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const { answers, totalMarks, isVerified } = await req.json();

    const updatedResult = await Result.findByIdAndUpdate(
      id,
      { answers, totalMarks, isVerified },
      { new: true },
    );

    return NextResponse.json(updatedResult);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
