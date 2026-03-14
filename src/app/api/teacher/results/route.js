import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // connect database
    await connectDB();

    // result data fatch and populate
    const results = await Result.find()
      .populate('student', 'fullName email') // get name and email
      .populate('exam', 'title') // title from exam model
      .sort({ submittedAt: -1 }); // new result will show in leteast

    // data formatting  matching with ui table
    const formattedResults = results.map(r => {
      // grade calculation logic
      const marks = r.totalMarks || 0;
      let grade = 'F';
      let status = 'Fail';

      if (marks >= 80) grade = 'A+';
      else if (marks >= 70) grade = 'A';
      else if (marks >= 60) grade = 'A-';
      else if (marks >= 50) grade = 'B';
      else if (marks >= 40) grade = 'C';
      else if (marks >= 33) grade = 'D';

      if (marks >= 33) status = 'Pass';

      return {
        _id: r._id,
        studentName: r.student?.fullName || 'Unknown Student',
        studentEmail: r.student?.email || 'N/A',
        examName: r.exam?.title || 'Unknown Exam',
        marks: marks,
        grade: grade,
        status: status,
        isVerified: r.isVerified,
        submittedAt: r.submittedAt,
      };
    });

    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error) {
    console.error('Fetch Results Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results', details: error.message },
      { status: 500 },
    );
  }
}
