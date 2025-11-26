"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Student } from "../types/student";
import {
  useStudentForm,
  useStudentCRUD,
  useStudentSearch,
  useStudentUI,
} from "../hooks";
import {
  PageHeader,
  SearchToolbar,
  StatsBar,
  StudentFormModal,
  StudentCard,
  EmptyState,
  ToastBanner,
  ConfirmDialog,
  StateOverlay,
  type ToastStatus,
  type ToastState,
  type ConfirmDeleteState,
} from "./student-management";

/**
 * Student management UI with enhanced UX, accessibility, and DX ergonomics.
 */
export default function StudentManagementAdvanced() {
  const ui = useStudentUI();
  const crud = useStudentCRUD({
    searchTerm: "",
    sortBy: "name",
    sortOrder: "asc",
    limit: 50,
    offset: 0,
  });
  const search = useStudentSearch({
    students: crud.students,
  });

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteState, setConfirmDeleteState] =
    useState<ConfirmDeleteState | null>(null);

  const showToast = useCallback(
    (message: string, status: ToastStatus = "success") => {
      setToast({ message, status });
    },
    []
  );

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      dismissToast();
    }, 4000);
  }, [toast, dismissToast]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const isMongoConnectionError = useCallback((error: unknown): boolean => {
    if (!error || typeof error !== "object") return false;

    // Check GraphQL error extensions
    if (
      "graphQLErrors" in error &&
      Array.isArray((error as any).graphQLErrors)
    ) {
      const graphQLErrors = (error as any).graphQLErrors;
      return graphQLErrors.some(
        (err: any) =>
          err?.extensions?.code === "MONGODB_CONNECTION_ERROR" ||
          err?.message?.includes("Cannot connect to MongoDB") ||
          err?.message?.includes("MongoDB Atlas")
      );
    }

    // Check network error
    if ("networkError" in error) {
      const networkError = (error as any).networkError;
      if (networkError?.result?.errors) {
        return networkError.result.errors.some(
          (err: any) =>
            err?.extensions?.code === "MONGODB_CONNECTION_ERROR" ||
            err?.message?.includes("Cannot connect to MongoDB")
        );
      }
    }

    // Check error message directly
    const errorMessage = error instanceof Error ? error.message : String(error);
    return (
      errorMessage.includes("Cannot connect to MongoDB") ||
      errorMessage.includes("MongoDB Atlas") ||
      errorMessage.includes("MONGODB_CONNECTION_ERROR")
    );
  }, []);

  const parseErrorMessage = useCallback((error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }
    return "An error occurred. Please try again.";
  }, []);

  const getMongoErrorMessage = useCallback(() => {
    return {
      title: "Cannot Connect to MongoDB",
      description:
        "If you're using MongoDB Atlas M0 (free tier), the cluster may be paused after 30 days of inactivity. The system is waiting 10-30 seconds for it to wake up. Please wait a moment and try again.",
    };
  }, []);

  const form = useStudentForm({
    editingStudent: ui.editingStudent,
    onSubmit: async (data) => {
      setFormError(null);
      try {
        if (ui.isEditing && ui.editingStudent) {
          await crud.updateStudent(ui.editingStudent.id, data);
          showToast("Student updated successfully");
        } else {
          await crud.createStudent(data);
          showToast("Student created successfully");
        }
        ui.hideForm();
      } catch (error) {
        const message = parseErrorMessage(error);
        setFormError(message);
        showToast(message, "error");

        // Extract field-specific errors from GraphQL error
        if (error && typeof error === "object") {
          // Check for GraphQL errors with field information
          if (
            "graphQLErrors" in error &&
            Array.isArray((error as any).graphQLErrors)
          ) {
            const graphQLErrors = (error as any).graphQLErrors;
            const fieldErrors: Record<string, string> = {};

            graphQLErrors.forEach((err: any) => {
              // Check if error has field information in extensions
              if (
                err?.extensions?.fields &&
                typeof err.extensions.fields === "object"
              ) {
                Object.assign(fieldErrors, err.extensions.fields);
              }
            });

            // Set field errors if any were found
            if (Object.keys(fieldErrors).length > 0) {
              form.setFieldErrors(fieldErrors);
            }
          }

          // Check network error for field information
          if ("networkError" in error) {
            const networkError = (error as any).networkError;
            if (networkError?.result?.errors) {
              const fieldErrors: Record<string, string> = {};

              networkError.result.errors.forEach((err: any) => {
                if (
                  err?.extensions?.fields &&
                  typeof err.extensions.fields === "object"
                ) {
                  Object.assign(fieldErrors, err.extensions.fields);
                }
              });

              if (Object.keys(fieldErrors).length > 0) {
                form.setFieldErrors(fieldErrors);
              }
            }
          }
        }

        console.error("Form submission error:", error);
      }
    },
    onReset: () => {
      ui.hideForm();
      setFormError(null);
    },
  });

  const isAnyLoading = useMemo(
    () => crud.isLoading || form.isSubmitting || ui.isLoading,
    [crud.isLoading, form.isSubmitting, ui.isLoading]
  );

  const handleCreate = useCallback(() => {
    setFormError(null);
    ui.showCreateForm();
  }, [ui]);

  const handleEdit = useCallback(
    (student: Student) => {
      setFormError(null);
      ui.handleEdit(student);
    },
    [ui]
  );

  const requestDelete = useCallback((id: string, name?: string | null) => {
    setConfirmDeleteState({
      id,
      name: name?.trim() || "Student",
      isProcessing: false,
    });
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDeleteState(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDeleteState) return;
    setConfirmDeleteState((prev) =>
      prev ? { ...prev, isProcessing: true } : prev
    );

    try {
      await crud.deleteStudent(confirmDeleteState.id);
      showToast(`Student ${confirmDeleteState.name} deleted successfully`);
    } catch (error) {
      const message = parseErrorMessage(error);
      showToast(message, "error");
    } finally {
      setConfirmDeleteState(null);
    }
  }, [confirmDeleteState, crud, parseErrorMessage, showToast]);

  // if (crud.queryLoading) {
  //   return (
  //     <StateOverlay
  //       variant="loading"
  //       title="Memuat data students"
  //       description="Mohon tunggu sebentar..."
  //     />
  //   );
  // }

  if (crud.error) {
    const isMongoError = isMongoConnectionError(crud.error);
    const mongoError = isMongoError ? getMongoErrorMessage() : null;

    return (
      <StateOverlay
        variant="error"
        title={mongoError?.title || "Failed to load data"}
        description={mongoError?.description || crud.error.message}
        onRetry={crud.refetch}
      />
    );
  }

  const hasStudents = search.filteredStudents.length > 0;

  return (
    <div className="relative max-w-6xl mx-auto p-6">
      <PageHeader
        stats={search.searchStats}
        onCreate={handleCreate}
        disabled={isAnyLoading}
      />

      <div className="mb-6 space-y-4">
        <SearchToolbar
          searchTerm={search.searchTerm}
          sortBy={search.sortBy}
          sortOrder={search.sortOrder}
          sortOptions={search.sortOptions}
          onSearchChange={search.handleSearchChange}
          onSortChange={search.handleSortChange}
          onToggleSortOrder={search.toggleSortOrder}
        />

        <StatsBar stats={search.searchStats} isLoading={isAnyLoading} />
      </div>

      {hasStudents ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {search.filteredStudents.map((student) => {
            if (!student?.id) return null;
            return (
              <StudentCard
                key={student.id}
                student={student}
                disabled={isAnyLoading}
                onEdit={handleEdit}
                onDeleteRequest={requestDelete}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          hasSearch={search.searchStats.hasSearch}
          searchTerm={search.searchStats.searchTerm}
          onCreate={handleCreate}
        />
      )}

      {ui.showForm && (
        <StudentFormModal
          isEditing={ui.isEditing}
          formData={form.formData}
          errors={form.errors}
          isSubmitting={form.isSubmitting}
          onInputChange={form.handleInputChange}
          onPhotoChange={form.handlePhotoChange}
          onSubmit={form.handleSubmit}
          onClose={ui.hideForm}
          formError={formError}
          photoPreview={form.photoPreview}
        />
      )}

      {toast && <ToastBanner toast={toast} onDismiss={dismissToast} />}

      {confirmDeleteState && (
        <ConfirmDialog
          studentName={confirmDeleteState.name}
          isProcessing={confirmDeleteState.isProcessing}
          onCancel={closeConfirmDialog}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
