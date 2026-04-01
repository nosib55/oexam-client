import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import QuestionBank from '@/models/QuestionBank';
import Result from '@/models/Result';
import Class from '@/models/Class';
import ClassRequest from '@/models/ClassRequest'; 
import User from '@/models/User';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // 
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Valid Teacher ID is required' },
        { status: 400 },
      );
    }

    const teacherOID = new mongoose.Types.ObjectId(userId);

    // 
    const [activeExamsCount, teacherClasses, questionBankCount, teacherExams] =
      await Promise.all([
        Exam.countDocuments({ createdBy: teacherOID, status: 'running' }),
        Class.find({ teacher: teacherOID }).select('_id'),
        QuestionBank.countDocuments({ createdBy: teacherOID }),
        Exam.find({ createdBy: teacherOID }).select('_id'),
      ]);

    const teacherClassIds = teacherClasses.map(c => c._id);
    const teacherExamIds = teacherExams.map(e => e._id);

    // 
    const totalStudentsCount = await ClassRequest.countDocuments({
      classId: { $in: teacherClassIds },
      status: 'confirmed',
    });

    // 
    const results = await Result.find({
      exam: { $in: teacherExamIds },
      resultPublished: true,
    });

    let avgPassRate = 0;
    if (results.length > 0) {
      const passedCount = results.filter(r => {
        const total = r.totalMarks || 100; 
        return r.marksObtained / total >= 0.4;
      }).length;
      avgPassRate = Math.round((passedCount / results.length) * 100);
    }

    // 
    const [runningExam, recentSubmissions, topStudents] = await Promise.all([
      Exam.findOne({ createdBy: teacherOID, status: 'running' }).sort({
        createdAt: -1,
      }),
      Result.find({ exam: { $in: teacherExamIds } })
        .sort({ submittedAt: -1 })
        .limit(5)
        .populate({ path: 'student', select: 'name email' })
        .populate({ path: 'exam', select: 'title' }),
      Result.find({ exam: { $in: teacherExamIds }, resultPublished: true })
        .sort({ marksObtained: -1 })
        .limit(3)
        .populate({ path: 'student', select: 'name' }),
    ]);

    return NextResponse.json(
      {
        stats: {
          activeExams: activeExamsCount || 0,
          totalStudents: totalStudentsCount || 0,
          questionBank: questionBankCount || 0,
          avgPassRate: `${avgPassRate}%`,
        },
        runningExam: runningExam || null,
        recentSubmissions: (recentSubmissions || []).map(s => ({
          studentName: s.student?.name || 'Unknown Student',
          examTitle: s.exam?.title || 'Assessment',
          time: s.submittedAt || new Date(),
        })),
        leaderboard: (topStudents || []).map((r, i) => ({
          name: r.student?.name || 'Unknown',
          mark: Math.round((r.marksObtained / (r.totalMarks || 1)) * 100) || 0,
          rank: `0${i + 1}`,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('SERVER ERROR (Teacher Stats):', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
