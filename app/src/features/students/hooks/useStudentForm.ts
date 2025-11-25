import { useState, useEffect } from "react";
import {
  StudentFormData,
  StudentFormErrors,
  UseStudentFormProps,
} from "../types/student";

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
  });

  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || "",
        email: editingStudent.email || "",
        age: editingStudent?.age || 0,
        address: editingStudent.address || "",
      });
    } else {
      resetForm();
    }
  }, [editingStudent]);

  const resetForm = () => {
    setFormData({ name: "", email: "", age: 0, address: "" });
    setErrors({});
    onReset();
  };

  const validateForm = (): boolean => {
    const newErrors: StudentFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama harus diisi";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.age) {
      newErrors.age = "Umur harus diisi";
    } else {
      const age = parseInt(formData.age.toString());
      if (isNaN(age) || age < 1 || age > 120) {
        newErrors.age = "Umur harus antara 1-120 tahun";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Alamat harus diisi";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Alamat minimal 5 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const input: StudentFormData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: parseInt(formData.age.toString()),
        address: formData.address.trim(),
      };

      await onSubmit(input);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateForm,
  };
}
