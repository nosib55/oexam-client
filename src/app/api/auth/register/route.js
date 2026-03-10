export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

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
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      institution: role !== "admin" ? institution : undefined,
    });

    return NextResponse.json({
      message: "User registered successfully",
      user,
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