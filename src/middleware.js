import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  console.log("middleware token present:", !!token);

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("middleware decoded role:", decoded.role);

    // role-based dashboard guard
    const { role } = decoded;
    const url = new URL(request.url);
    const path = url.pathname;

    // if user hits /dashboard directly, send them to their own area
    if (path === "/dashboard") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }

    if (path.startsWith("/dashboard/teacher") && role !== "teacher") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    if (path.startsWith("/dashboard/student") && role !== "student") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    if (path.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("middleware jwt error:", error.message);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/exams/:path*",
    "/api/questions/:path*"
  ],
};