import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json(
            { message: "Server error while deleting student" },
            { status: 500 }
        );
    }
}
