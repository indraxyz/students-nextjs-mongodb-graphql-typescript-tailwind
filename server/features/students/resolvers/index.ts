import { formatISO } from "date-fns";
import { unlink, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { put, del } from "@vercel/blob";
import {
  StudentParent,
  QueryArgs,
  StudentQueryArgs,
  CreateStudentArgs,
  UpdateStudentArgs,
  DeleteStudentArgs,
  DeleteStudentsArgs,
} from "../types";
import {
  studentInputSchema,
  searchStudentInputSchema,
} from "../schemas/validation";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "@/server/shared/errors";
import type { ApolloContext } from "@/server/shared/graphql/types";
import { ZodError } from "zod";
import { env } from "@/server/shared/config/env";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "students");

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Helper function to delete photo (handles both local files and Vercel Blob URLs)
async function deletePhoto(
  photoPath: string | null | undefined
): Promise<void> {
  if (!photoPath) return;

  try {
    // Check if it's a Vercel Blob URL
    if (
      photoPath.startsWith("https://") &&
      photoPath.includes("blob.vercel-storage.com")
    ) {
      // Delete from Vercel Blob
      if (env.BLOB_READ_WRITE_TOKEN) {
        await del(photoPath, { token: env.BLOB_READ_WRITE_TOKEN });
        console.log("Photo deleted from Vercel Blob:", photoPath);
      }
    } else if (photoPath.startsWith("/uploads/students/")) {
      // Delete local file
      const oldPhotoFullPath = join(process.cwd(), "public", photoPath);
      if (existsSync(oldPhotoFullPath)) {
        await unlink(oldPhotoFullPath);
        console.log("Photo deleted from local storage:", photoPath);
      }
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
    // Continue even if deletion fails
  }
}

// Helper function to save base64 photo to disk or Vercel Blob
async function saveBase64Photo(
  base64Data: string,
  studentId: string,
  studentName: string,
  oldPhotoPath?: string | null
): Promise<string> {
  try {
    // Validate base64 format
    if (!base64Data.startsWith("data:image/")) {
      throw new ValidationError(
        "Invalid photo format. Expected base64 image data."
      );
    }

    // Extract mime type and base64 content
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new ValidationError("Invalid base64 photo format.");
    }

    const mimeType = matches[1].toLowerCase();
    const base64Content = matches[2];

    // Validate file type
    const allowedMimeTypes = ["jpeg", "jpg", "png"];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new ValidationError(
        "Invalid file type. Only JPG, JPEG, and PNG are allowed."
      );
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Content, "base64");

    // Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      throw new ValidationError("File size exceeds 1MB limit.");
    }

    // Generate filename: id_time_studentName.extension
    const timestamp = Date.now();
    const sanitizedName = studentName
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()
      .substring(0, 50);
    const extension = mimeType === "jpeg" ? "jpg" : mimeType;
    const filename = `students/${studentId}_${timestamp}_${sanitizedName}.${extension}`;

    // Check if running on Vercel or if BLOB_READ_WRITE_TOKEN is available
    const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;
    const useBlobStorage = isVercel || env.BLOB_READ_WRITE_TOKEN;

    // Delete old photo if provided
    if (oldPhotoPath) {
      await deletePhoto(oldPhotoPath);
    }

    if (useBlobStorage && env.BLOB_READ_WRITE_TOKEN) {
      // Use Vercel Blob Storage
      try {
        const blob = await put(filename, buffer, {
          access: "public",
          contentType: `image/${mimeType}`,
          token: env.BLOB_READ_WRITE_TOKEN,
        });

        console.log("Photo saved to Vercel Blob:", blob.url);
        return blob.url;
      } catch (blobError) {
        console.error(
          "Error uploading to Vercel Blob, falling back to local:",
          blobError
        );
        // Fall through to local storage if blob upload fails
      }
    }

    // Use local file system (development or fallback)
    await ensureUploadDir();
    const filepath = join(UPLOAD_DIR, filename.replace("students/", ""));
    await writeFile(filepath, buffer);

    console.log("Photo saved to local storage:", filename);
    return `/uploads/students/${filename.replace("students/", "")}`;
  } catch (error) {
    console.error("Error saving photo:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new DatabaseError("Failed to save photo", error);
  }
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) {
    return formatISO(new Date());
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date:", date);
      return formatISO(new Date());
    }
    return formatISO(dateObj);
  } catch (error) {
    console.error("Error parsing date:", error);
    return formatISO(new Date());
  }
};

