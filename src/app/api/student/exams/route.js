import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import ClassRequest from '@/models/ClassRequest';
import Class from '@/models/Class';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * GET: Fetch all published exams for a student based on their confirmed class
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Valid userId required' }, { status: 400 });
    }

    // Find all the student's confirmed classes
    const confirmedRequests = await ClassRequest.find({
      studentId: userId,
      status: 'confirmed',
    }).select('classId');

    if (!confirmedRequests || confirmedRequests.length === 0) {
      // Return empty — student not enrolled in any class
      return NextResponse.json([], { status: 200 });
    }

    const classIds = confirmedRequests.map(req => req.classId);

    // AUTO-START LOGIC: Check for any draft/published exams whose scheduled time has passed
    const now = new Date();
    await Exam.updateMany(
      { 
        classId: { $in: classIds }, 
        status: { $in: ['draft', 'published'] }, 
        scheduledAt: { $lte: now } 
      },
      { 
        $set: { 
          status: 'running',
          startTime: now 
        } 
      }
    );

    // Fetch all exams assigned to those classes
    // Including 'draft' so students can see them as 'Upcoming' as requested 
    const exams = await Exam.find({
      classId: { $in: classIds },
      status: { $in: ['draft', 'published', 'running', 'completed', 'stopped'] },
    })
      .sort({ scheduledAt: 1 })
      .populate('classId', 'name level institution')
      .select('title subject duration totalMarks scheduledAt status markPerQuestion classId');

    // Also check which exams this student has already submitted
    const Result = (await import('@/models/Result')).default;
    const results = await Result.find({ student: userId }).select('exam');
    const submittedIds = new Set(results.map(r => r.exam.toString()));

    const examsList = exams.map(exam => {
       const doc = exam.toObject();
       if (submittedIds.has(exam._id.toString())) {
          doc.isSubmitted = true;
       }
       return doc;
    });

    return NextResponse.json(examsList, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
