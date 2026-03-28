import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, status } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const db = mongoose.connection.db;

    const result = await db
      .collection('users')
      .updateOne({ email: email }, { $set: { isVerified: status } });

    // Check if user exists
    if (result.matchedCount === 0) {
      console.log("User not found in 'users' collection:", email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Success log for terminal
    console.log(`Success: ${email} status updated to ${status}`);

    return NextResponse.json(
      { message: 'Database updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('DATABASE UPDATE ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
