import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import Result from '@/models/Result';
import Exam from '@/models/Exam';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  try {
    await dbConnect();

    // Verify authentication (check header first, then cookies)
    let token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
        token = req.cookies.get('token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { message: 'No session or authorization token found' },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);

    // Get all results for the student
    const results = await Result.find({ student: payload.id, resultPublished: true })
      .populate('exam', 'title totalMarks subject')
      .sort({ submittedAt: -1 });

    const resultsWithLeaderboard = await Promise.all(
      results.map(async (result) => {
        // Get leaderboard rank for this exam
        const rank = await Result.countDocuments({
          exam: result.exam._id,
          resultPublished: true,
          marksObtained: { $gt: result.marksObtained },
        });

        return {
          _id: result._id,
          exam: result.exam,
          marksObtained: result.marksObtained,
          totalMarks: result.exam?.totalMarks || 100,
          percentage: ((result.marksObtained / (result.exam?.totalMarks || 100)) * 100).toFixed(2),
          rank: rank + 1,
          completionTime: result.completionTime,
          submittedAt: result.submittedAt,
          isVerified: result.isVerified,
        };
      })
    );

    return NextResponse.json(resultsWithLeaderboard, { status: 200 });
  } catch (error) {
    console.error('Error fetching student results:', error);
    return NextResponse.json(
      { message: 'Error fetching student results' },
      { status: 500 }
    );
  }
}
