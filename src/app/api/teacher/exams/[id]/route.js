import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * GET: Fetch a single exam's details (For Eye button or Edit page)
 */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15 needs await
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid Exam ID format' },
        { status: 400 },
      );
    }
    const exam = await Exam.findById(id).populate('questions');
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH: Update an existing exam (For Edit form submission)
 */
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    // console.log('Updating Exam ID:', id);
    const body = await req.json();
    // console.log('Request Body:', body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Exam ID' }, { status: 400 });
    }

    const updatePayload = { ...body };
    if (body.status === 'running') {
      updatePayload.startTime = new Date();
    } else if (body.status === 'closed') {
      updatePayload.endTime = new Date();
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true },
    );

    if (!updatedExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json(updatedExam, { status: 200 });
  } catch (error) {
    console.error('PATCH Error Details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Remove an exam (For Delete button)
 */
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedExam = await Exam.findByIdAndDelete(id);
    if (!deletedExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Exam deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
