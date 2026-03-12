import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Exam from "@/models/Exam";

export async function GET() {
    try {
        await dbConnect();

        // 1. Basic Stats
        const studentCount = await User.countDocuments({ role: "student" });
        const teacherCount = await User.countDocuments({ role: "teacher" });
        const examCount = await Exam.countDocuments();

        // Get unique institutions
        const institutions = await User.distinct("institution", { institution: { $ne: null, $exists: true } });
        const institutionCount = institutions.length;

        // 2. Student Growth Data
        // We'll get registrations per month for the last 8 months
        const eightMonthsAgo = new Date();
        eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

        const growth = await User.aggregate([
            {
                $match: {
                    role: "student",
                    createdAt: { $gte: eightMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Convert to a map for easy lookup
        const growthMap = {};
        growth.forEach(item => {
            const key = `${monthNames[item._id.month - 1]}`;
            growthMap[key] = item.count;
        });

        // Ensure we have last 8 months even if count is 0
        const finalGrowthData = [];
        let runningTotal = await User.countDocuments({ role: "student", createdAt: { $lt: eightMonthsAgo } });

        for (let i = 7; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const mName = monthNames[date.getMonth()];
            const count = growthMap[mName] || 0;
            runningTotal += count;
            finalGrowthData.push({
                month: mName,
                students: runningTotal
            });
        }

        return NextResponse.json({
            stats: [
                { label: "Students", value: studentCount.toString() },
                { label: "Teachers", value: teacherCount.toString() },
                { label: "Institutions", value: institutionCount.toString() },
                { label: "Exams", value: examCount.toString() },
            ],
            growthData: finalGrowthData,
            distributionData: [
                { name: "Students", value: studentCount },
                { name: "Teachers", value: teacherCount },
                { name: "Institutions", value: institutionCount },
                { name: "Exams", value: examCount },
            ],
            recentActivity: [
                "System stats updated successfully",
                `${studentCount} students currently in system`,
                `${examCount} total exams created`
            ]
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
