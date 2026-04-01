import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const leaderboard = await Result.aggregate([
      {
        $match: { isVerified: true } 
      },
      {
        $lookup: {
          from: 'students', 
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $project: {
          studentName: { $ifNull: ['$studentInfo.fullName', '$studentInfo.name'] },
          studentEmail: '$studentInfo.email',
          marks: '$marksObtained', 
          total: '$totalMarks',
          submittedAt: 1,
        }
      },
      { $sort: { marks: -1, submittedAt: 1 } },
      { $limit: 100 }
    ]);

    const rankedData = leaderboard.map((item, index) => ({
      rank: index + 1,
      studentName: item.studentName || 'Unknown',
      totalMarks: item.marks || 0, 
      ...item
    }));

    return NextResponse.json(rankedData, { status: 200 });

  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}