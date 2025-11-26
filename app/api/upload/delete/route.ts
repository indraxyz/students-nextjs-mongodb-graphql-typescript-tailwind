import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photoPath } = body;

    if (!photoPath || typeof photoPath !== "string") {
      return NextResponse.json(
        { error: "Photo path is required" },
        { status: 400 }
      );
    }

    // Ensure the path is within the uploads directory for security
    if (!photoPath.startsWith("/uploads/students/")) {
      return NextResponse.json(
        { error: "Invalid photo path" },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), "public", photoPath);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}

