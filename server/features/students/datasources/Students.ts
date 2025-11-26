import { MongoDataSource } from "apollo-datasource-mongodb";
import { StudentModel as Student } from "../models/Student";
import { StudentDocument } from "../types";
import { StudentInput, SearchStudentInput } from "../schemas/validation";
import { DatabaseError, NotFoundError } from "@/server/shared/errors";

export default class Students extends MongoDataSource<StudentDocument> {
  async getAllStudents(input: SearchStudentInput): Promise<StudentDocument[]> {
    try {
      const { searchTerm, sortBy, sortOrder, limit, offset } = input;
      let query: Record<string, unknown> = {};

      if (searchTerm && searchTerm.trim() !== "") {
        const searchRegex = new RegExp(searchTerm, "i");
        query = {
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { address: searchRegex },
            ...(isNaN(Number(searchTerm)) ? [] : [{ age: Number(searchTerm) }]),
          ],
        };
      }

      const sortObj: Record<string, 1 | -1> = {};
      sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

      const students = await Student.find(query)
        .sort(sortObj)
        .limit(limit)
        .skip(offset);

      return students;
    } catch (error) {
      throw new DatabaseError("Failed to fetch students", error);
    }
  }

  async getStudent({ id }: { id: string }): Promise<StudentDocument | null> {
    try {
      if (!id) {
        throw new Error("Student ID is required");
      }
      return await Student.findById(id);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Student ID is required"
      ) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch student", error);
    }
  }

  async createStudent({
    input,
  }: {
    input: StudentInput;
  }): Promise<StudentDocument> {
    try {
      const newStudent = await Student.create(input);
      return newStudent;
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        throw new DatabaseError(`Validation failed: ${error.message}`, error);
      }
      throw new DatabaseError("Failed to create student", error);
    }
  }

  async updateStudent({
    input,
  }: {
    input: StudentInput & { id: string };
  }): Promise<StudentDocument> {
    try {
      const { id, ...updateData } = input;

      if (!id) {
        throw new Error("Student ID is required");
      }

      const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedStudent) {
        throw new NotFoundError("Student", id);
      }

      return updatedStudent;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error && error.name === "ValidationError") {
        throw new DatabaseError(`Validation failed: ${error.message}`, error);
      }
      throw new DatabaseError("Failed to update student", error);
    }
  }

  async deleteStudent({ id }: { id: string }): Promise<string> {
    try {
      if (!id) {
        throw new Error("Student ID is required");
      }

      const deletedStudent = await Student.findByIdAndDelete(id);

      if (!deletedStudent) {
        throw new NotFoundError("Student", id);
      }

      return "Student deleted successfully";
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to delete student", error);
    }
  }
}
