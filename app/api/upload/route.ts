import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "students");

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const studentId = formData.get("studentId") as string | null;
    const studentName = formData.get("studentName") as string | null;
    const oldPhotoPath = formData.get("oldPhotoPath") as string | null;

    if (!file) {
      console.error("Upload error: No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("Upload request:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      studentId,
      studentName,
    });

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.error("Upload error: Invalid file type", file.type);
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, JPEG, and PNG are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error("Upload error: File too large", file.size);
      return NextResponse.json(
        { error: "File size exceeds 1MB limit." },
        { status: 400 }
      );
    }

    // Generate filename: id_time_studentName.extension
    const timestamp = Date.now();
    const sanitizedName = (studentName || "student")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()
      .substring(0, 50);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${studentId || "new"}_${timestamp}_${sanitizedName}.${extension}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Delete old photo if provided
    if (oldPhotoPath) {
      try {
        const oldPhotoFullPath = join(process.cwd(), "public", oldPhotoPath);
        if (existsSync(oldPhotoFullPath)) {
          await unlink(oldPhotoFullPath);
        }
      } catch (error) {
        console.error("Error deleting old photo:", error);
        // Continue even if deletion fails
      }
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    console.log("File uploaded successfully:", filename);

    // Return the filename (relative path from public)
    return NextResponse.json({
      filename: `/uploads/students/${filename}`,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

