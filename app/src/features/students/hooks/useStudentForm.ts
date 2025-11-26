import { useState, useEffect } from "react";
import { z } from "zod";
import {
  StudentFormData,
  StudentFormErrors,
  UseStudentFormProps,
} from "../types/student";
import { studentFormSchema } from "@/app/src/shared/validation/studentSchema";

export function useStudentForm({
  editingStudent,
  onSubmit,
  onReset,
}: UseStudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    email: "",
    age: 0,
    address: "",
    photo: undefined,
  });

  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [oldPhotoPath, setOldPhotoPath] = useState<string | null>(null);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || "",
        email: editingStudent.email || "",
        age: editingStudent?.age || 0,
        address: editingStudent.address || "",
        photo: editingStudent.photo,
      });
      setPhotoPreview(editingStudent.photo || null);
      setPhotoFile(null);
      setOldPhotoPath(editingStudent.photo || null);
    } else {
      resetForm();
    }
  }, [editingStudent]);

  const resetForm = () => {
    setFormData({ name: "", email: "", age: 0, address: "", photo: undefined });
    setErrors({});
    setPhotoFile(null);
    setPhotoPreview(null);
    setOldPhotoPath(null);
    onReset();
  };

  const validateForm = (): boolean => {
    try {
      // Prepare data for validation (convert age to number if it's a string)
      const dataToValidate = {
        name: formData.name,
        email: formData.email,
        age:
          typeof formData.age === "string"
            ? parseInt(formData.age)
            : formData.age,
        address: formData.address,
        photo: formData.photo,
      };

      // Validate using Zod schema
      studentFormSchema.parse(dataToValidate);

      // Clear errors if validation passes
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: StudentFormErrors = {};

        // Extract field-specific errors from Zod
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof StudentFormErrors;
          if (field) {
            newErrors[field] = issue.message;
          }
        });

        setErrors(newErrors);
        return false;
      }

      // Fallback error handling
      setErrors({});
      return false;
    }
  };

  const handleInputChange = (
    field: keyof StudentFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoChange = (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(null);
      setFormData((prev) => ({ ...prev, photo: undefined }));
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Only JPG, JPEG, and PNG files are allowed",
      }));
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "File size must be less than 1MB",
      }));
      return;
    }

    setPhotoFile(file);
    setErrors((prev) => ({ ...prev, photo: undefined }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert photo file to base64 if a new file is selected
      let photoBase64: string | undefined = undefined;
      if (photoFile) {
        try {
          photoBase64 = await fileToBase64(photoFile);
        } catch (error) {
          console.error("Error converting photo to base64:", error);
          setErrors((prev) => ({
            ...prev,
            photo: "Failed to process photo. Please try again.",
          }));
          setIsSubmitting(false);
          return;
        }
      }

      const input: StudentFormData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: parseInt(formData.age.toString()),
        address: formData.address.trim(),
        // Include photo as base64 if new file, or existing photo path if no new file
        // Only include photo if it has a value, otherwise omit it (undefined)
        ...(photoBase64
          ? { photo: photoBase64 }
          : formData.photo
          ? { photo: formData.photo }
          : {}),
      };

      // Ensure photo is undefined (not null) if not provided
      if (!input.photo) {
        delete input.photo;
      }

      console.log("Submitting student data:", {
        ...input,
        photo: photoBase64 ? "base64 (new)" : input.photo ? "existing" : "none",
      });

      await onSubmit(input);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Re-throw error so parent component can handle it
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const setFieldErrors = (fieldErrors: StudentFormErrors) => {
    setErrors(fieldErrors);
  };

  return {
    formData,
    errors,
    isSubmitting: isSubmitting,
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
    resetForm,
    validateForm,
    setFieldErrors,
    photoPreview,
    photoFile,
  };
}
