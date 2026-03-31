import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import QuestionBank from '@/models/QuestionBank';
import Result from '@/models/Result';
import Class from '@/models/Class';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Valid Teacher ID is required' },
        { status: 400 },
      );
    }

    const teacherOID = new mongoose.Types.ObjectId(userId);

    // 1. Active Exams (status: 'running')
    const activeExamsCount = await Exam.countDocuments({
      createdBy: teacherOID,
      status: 'running',
    });

    // 2. Total Students (Count confirmed ClassRequest across all classes for this teacher)
    const teacherClasses = await Class.find({ teacher: teacherOID });
    const teacherClassIds = teacherClasses.map(c => c._id);
    
    const ClassRequest = (await import('@/models/ClassRequest')).default;
    const totalStudentsCount = await ClassRequest.countDocuments({
      classId: { $in: teacherClassIds },
      status: 'confirmed'
    });

    // 3. Question Bank Count (Total question sets)
    const questionBankCount = await QuestionBank.countDocuments({
      createdBy: teacherOID,
    });

    // 4. Average Pass Rate (Assuming 40% as pass mark)
    // We need to fetch published results for exams created by this teacher
    const teacherExamIds = (await Exam.find({ createdBy: teacherOID }).select('_id')).map(e => e._id);
    
    const results = await Result.find({
      exam: { $in: teacherExamIds },
      resultPublished: true
    });

    let avgPassRate = 0;
    if (results.length > 0) {
      const passedCount = results.filter(r => (r.marksObtained / (r.totalMarks || 1)) >= 0.4).length;
      avgPassRate = Math.round((passedCount / results.length) * 100);
    }

    // 5. Live/Running Exam Details
    const runningExam = await Exam.findOne({
      createdBy: teacherOID,
      status: 'running'
    }).sort({ createdAt: -1 });

    // 6. Recent Activity (Last 5 results/submissions)
    const recentSubmissions = await Result.find({
      exam: { $in: teacherExamIds }
    })
    .sort({ submittedAt: -1 })
    .limit(5)
    .populate('student', 'name email')
    .populate('exam', 'title');

    // 7. Mini Leaderboard (Top 3 across all published results)
    const topStudents = await Result.find({
      exam: { $in: teacherExamIds },
      resultPublished: true
    })
    .sort({ marksObtained: -1 })
    .limit(3)
    .populate('student', 'name');

    return NextResponse.json({
      stats: {
        activeExams: activeExamsCount,
        totalStudents: totalStudentsCount,
        questionBank: questionBankCount,
        avgPassRate: `${avgPassRate}%`,
      },
      runningExam: runningExam || null,
      recentSubmissions: recentSubmissions.map(s => ({
        studentName: s.student?.name || 'Unknown Student',
        examTitle: s.exam?.title || 'Assessment',
        time: s.submittedAt
      })),
      leaderboard: topStudents.map((r, i) => ({
        name: r.student?.name || 'Hidden',
        mark: Math.round(((r.marksObtained / (r.totalMarks || 1)) * 100)),
        rank: `0${i + 1}`
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('SERVER ERROR (Teacher Stats):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
