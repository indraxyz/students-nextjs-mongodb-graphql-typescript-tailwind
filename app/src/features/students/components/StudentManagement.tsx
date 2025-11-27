"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Student } from "../types/student";
import { Trash2, Check } from "lucide-react";
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
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );

  // Create a stable string of student IDs for dependency comparison
  const filteredStudentIds = useMemo(
    () =>
      search.filteredStudents
        .map((s) => s.id)
        .filter(Boolean)
        .sort()
        .join(","),
    [search.filteredStudents]
  );

  // Clear selection when students list changes (e.g., after delete, search, etc.)
  useEffect(() => {
    // Only keep selected students that still exist in the filtered list
    const filteredIds = new Set(filteredStudentIds.split(",").filter(Boolean));

    setSelectedStudents((prev) => {
      // Check if any selected student is no longer in the filtered list
      let needsUpdate = false;
      const newSet = new Set<string>();

      prev.forEach((id) => {
        if (filteredIds.has(id)) {
          newSet.add(id);
        } else {
          needsUpdate = true;
        }
      });

      // Only update if there's a change
      if (!needsUpdate && newSet.size === prev.size) {
        return prev; // Return same reference to prevent re-render
      }

      return newSet;
    });
  }, [filteredStudentIds]);

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
    setSelectedStudents(new Set());
    ui.showCreateForm();
  }, [ui]);

  const handleEdit = useCallback(
    (student: Student) => {
      setFormError(null);
      setSelectedStudents(new Set());
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

  const requestBulkDelete = useCallback(() => {
    if (selectedStudents.size === 0) return;
    setConfirmDeleteState({
      ids: Array.from(selectedStudents),
      count: selectedStudents.size,
      isProcessing: false,
      isBulk: true,
    });
  }, [selectedStudents]);

  const handleSelectStudent = useCallback((id: string, selected: boolean) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedStudents.size === search.filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      const allIds = new Set(
        search.filteredStudents.map((s) => s.id).filter(Boolean) as string[]
      );
      setSelectedStudents(allIds);
    }
  }, [selectedStudents.size, search.filteredStudents]);

  const handleClearSelection = useCallback(() => {
    setSelectedStudents(new Set());
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDeleteState) return;
    setConfirmDeleteState((prev) =>
      prev ? { ...prev, isProcessing: true } : prev
    );

    try {
      if (confirmDeleteState.isBulk && confirmDeleteState.ids) {
        const deletedCount = await crud.deleteStudents(confirmDeleteState.ids);
        showToast(`Successfully deleted ${deletedCount} student(s)`);
        setSelectedStudents(new Set());
      } else if (confirmDeleteState.id) {
        await crud.deleteStudent(confirmDeleteState.id);
        showToast(`Student ${confirmDeleteState.name} deleted successfully`);
      }
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

      {/* Bulk Actions Bar */}
      {selectedStudents.size > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedStudents.size} student(s) selected
            </span>
            <button
              onClick={handleClearSelection}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              disabled={isAnyLoading}
            >
              Clear selection
            </button>
          </div>
          <button
            onClick={requestBulkDelete}
            disabled={isAnyLoading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedStudents.size})
          </button>
        </div>
      )}

      {hasStudents ? (
        <div className="space-y-4">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              disabled={isAnyLoading}
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                selectedStudents.size === search.filteredStudents.length &&
                search.filteredStudents.length > 0
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white hover:border-blue-400"
              } disabled:cursor-not-allowed disabled:opacity-50`}
              aria-label="Select all students"
            >
              {selectedStudents.size === search.filteredStudents.length &&
                search.filteredStudents.length > 0 && (
                  <Check className="h-3 w-3" />
                )}
            </button>
            <span className="text-sm text-gray-600">
              {selectedStudents.size === search.filteredStudents.length &&
              search.filteredStudents.length > 0
                ? "Deselect all"
                : "Select all"}
            </span>
          </div>

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
                  isSelected={selectedStudents.has(student.id)}
                  onSelect={handleSelectStudent}
                  showCheckbox={true}
                />
              );
            })}
          </div>
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
          count={confirmDeleteState.count}
          isBulk={confirmDeleteState.isBulk}
          isProcessing={confirmDeleteState.isProcessing}
          onCancel={closeConfirmDialog}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
