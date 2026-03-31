import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Result from '@/models/Result';
import Exam from '@/models/Exam';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('examId');
    const limit = parseInt(searchParams.get('limit')) || 100;
    const showAll = searchParams.get('showAll') === 'true';

    if (!examId) {
      return NextResponse.json(
        { message: 'examId is required' },
        { status: 400 }
      );
    }

    // Verify exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json(
        { message: 'Exam not found' },
        { status: 404 }
      );
    }

    // Only return published results unless explicitly requested
    const query = { exam: examId };
    if (!showAll) {
      query.resultPublished = true;
    }

    // Get results sorted by marks (descending) and submission time (ascending)
    const results = await Result.find(query)
      .populate('student', 'name email')
      .populate('exam', 'title totalMarks')
      .sort({ marksObtained: -1, completionTime: 1, submittedAt: 1 })
      .limit(limit);

    // Add rank to each result
    const leaderboard = results.map((result, index) => ({
      rank: index + 1,
      student: result.student,
      marksObtained: result.marksObtained,
      totalMarks: result.totalMarks || exam.totalMarks,
      percentage: ((result.marksObtained / (result.totalMarks || exam.totalMarks)) * 100).toFixed(2),
      completionTime: result.completionTime,
      submittedAt: result.submittedAt,
    }));

    return NextResponse.json(
      {
        examId,
        examTitle: exam.title,
        leaderboard,
        totalSubmissions: leaderboard.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { message: 'Error fetching leaderboard' },
      { status: 500 }
    );
  }
}
