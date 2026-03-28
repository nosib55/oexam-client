import connectDB from '@/lib/mongodb';
import ClassRequest from '@/models/ClassRequest';
import Class from '@/models/Class';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * GET: Fetch all classes a student has joined or requested to join
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Valid userId is required' }, { status: 400 });
    }

    const requests = await ClassRequest.find({ studentId: userId })
      .populate('classId', 'name level institution code teacher')
      .sort({ createdAt: -1 });

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET: Fetch all available classes (for browsing by students)
 */
export async function POST(req) {
  try {
    await connectDB();
    const { classId, studentId, studentName, classRoll } = await req.json();

    if (!classId || !studentId || !studentName || !classRoll) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    // Check if already sent a request
    const existing = await ClassRequest.findOne({ classId, studentId });
    if (existing) {
      return NextResponse.json({ error: 'You already sent a join request for this class' }, { status: 409 });
    }

    const request = await ClassRequest.create({
      classId,
      studentId,
      studentName,
      classRoll,
    });

    return NextResponse.json({ message: 'Join request sent!', data: request }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
