import { z } from "zod";

export const studentInputSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.email("Invalid email format").trim().toLowerCase(),
  age: z
    .number()
    .int("Age must be an integer")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be less than 500 characters")
    .trim(),
  photo: z.string().nullable().optional(),
});

export const searchStudentInputSchema = z.object({
  searchTerm: z.string().optional(),
  sortBy: z
    .enum(["name", "email", "age", "address", "createdAt", "updatedAt"])
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export type StudentInput = z.infer<typeof studentInputSchema>;
export type SearchStudentInput = z.infer<typeof searchStudentInputSchema>;
