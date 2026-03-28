import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import Exam from '@/models/Exam';
import { NextResponse } from 'next/server';

/**
 * GET: Fetch results for exams created by the teacher
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // 1. Get all exams created by this teacher
    const teacherExams = await Exam.find({ createdBy: userId }).select('_id');
    const examIds = teacherExams.map(e => e._id);

    // 2. Fetch results for those exams
    const results = await Result.find({ exam: { $in: examIds } })
      .populate({
        path: 'student',
        select: 'name email institution userClass'
      })
      .populate('exam', 'title totalMarks')
      .sort({ submittedAt: -1 });

    // 3. Format matching with teacher UI
    const formattedResults = results.map(r => {
      const obtained = r.marksObtained || r.totalMarks || 0;
      const total = r.exam?.totalMarks || 100;
      // Calculate percentage
      const percentage = Math.round((obtained / total) * 100);
      
      let grade = 'F';
      let status = 'Fail';

      if (percentage >= 80) grade = 'A+';
      else if (percentage >= 70) grade = 'A';
      else if (percentage >= 60) grade = 'A-';
      else if (percentage >= 50) grade = 'B';
      else if (percentage >= 40) grade = 'C';
      else if (percentage >= 33) grade = 'D';

      if (percentage >= 33) status = 'Pass';

      return {
        _id: r._id,
        studentName: r.student?.name || 'Unknown',
        studentEmail: r.student?.email || 'N/A',
        studentInfo: r.student?.institution || 'N/A',
        examName: r.exam?.title || 'Unknown Exam',
        marks: percentage, // UI expects percentage-like integer
        grade: grade,
        status: status,
        isVerified: r.isVerified,
        submittedAt: r.submittedAt,
      };
    });

    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error) {
    console.error('Fetch Results Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
