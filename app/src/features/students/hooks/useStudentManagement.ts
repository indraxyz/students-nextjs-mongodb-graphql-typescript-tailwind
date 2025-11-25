import { useCallback } from "react";
import { Student, StudentFormData } from "../types/student";
import { useStudentForm } from "./useStudentForm";
import { useStudentCRUD } from "./useStudentCRUD";
import { useStudentSearch } from "./useStudentSearch";
import { useStudentUI } from "./useStudentUI";

export function useStudentManagement() {
  const ui = useStudentUI();

  const search = useStudentSearch({
    students: [],
    onSearchChange: (searchTerm) => {
      crud.refetch();
    },
    onSortChange: (sortBy, sortOrder) => {
      crud.refetch();
    },
  });

  const crud = useStudentCRUD({
    searchTerm: search.debouncedSearchTerm,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    limit: 100,
    offset: 0,
  });

  const searchWithData = useStudentSearch({
    students: crud.students,
    onSearchChange: (searchTerm) => {},
    onSortChange: (sortBy, sortOrder) => {},
  });

  const form = useStudentForm({
    editingStudent: ui.editingStudent,
    onSubmit: async (data: StudentFormData) => {
      try {
        if (ui.isEditing && ui.editingStudent) {
          await crud.updateStudent(ui.editingStudent.id, data);
        } else {
          await crud.createStudent(data);
        }
        ui.hideForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
      }
    },
    onReset: () => {
      ui.hideForm();
    },
  });

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      try {
        const success = await crud.confirmDelete(id, name);
        if (success) {
          console.log(`Student ${name} berhasil dihapus`);
        }
        return success;
      } catch (error) {
        console.error("Error deleting student:", error);
        return false;
      }
    },
    [crud]
  );

  const handleEdit = useCallback(
    (student: Student) => {
      ui.handleEdit(student);
    },
    [ui]
  );

  const handleCreate = useCallback(() => {
    ui.showCreateForm();
  }, [ui]);

  const handleFormClose = useCallback(() => {
    ui.hideForm();
    form.resetForm();
  }, [ui, form]);

  return {
    students: crud.students,
    isLoading: crud.isLoading,
    error: crud.error,
    searchTerm: search.searchTerm,
    debouncedSearchTerm: search.debouncedSearchTerm,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    searchStats: searchWithData.searchStats,
    sortOptions: search.sortOptions,
    formData: form.formData,
    formErrors: form.errors,
    isSubmitting: form.isSubmitting,
    showForm: ui.showForm,
    editingStudent: ui.editingStudent,
    isEditing: ui.isEditing,
    isCreating: ui.isCreating,
    handleSearchChange: search.handleSearchChange,
    handleSortChange: search.handleSortChange,
    toggleSortOrder: search.toggleSortOrder,
    handleInputChange: form.handleInputChange,
    handleSubmit: form.handleSubmit,
    handleCreate,
    handleEdit,
    handleDelete,
    handleFormClose,
    refetch: crud.refetch,
    reset: () => {
      ui.reset();
      form.resetForm();
      search.setSearchTerm("");
    },
  };
}
