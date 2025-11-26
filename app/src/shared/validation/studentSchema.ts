import { z } from "zod";

/**
 * Student form validation schema
 * This schema matches the server-side validation for consistency
 */
export const studentFormSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.email("Invalid email format").trim().toLowerCase(),
  age: z
    .number({
      error: "Age is required",
    })
    .int("Age must be an integer")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  address: z
    .string({ error: "Address is required" })
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be less than 500 characters")
    .trim(),
  photo: z.string().nullable().optional(),
});

export type StudentFormSchema = z.infer<typeof studentFormSchema>;
