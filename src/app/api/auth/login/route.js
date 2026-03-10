export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("Login request body:", body);
    const { email, password, role } = body;

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined");
      return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
    }

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Email, password and role are required" },
        { status: 400 }
      );
    }

    // Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // ensure requested role matches stored role
    if (user.role !== role) {
      return NextResponse.json(
        { message: `User is not a ${role}` },
        { status: 400 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // for development, let client set the cookie (remove httpOnly for debugging)
    // response.cookies.set("token", token, {
    //   httpOnly: true,
    //   path: "/",
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    //   sameSite: "lax",
    // });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}