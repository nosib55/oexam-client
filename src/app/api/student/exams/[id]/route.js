import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import Question from '@/models/Question';
import ClassRequest from '@/models/ClassRequest';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * GET: Fetch a single exam for the student hall
 * Populates questions and ensures the student has access
 */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Valid userId required' }, { status: 400 });
    }

    // 1. Fetch the exam
    const exam = await Exam.findById(id).populate({
        path: 'questions',
        select: 'questionText type options marks subject' // Hide correctAnswer in this hall fetch if we verify server-side
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // 2. Check if student has access to this exam's class
    const confirmedRequest = await ClassRequest.findOne({
      studentId: userId,
      classId: exam.classId,
      status: 'confirmed',
    });

    if (!confirmedRequest) {
      return NextResponse.json({ error: 'You do not have access to this exam class' }, { status: 403 });
    }

    // 3. Ensure exam is running
    if (exam.status !== 'running') {
       return NextResponse.json({ 
         error: `Exam is currently ${exam.status}. Access denied.`, 
         status: exam.status 
       }, { status: 403 });
    }

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    console.error('Exam Hall API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
