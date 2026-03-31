import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import Result from '@/models/Result';
import Exam from '@/models/Exam';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'No authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, secret);

    const { examId } = await params;

    // Get student's result
    const result = await Result.findOne({
      student: payload.id,
      exam: examId,
    })
      .populate('exam', 'title totalMarks subject')
      .populate('answers.questionId', 'questionText type options');

    if (!result) {
      return NextResponse.json(
        { message: 'No result found for this exam' },
        { status: 404 }
      );
    }

    // Check if result is published
    if (!result.resultPublished) {
      return NextResponse.json(
        { message: 'Results are not yet published for this exam' },
        { status: 403 }
      );
    }

    // Get student's rank
    const rank = await Result.countDocuments({
      exam: examId,
      resultPublished: true,
      marksObtained: { $gt: result.marksObtained },
    });

    // Get total submissions
    const totalSubmissions = await Result.countDocuments({
      exam: examId,
      resultPublished: true,
    });

    return NextResponse.json(
      {
        result: {
          _id: result._id,
          exam: result.exam,
          answers: result.answers,
          marksObtained: result.marksObtained,
          totalMarks: result.totalMarks,
          percentage: ((result.marksObtained / result.totalMarks) * 100).toFixed(2),
          completionTime: result.completionTime,
          submittedAt: result.submittedAt,
        },
        leaderboard: {
          rank: rank + 1,
          totalSubmissions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching exam result:', error);
    return NextResponse.json(
      { message: 'Error fetching exam result' },
      { status: 500 }
    );
  }
}
