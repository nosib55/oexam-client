import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();

    const { studentId, examId, studentAnswers, examData } = await req.json();

    if (!studentId || !examId || !studentAnswers || !examData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    let totalObtainedMarks = 0;
    const processedAnswers = examData.questions.map(q => {
      const sAns = (studentAnswers[q.id] || '').toString().trim();
      const cAns = (q.correctAnswer || '').toString().trim();

      let marks = 0;
      let correct = false;

      if (q.type === 'MCQ' || q.type === 'TrueFalse') {
        if (sAns.toLowerCase() === cAns.toLowerCase()) {
          marks = q.marks || 0;
          correct = true;
        }
      } else if (q.type === 'Written') {
        const keywords = q.keywords || [];
        if (keywords.length > 0) {
          const matchCount = keywords.filter(word =>
            sAns.toLowerCase().includes(word.toLowerCase()),
          ).length;

          if (matchCount > 0) {
            marks = (q.marks / keywords.length) * matchCount;
            correct = marks > 0;
          }
        }
      }

      totalObtainedMarks += marks;
      return {
        questionId: q.id,
        questionType: q.type,
        studentAnswer: sAns,
        correctAnswer: cAns,
        isCorrect: correct,
        marksObtained: Number(marks.toFixed(2)),
      };
    });

    // Save to Database
    const newResult = await Result.create({
      student: studentId,
      exam: examId,
      answers: processedAnswers,
      totalMarks: Number(totalObtainedMarks.toFixed(2)),
      isVerified: false,
    });

    return NextResponse.json(
      { message: 'Exam submitted successfully', resultId: newResult._id },
      { status: 201 },
    );
  } catch (error) {
    console.error('Submission Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}

