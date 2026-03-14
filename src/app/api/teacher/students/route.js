import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    //
    const existingStudent = await Student.findOne({ email: body.email });
    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this email already exists' },
        { status: 400 },
      );
    }

    const newStudent = await Student.create(body);
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    // Fetch all students and sort by newest first
    const students = await Student.find().sort({ createdAt: -1 });
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}