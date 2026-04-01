import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { name } = await params;
        const decodedName = decodeURIComponent(name);

        const result = await User.deleteMany({ institution: decodedName });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Institution not found or has no users" }, { status: 404 });
        }

        return NextResponse.json({ message: `Institution and all ${result.deletedCount} associated users deleted successfully` });
    } catch (error) {
        console.error("Error deleting institution:", error);
        return NextResponse.json(
            { message: "Server error while deleting institution" },
            { status: 500 }
        );
    }
}
