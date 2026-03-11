export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTP } from "@/lib/email";

export async function POST(req) {
  try {
    await dbConnect();
    // remove any indexes that aren't defined on the schema (e.g. leftover
    // username unique index, which throws when inserting second null)
    await User.syncIndexes();

    const body = await req.json();
    console.log("Registration request body:", body);

    const { name, email, password, role, institution } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (role !== "admin" && !institution) {
      return NextResponse.json(
        { message: "Institution is required for non-admin users" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User already exists and is verified. Please login." },
          { status: 400 }
        );
      }
      // If user exists but not verified, we'll update them with a new OTP below
      console.log(`User ${email} exists but is unverified. Updating OTP.`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update if exists (already check isVerified above), or Create if new
    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        role,
        institution: role !== "admin" ? institution : undefined,
        isVerified: false,
        otp,
        otpExpires,
      },
      { upsert: true, returnDocument: 'after' }
    );

    // Try sending real email (General SMTP setup)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendOTP(email, otp);
      }
    } catch (e) {
      console.error("Email delivery failed:", e);
    }

    // Always log to terminal for local backup
    console.log(`\n================================`);
    console.log(`🔐 OTP for ${email}: ${otp}`);
    console.log(`================================\n`);

    return NextResponse.json({
      message: "Registration successful. Please check your email for the OTP.",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      // duplicate key (unique index) error – give the client a 400 with field
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return NextResponse.json(
        { message: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}