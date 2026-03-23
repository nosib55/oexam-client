import { NextResponse } from 'next/server';
import dbConnect  from '@/lib/mongodb'; 
import Question from '@/models/Question';

export async function GET(request) {
  try {
    await dbConnect();

    //
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const userId = searchParams.get('userId');

    if (!subject || !userId) {
      return NextResponse.json({ count: 0 });
    }

    const count = await Question.countDocuments({
      userId: userId,
      subject: { $regex: new RegExp(subject, 'i') }, // Case-insensitive search
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching question count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch count' },
      { status: 500 },
    );
  }
}
