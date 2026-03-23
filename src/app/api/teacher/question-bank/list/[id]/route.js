import connectDB from '@/lib/mongodb';
import QuestionBank from '@/models/QuestionBank';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * GET: Fetch a single question bank by ID
 */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const bank = await QuestionBank.findById(id).populate('questions');

    if (!bank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }

    return NextResponse.json(bank, { status: 200 });
  } catch (error) {
    console.error('SERVER ERROR (GET Bank):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH: Update a question bank (e.g., adding question IDs)
 */
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const updatedBank = await QuestionBank.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedBank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Bank updated successfully!', data: updatedBank },
      { status: 200 }
    );
  } catch (error) {
    console.error('SERVER ERROR (PATCH Bank):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Remove a question bank
 */
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const deletedBank = await QuestionBank.findByIdAndDelete(id);

    if (!deletedBank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Bank deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('SERVER ERROR (DELETE Bank):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
