import connectDB from '@/lib/mongodb';
import ClassRequest from '@/models/ClassRequest';
import Class from '@/models/Class';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * GET: Fetch all join requests for a teacher's classes
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Valid teacher userId is required' }, { status: 400 });
    }

    // Get all classes owned by this teacher
    const teacherClasses = await Class.find({ teacher: userId }).select('_id');
    const classIds = teacherClasses.map(c => c._id);

    // Get all pending/confirmed/rejected requests for those classes
    const requests = await ClassRequest.find({ classId: { $in: classIds } })
      .populate('classId', 'name level institution')
      .sort({ createdAt: -1 });

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH: Confirm or Reject a join request
 */
export async function PATCH(req) {
  try {
    await connectDB();
    const { requestId, status } = await req.json();

    if (!requestId || !['confirmed', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid requestId or status' }, { status: 400 });
    }

    const updated = await ClassRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Delete a join request
 */
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('requestId');

    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ error: 'Valid requestId is required' }, { status: 400 });
    }

    await ClassRequest.findByIdAndDelete(requestId);
    return NextResponse.json({ message: 'Request deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
