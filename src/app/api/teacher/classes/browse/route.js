import connectDB from '@/lib/mongodb';
import Class from '@/models/Class';
import User from '@/models/User';
import { NextResponse } from 'next/server';

/**
 * GET: Fetch all available classes for students to browse and join
 * Populates teacher info to ensure institution name is always accurate
 */
export async function GET(req) {
  try {
    await connectDB();
    const classes = await Class.find({})
      .sort({ createdAt: -1 })
      .populate('teacher', 'name institution')
      .select('-__v');

    // Return classes, using the teacher's institution if class institution is missing
    const enriched = classes.map(cls => {
      const obj = cls.toObject();
      if (!obj.institution || obj.institution === 'Unknown Institution') {
        obj.institution = cls.teacher?.institution || 'Unknown Institution';
      }
      return obj;
    });

    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
