import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    // fetching verified results and joining with student info
    const leaderboard = await Result.aggregate([
      {
        // 
        $match: { isVerified: true } 
      },
      {
        // 
        $lookup: {
          from: 'students', 
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        // 
        $project: {
          studentName: '$studentInfo.fullName',
          studentEmail: '$studentInfo.email',
          totalMarks: 1,
          submittedAt: 1,
        }
      },
      {
        // sorting by totalMarks descending and then by submission time ascending
        $sort: { totalMarks: -1, submittedAt: 1 }
      },
      {
        // up to 100 
        $limit: 100
      }
    ]);

    // sum ranking logic
    const rankedData = leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item
    }));

    return NextResponse.json(rankedData, { status: 200 });

  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}