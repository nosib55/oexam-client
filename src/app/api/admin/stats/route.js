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
        const growthMap = {};
        growth.forEach(item => {
            const key = `${monthNames[item._id.month - 1]}`;
            growthMap[key] = item.count;
        });

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

        // 3. Real Recent Activity
        const recentUsers = await User.find({ role: { $in: ["student", "teacher"] } })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentExams = await Exam.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const activities = [];

        recentUsers.forEach(u => {
            activities.push({
                text: `New ${u.role} registered: ${u.name}`,
                date: u.createdAt
            });
        });

        recentExams.forEach(e => {
            activities.push({
                text: `New exam created: ${e.title}`,
                date: e.createdAt || e.createdAt
            });
        });

        const sortedActivities = activities
            .sort((a, b) => b.date - a.date)
            .slice(0, 3)
            .map(a => a.text);

        const finalActivities = sortedActivities.length > 0
            ? sortedActivities
            : ["System live", "Awaiting new records", "No recent activity"];

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
            recentActivity: finalActivities
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