export const studentResolvers = {
  Student: {
    id: (parent: StudentParent): string => {
      if (parent.id) return parent.id;
      if (parent._id) {
        return typeof parent._id === "string"
          ? parent._id
          : parent._id.toString();
      }
      throw new Error("Student ID is missing");
    },

    createdAt: (parent: StudentParent): string => {
      return formatDate(parent.createdAt);
    },

    updatedAt: (parent: StudentParent): string => {
      return formatDate(parent.updatedAt);
    },
  },
  Query: {
    students: async (_: unknown, args: QueryArgs, context: ApolloContext) => {
      try {
        const validatedInput = searchStudentInputSchema.parse(args.input || {});
        const result = await context.dataSources.students.getAllStudents(
          validatedInput
        );
        console.log(
          `✅ Query: students - Success: Found ${result.length} student(s)`
        );
        return result;
      } catch (error) {
        console.error("❌ Query: students - Error:", error);
        if (error instanceof Error && error.name === "ZodError") {
          throw new ValidationError("Invalid search parameters", {
            search: error.message,
          });
        }
        throw new DatabaseError("Failed to fetch students", error);
      }
    },
    student: async (
      _: unknown,
      args: StudentQueryArgs,
      context: ApolloContext
    ) => {
      try {
        if (!args.id) {
          throw new ValidationError("Student ID is required");
        }
        const student = await context.dataSources.students.getStudent({
          id: args.id,
        });
        if (!student) {
          console.log(`❌ Query: student - Not found: ${args.id}`);
          throw new NotFoundError("Student", args.id);
        }
        console.log(
          `✅ Query: student - Success: Found student "${
            student.name || "Unknown"
          }" (${args.id})`
        );
        return student;
      } catch (error) {
        console.error("❌ Query: student - Error:", error);
        if (
          error instanceof NotFoundError ||
          error instanceof ValidationError
        ) {
          throw error;
        }
        throw new DatabaseError("Failed to fetch student", error);
      }
    },
  },
  Mutation: {
    createStudent: async (
      _: unknown,
      args: CreateStudentArgs,
      context: ApolloContext
    ) => {
      try {
        console.log("🆕 Mutation: createStudent - Input:", {
          ...args.input,
          photo: args.input.photo
            ? args.input.photo.startsWith("data:image/")
              ? `[base64 image, ${Math.round(
                  (args.input.photo.length * 3) / 4 / 1024
                )}KB]`
              : args.input.photo
            : undefined,
        });

        // Extract photo from input if it's base64
        const { photo: photoBase64, ...restInput } = args.input;

        // Remove undefined and null values from input
        const cleanInput = Object.fromEntries(
          Object.entries(restInput).filter(
            ([_, value]) => value !== undefined && value !== null
          )
        );

        // Validate input (without photo for now)
        const validatedInput = studentInputSchema.parse(cleanInput);
        console.log("✅ Mutation: createStudent - Validation passed");

        // Create student first to get the ID
        const newStudent = await context.dataSources.students.createStudent({
          input: validatedInput,
        });

        if (!newStudent) {
          throw new DatabaseError("Student creation returned null");
        }

        const studentId = newStudent._id?.toString() || newStudent.id || "";
        console.log(
          `✅ Mutation: createStudent - Student created: ${studentId} (${
            validatedInput.name || "Unknown"
          })`
        );

        // Handle photo upload if base64 data is provided
        if (
          photoBase64 &&
          typeof photoBase64 === "string" &&
          photoBase64.startsWith("data:image/")
        ) {
          try {
            console.log("📸 Mutation: createStudent - Uploading photo...");
            const photoPath = await saveBase64Photo(
              photoBase64,
              studentId,
              validatedInput.name || "student",
              null
            );

            // Update student with photo path
            const updatedStudent =
              await context.dataSources.students.updateStudent({
                input: { id: studentId, ...validatedInput, photo: photoPath },
              });

            console.log(
              `✅ Mutation: createStudent - Photo uploaded: ${photoPath}`
            );
            return updatedStudent || newStudent;
          } catch (photoError) {
            console.error(
              "⚠️ Mutation: createStudent - Error saving photo, but student was created:",
              photoError
            );
            // Don't fail the entire operation if photo save fails
            // Student is already created, just return it without photo
          }
        }

        return newStudent;
      } catch (error) {
        console.error("❌ Mutation: createStudent - Error:", error);

        // Handle Zod validation errors with detailed field messages
        if (error instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};

          error.issues.forEach((issue) => {
            const field = issue.path[0] as string;
            if (field) {
              fieldErrors[field] = issue.message;
            }
          });

          // Get the first error message for the main error
          const firstError = error.issues[0];
          const errorMessage = firstError
            ? `${String(firstError.path[0])}: ${firstError.message}`
            : "Invalid student data";

          console.error("Validation errors:", fieldErrors);
          throw new ValidationError(errorMessage, fieldErrors);
        }

        if (
          error instanceof ValidationError ||
          error instanceof DatabaseError
        ) {
          throw error;
        }
        throw new DatabaseError("Failed to create student", error);
      }
    },
    updateStudent: async (
      _: unknown,
      args: UpdateStudentArgs,
      context: ApolloContext
    ) => {
      try {
        console.log("✏️ Mutation: updateStudent - ID:", args.id, "Input:", {
          ...args.input,
          photo: args.input.photo
            ? args.input.photo.startsWith("data:image/")
              ? `[base64 image, ${Math.round(
                  (args.input.photo.length * 3) / 4 / 1024
                )}KB]`
              : args.input.photo
            : undefined,
        });

        if (!args.id) {
          throw new ValidationError("Student ID is required");
        }

        // Get existing student to check for old photo
        const existingStudent = await context.dataSources.students.getStudent({
          id: args.id,
        });

        if (!existingStudent) {
          console.log(
            `❌ Mutation: updateStudent - Student not found: ${args.id}`
          );
          throw new NotFoundError("Student", args.id);
        }

        console.log(
          `📋 Mutation: updateStudent - Existing student: "${
            existingStudent.name || "Unknown"
          }"`
        );

        // Extract photo from input if it's base64
        const { photo: photoBase64, ...restInput } = args.input;

        // Remove undefined and null values from input
        const cleanInput = Object.fromEntries(
          Object.entries(restInput).filter(
            ([_, value]) => value !== undefined && value !== null
          )
        );

        // Validate input (without photo for now)
        const validatedInput = studentInputSchema.parse(cleanInput);
        console.log("✅ Mutation: updateStudent - Validation passed");

        // Handle photo upload if base64 data is provided
        let photoPath: string | undefined = undefined;
        if (
          photoBase64 &&
          typeof photoBase64 === "string" &&
          photoBase64.startsWith("data:image/")
        ) {
          try {
            console.log("📸 Mutation: updateStudent - Uploading new photo...");
            photoPath = await saveBase64Photo(
              photoBase64,
              args.id,
              validatedInput.name || existingStudent.name || "student",
              existingStudent.photo || null
            );
            console.log(
              `✅ Mutation: updateStudent - Photo uploaded: ${photoPath}`
            );
          } catch (photoError) {
            console.error(
              "⚠️ Mutation: updateStudent - Error saving photo:",
              photoError
            );
            // If photo save fails, continue with update but without photo
            // Or throw error if you want to fail the entire update
            if (photoError instanceof ValidationError) {
              throw photoError;
            }
          }
        }

        // Update student with validated input and photo path (if available)
        const updateData = photoPath
          ? { ...validatedInput, photo: photoPath }
          : validatedInput;

        const updatedStudent = await context.dataSources.students.updateStudent(
          {
            input: { id: args.id, ...updateData },
          }
        );

        if (!updatedStudent) {
          throw new NotFoundError("Student", args.id);
        }

        console.log(
          `✅ Mutation: updateStudent - Success: Student "${
            updatedStudent.name || "Unknown"
          }" updated`
        );
        return updatedStudent;
      } catch (error) {
        console.error("❌ Mutation: updateStudent - Error:", error);

        // Handle Zod validation errors with detailed field messages
        if (error instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};

          error.issues.forEach((issue) => {
            const field = issue.path[0] as string;
            if (field) {
              fieldErrors[field] = issue.message;
            }
          });

          // Get the first error message for the main error
          const firstError = error.issues[0];
          const errorMessage = firstError
            ? `${String(firstError.path[0])}: ${firstError.message}`
            : "Invalid student data";

          console.error("Validation errors:", fieldErrors);
          throw new ValidationError(errorMessage, fieldErrors);
        }

        if (
          error instanceof NotFoundError ||
          error instanceof ValidationError ||
          error instanceof DatabaseError
        ) {
          throw error;
        }
        throw new DatabaseError("Failed to update student", error);
      }
    },
    deleteStudent: async (
      _: unknown,
      args: DeleteStudentArgs,
      context: ApolloContext
    ) => {
      try {
        console.log("🗑️ Mutation: deleteStudent - ID:", args.id);

        if (!args.id) {
          throw new ValidationError("Student ID is required");
        }
        const student = await context.dataSources.students.getStudent({
          id: args.id,
        });
        if (!student) {
          console.log(
            `❌ Mutation: deleteStudent - Student not found: ${args.id}`
          );
          throw new NotFoundError("Student", args.id);
        }

        console.log(
          `📋 Mutation: deleteStudent - Student found: "${
            student.name || "Unknown"
          }"`
        );

        // Delete photo file if exists (handles both local and Vercel Blob)
        if (student.photo) {
          try {
            console.log(
              `📸 Mutation: deleteStudent - Deleting photo: ${student.photo}`
            );
            await deletePhoto(student.photo);
            console.log(
              `✅ Mutation: deleteStudent - Photo deleted: ${student.photo}`
            );
          } catch (error) {
            console.warn(
              "⚠️ Mutation: deleteStudent - Error deleting photo file:",
              error
            );
            // Continue with student deletion even if photo deletion fails
          }
        }

        const result = await context.dataSources.students.deleteStudent({
          id: args.id,
        });

        console.log(
          `✅ Mutation: deleteStudent - Success: Student "${
            student.name || "Unknown"
          }" deleted`
        );
        return result;
      } catch (error) {
        console.error("❌ Mutation: deleteStudent - Error:", error);
        if (
          error instanceof NotFoundError ||
          error instanceof ValidationError
        ) {
          throw error;
        }
        throw new DatabaseError("Failed to delete student", error);
      }
    },
    deleteStudents: async (
      _: unknown,
      args: DeleteStudentsArgs,
      context: ApolloContext
    ) => {
      try {
        console.log("🗑️ Mutation: deleteStudents - IDs:", args.ids);

        if (!args.ids || args.ids.length === 0) {
          throw new ValidationError("At least one student ID is required");
        }

        // Get all students to delete their photos
        const studentsToDelete = await Promise.all(
          args.ids.map((id) => context.dataSources.students.getStudent({ id }))
        );

        const validStudents = studentsToDelete.filter(
          (student): student is NonNullable<typeof student> => student !== null
        ) as StudentParent[];

        console.log(
          `📋 Mutation: deleteStudents - Found ${validStudents.length} student(s) to delete`
        );

        // Delete all photos
        for (const student of validStudents) {
          if (student && student.photo) {
            try {
              const studentId =
                student._id?.toString() || student.id || "unknown";
              console.log(
                `📸 Mutation: deleteStudents - Deleting photo: ${student.photo}`
              );
              await deletePhoto(student.photo);
            } catch (error) {
              const studentId =
                student._id?.toString() || student.id || "unknown";
              console.warn(
                `⚠️ Mutation: deleteStudents - Error deleting photo for student ${studentId}:`,
                error
              );
              // Continue even if photo deletion fails
            }
          }
        }

        // Delete students from database
        const deletedCount = await context.dataSources.students.deleteStudents({
          ids: args.ids,
        });

        console.log(
          `✅ Mutation: deleteStudents - Success: Deleted ${deletedCount} student(s)`
        );

        return deletedCount;
      } catch (error) {
        console.error("❌ Mutation: deleteStudents - Error:", error);
        if (
          error instanceof NotFoundError ||
          error instanceof ValidationError
        ) {
          throw error;
        }
        throw new DatabaseError("Failed to delete students", error);
      }
    },
  },
};
