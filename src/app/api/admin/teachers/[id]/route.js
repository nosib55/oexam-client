import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Teacher deleted successfully" });
    } catch (error) {
        console.error("Error deleting teacher:", error);
        return NextResponse.json(
            { message: "Server error while deleting teacher" },
            { status: 500 }
        );
    }
}
