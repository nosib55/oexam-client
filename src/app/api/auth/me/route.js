import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password -otp -otpExpires");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const body = await req.json();
        const { name, email, image } = body;

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { name, email, image },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        return NextResponse.json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
