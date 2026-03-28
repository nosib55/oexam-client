export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email, name, role } = body;

        if (!email || !role) {
            return NextResponse.json(
                { message: "Email and role are required" },
                { status: 400 }
            );
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not defined");
            return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user (social login bypasses normal verification)
            user = await User.create({
                name,
                email,
                role,
                password: Math.random().toString(36).slice(-8), // Dummy password (never used for social login)
                isVerified: true, // Social login accounts are verified
            });
        } else {
            // update role if different? Usually we stick with their current role.
            // But for the sake of login flow, we might want to respect their choice if they are new, 
            // but otherwise keep existing.
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
                class: user.userClass,
            },
        });

        // Set cookie for middleware
        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
        });

        return response;

    } catch (error) {
        console.error("Social login error:", error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
