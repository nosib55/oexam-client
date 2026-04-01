import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import User from '@/models/User'; 
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const leaderboard = await Result.aggregate([
      { $match: { isVerified: true } },
      {
        $lookup: {
          from: 'students', // firstly, try to find student info in the Student collection
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },
      {
        $lookup: {
          from: 'users', // then, if no student info found, try to find user info in the User collection
          localField: 'student',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $project: {
          // if has studentInfo, use that; otherwise, fallback to userInfo
          studentName: {
            $ifNull: [
              { $arrayElemAt: ['$studentInfo.fullName', 0] }, // Student model fullName
              { $arrayElemAt: ['$userInfo.name', 0] }, // User model name
              'Unknown Student',
            ],
          },
          studentEmail: {
            $ifNull: [
              { $arrayElemAt: ['$studentInfo.email', 0] },
              { $arrayElemAt: ['$userInfo.email', 0] },
              'N/A',
            ],
          },
          marks: '$marksObtained',
          total: '$totalMarks',
          submittedAt: 1,
        },
      },
      { $sort: { marks: -1, submittedAt: 1 } },
      { $limit: 100 },
    ]);

    const rankedData = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1,
      totalMarks: item.marks,
    }));

    return NextResponse.json(rankedData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
