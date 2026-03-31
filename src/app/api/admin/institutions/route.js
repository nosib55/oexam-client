import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        // Aggregate users to get information per institution
        const institutions = await User.aggregate([
            {
                $match: {
                    institution: { $exists: true, $ne: "" },
                    role: { $in: ["teacher", "student"] }
                }
            },
            {
                $group: {
                    _id: "$institution",
                    teachers: { $sum: { $cond: [{ $eq: ["$role", "teacher"] }, 1, 0] } },
                    students: { $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] } },
                    location: { $first: "$location" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    teachers: 1,
                    students: 1,
                    location: 1,
                    // Since we don't have a separate Institution model, 
                    // address and phone are placeholders or could be picked from a "primary" teacher
                    address: { $literal: "See location" },
                    phone: { $literal: "N/A" }
                }
            },
            { $sort: { name: 1 } }
        ]);

        return NextResponse.json(institutions);
    } catch (error) {
        console.error("Error fetching institutions:", error);
        return NextResponse.json(
            { message: "Server error while fetching institutions" },
            { status: 500 }
        );
    }
}
