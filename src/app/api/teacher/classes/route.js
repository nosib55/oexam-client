import connectDB from '@/lib/mongodb';
import Class from '@/models/Class';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Generate a random unique class code
const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * GET: Fetch all classes for a specific teacher
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    const classes = await Class.find({ teacher: userId }).sort({ createdAt: -1 });
    const ClassRequest = (await import('@/models/ClassRequest')).default;

    // Fetch student counts for each class based on COMPLETED/CONFIRMED requests
    const enrichedClasses = await Promise.all(classes.map(async (cls) => {
      const studentCount = await ClassRequest.countDocuments({
        classId: cls._id,
        status: 'confirmed'
      });
      return { ...cls.toObject(), studentCount };
    }));

    return NextResponse.json(enrichedClasses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Create a new class — fetches institution from DB to ensure accuracy
 */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, level, section, subject, userId } = body;

    if (!name || !level || !userId) {
      return NextResponse.json({ error: 'Name, level, and userId are required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Always fetch institution from DB so it's accurate, never rely on client
    const teacher = await User.findById(userId).select('institution');
    const institution = teacher?.institution || 'Unknown Institution';

    const newClass = await Class.create({
      name,
      level,
      section,
      subject,
      teacher: new mongoose.Types.ObjectId(userId),
      institution,
      code: generateClassCode(),
    });

    return NextResponse.json({ message: 'Class created successfully', data: newClass }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
