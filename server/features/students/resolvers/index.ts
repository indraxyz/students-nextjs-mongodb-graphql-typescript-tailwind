import { formatISO } from "date-fns";
import {
  StudentParent,
  QueryArgs,
  StudentQueryArgs,
  CreateStudentArgs,
  UpdateStudentArgs,
  DeleteStudentArgs,
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
        return await context.dataSources.students.getAllStudents(
          validatedInput
        );
      } catch (error) {
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
          throw new NotFoundError("Student", args.id);
        }
        return student;
      } catch (error) {
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
        const validatedInput = studentInputSchema.parse(args.input);
        const newStudent = await context.dataSources.students.createStudent({
          input: validatedInput,
        });
        return newStudent;
      } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
          throw new ValidationError("Invalid student data", {
            validation: error.message,
          });
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
        if (!args.id) {
          throw new ValidationError("Student ID is required");
        }
        const validatedInput = studentInputSchema.parse(args.input);
        const updatedStudent = await context.dataSources.students.updateStudent(
          {
            input: { id: args.id, ...validatedInput },
          }
        );
        if (!updatedStudent) {
          throw new NotFoundError("Student", args.id);
        }
        return updatedStudent;
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof ValidationError
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
        if (!args.id) {
          throw new ValidationError("Student ID is required");
        }
        const student = await context.dataSources.students.getStudent({
          id: args.id,
        });
        if (!student) {
          throw new NotFoundError("Student", args.id);
        }
        const result = await context.dataSources.students.deleteStudent({
          id: args.id,
        });
        return result;
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof ValidationError
        ) {
          throw error;
        }
        throw new DatabaseError("Failed to delete student", error);
      }
    },
  },
};
