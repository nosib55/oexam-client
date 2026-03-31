import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { 
      examName, 
      subject, 
      duration, 
      totalMarks, 
      userId, 
      examDate, 
      examTime, 
      questionBankId,
      classId
    } = body;

    const combinedDateTime = new Date(`${examDate}T${examTime}`);

    // If a question bank is selected, fetch its questions
    let questions = [];
    if (questionBankId) {
      const QuestionBank = (await import('@/models/QuestionBank')).default;
      const bank = await QuestionBank.findById(questionBankId);
      if (bank) {
        questions = bank.questions || [];
      }
    }

    const examData = {
      title: examName,
      subject: subject.trim(),
      duration: Number(duration),
      totalMarks: Number(totalMarks) || 100,
      createdBy: userId,
      scheduledAt: combinedDateTime,
      status: 'draft',
      questionBankId: questionBankId || null,
      classId: classId || null,
      questions: questions,
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
