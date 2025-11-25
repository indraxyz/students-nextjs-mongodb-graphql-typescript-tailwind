import { useState, useCallback } from "react";
import { Student, UseStudentUIProps } from "../types/student";

export function useStudentUI({ onEdit, onDelete }: UseStudentUIProps = {}) {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showCreateForm = useCallback(() => {
    setEditingStudent(null);
    setShowForm(true);
  }, []);

  const showEditForm = useCallback(
    (student: Student) => {
      setEditingStudent(student);
      setShowForm(true);
      onEdit?.(student);
    },
    [onEdit]
  );

  const hideForm = useCallback(() => {
    setShowForm(false);
    setEditingStudent(null);
  }, []);

  const handleEdit = useCallback(
    (student: Student) => {
      showEditForm(student);
    },
    [showEditForm]
  );

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (!onDelete) return false;

      setIsLoading(true);
      try {
        const success = await onDelete(id, name);
        return success;
      } finally {
        setIsLoading(false);
      }
    },
    [onDelete]
  );

  const reset = useCallback(() => {
    setShowForm(false);
    setEditingStudent(null);
    setIsLoading(false);
  }, []);

  const isEditing = !!editingStudent;
  const isCreating = showForm && !editingStudent;
  const isFormVisible = showForm;

  return {
    showForm: isFormVisible,
    editingStudent,
    isLoading,
    isEditing,
    isCreating,
    showCreateForm,
    showEditForm,
    hideForm,
    handleEdit,
    handleDelete,
    reset,
    setShowForm,
    setEditingStudent,
    setIsLoading,
  };
}
