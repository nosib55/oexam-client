import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        // Fetch all users with the role 'student', excluding passwords
        const students = await User.find({ role: "student" })
            .select("-password")
            .sort({ createdAt: -1 });

        return NextResponse.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json(
            { message: "Server error while fetching students" },
            { status: 500 }
        );
    }
}
