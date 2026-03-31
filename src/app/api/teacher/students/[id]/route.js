import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

// DELETE STUDENT
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await Student.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Student deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET SINGLE STUDENT FOR EDITING
export async function GET(req, { params }) {
  try {
    await connectDB();
    const student = await Student.findById(params.id);
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE STUDENT
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedStudent = await Student.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
