import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { NextResponse } from 'next/server';

/**
 * DELETE: Remove a specific question from the database
 * URL: /api/teacher/questions/[id]
 */
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // In Next.js 15, params is a Promise and must be awaited
    const { id } = await params;

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Question deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET: Fetch details of a single question by ID
 * URL: /api/teacher/questions/[id]
 */
export async function GET(req, { params }) {
  try {
    await connectDB();

    // Await params to access the dynamic route ID
    const { id } = await params;

    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH: Update specific fields of an existing question
 * URL: /api/teacher/questions/[id]
 */
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await params;

    // findByIdAndUpdate with { new: true } returns the modified document
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true },
    );

    if (!updatedQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
