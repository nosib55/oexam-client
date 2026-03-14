import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';
import { NextResponse } from 'next/server';

/**
 * GET: Fetch a single exam's details (For Eye button or Edit page)
 */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15 needs await

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
    const body = await req.json();

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true },
    );

    return NextResponse.json(updatedExam, { status: 200 });
  } catch (error) {
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
