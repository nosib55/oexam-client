import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const examData = {
      title: body.examName,
      subject: body.subject,
      duration: Number(body.duration),
      totalMarks: Number(body.totalMarks) || 100, 
      createdBy: body.userId, 
      scheduledAt: body.scheduledAt || new Date(),
      status: 'draft',
    };

    const newExam = await Exam.create(examData);

    return NextResponse.json(
      {
        message: 'Exam configuration created',
        examId: newExam._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
