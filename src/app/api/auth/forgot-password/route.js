import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTP } from "@/lib/email";

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User with this email does not exist" }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Try sending real email
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                await sendOTP(email, otp);
            }
        } catch (e) {
            console.error("Forgot password email delivery failed:", e);
        }

        // Local backup log
        console.log(`\n================================`);
        console.log(`🔐 RESET OTP for ${email}: ${otp}`);
        console.log(`================================\n`);

        return NextResponse.json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
