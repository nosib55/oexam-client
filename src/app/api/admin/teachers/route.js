import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        // Fetch all users with the role 'teacher', excluding passwords
        const teachers = await User.find({ role: "teacher" })
            .select("-password")
            .sort({ createdAt: -1 });

        return NextResponse.json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json(
            { message: "Server error while fetching teachers" },
            { status: 500 }
        );
    }
}
