import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Class from "@/models/Class";
import ClassRequest from "@/models/ClassRequest";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid Class ID" }, { status: 400 });
        }

        // 1. Delete the class
        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        // 2. Cascading delete: Remove all class join requests for this class
        await ClassRequest.deleteMany({ classId: id });

        return NextResponse.json({ message: "Class deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting class:", error);
        return NextResponse.json(
            { error: "Server error while deleting class" },
            { status: 500 }
        );
    }
}
