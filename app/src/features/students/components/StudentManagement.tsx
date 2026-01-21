"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Student } from "../types/student";
import { Trash2, CheckSquare, X } from "lucide-react";
import {
  useStudentForm,
  useStudentCRUD,
  useStudentSearch,
  useStudentUI,
} from "../hooks";
import {
  PageHeader,
  SearchToolbar,
  StudentFormModal,
  StudentCard,
  EmptyState,
  ConfirmDialog,
  StateOverlay,
  type ConfirmDeleteState,
} from "./student-management";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteState, setConfirmDeleteState] =
    useState<ConfirmDeleteState | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );

  const filteredStudentIds = useMemo(
    () =>
      search.filteredStudents
        .map((s) => s.id)
        .filter(Boolean)
        .sort()
        .join(","),
    [search.filteredStudents]
  );

  useEffect(() => {
    const filteredIds = new Set(filteredStudentIds.split(",").filter(Boolean));

    setSelectedStudents((prev) => {
      let needsUpdate = false;
      const newSet = new Set<string>();

      prev.forEach((id) => {
        if (filteredIds.has(id)) {
          newSet.add(id);
        } else {
          needsUpdate = true;
        }
      });

      if (!needsUpdate && newSet.size === prev.size) {
        return prev;
      }

      return newSet;
    });
  }, [filteredStudentIds]);

  const isMongoConnectionError = useCallback((error: unknown): boolean => {
    if (!error || typeof error !== "object") return false;

    if (
      "graphQLErrors" in error &&
      Array.isArray((error as Record<string, unknown>).graphQLErrors)
    ) {
      const graphQLErrors = (error as Record<string, unknown>)
        .graphQLErrors as Array<Record<string, unknown>>;
      return graphQLErrors.some(
        (err) =>
          (err?.extensions as Record<string, unknown>)?.code ===
            "MONGODB_CONNECTION_ERROR" ||
          (err?.message as string)?.includes("Cannot connect to MongoDB") ||
          (err?.message as string)?.includes("MongoDB Atlas")
      );
    }

    if ("networkError" in error) {
      const networkError = (error as Record<string, unknown>)
        .networkError as Record<string, unknown>;
      if (networkError?.result) {
        const result = networkError.result as { errors?: Array<Record<string, unknown>> };
        if (result.errors) {
          return result.errors.some(
            (err) =>
              (err?.extensions as Record<string, unknown>)?.code ===
                "MONGODB_CONNECTION_ERROR" ||
              (err?.message as string)?.includes("Cannot connect to MongoDB")
          );
        }
      }
    }

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
          toast.success("Student updated successfully");
        } else {
          await crud.createStudent(data);
          toast.success("Student created successfully");
        }
        ui.hideForm();
      } catch (error) {
        const message = parseErrorMessage(error);
        setFormError(message);
        toast.error(message);

        if (error && typeof error === "object") {
          if (
            "graphQLErrors" in error &&
            Array.isArray((error as Record<string, unknown>).graphQLErrors)
          ) {
            const graphQLErrors = (error as Record<string, unknown>)
              .graphQLErrors as Array<Record<string, unknown>>;
            const fieldErrors: Record<string, string> = {};

            graphQLErrors.forEach((err) => {
              const extensions = err?.extensions as Record<string, unknown>;
              if (
                extensions?.fields &&
                typeof extensions.fields === "object"
              ) {
                Object.assign(fieldErrors, extensions.fields);
              }
            });

            if (Object.keys(fieldErrors).length > 0) {
              form.setFieldErrors(fieldErrors);
            }
          }

          if ("networkError" in error) {
            const networkError = (error as Record<string, unknown>)
              .networkError as Record<string, unknown>;
            const result = networkError?.result as { errors?: Array<Record<string, unknown>> };
            if (result?.errors) {
              const fieldErrors: Record<string, string> = {};

              result.errors.forEach((err) => {
                const extensions = err?.extensions as Record<string, unknown>;
                if (
                  extensions?.fields &&
                  typeof extensions.fields === "object"
                ) {
                  Object.assign(fieldErrors, extensions.fields);
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
        toast.success(`Successfully deleted ${deletedCount} student(s)`);
        setSelectedStudents(new Set());
      } else if (confirmDeleteState.id) {
        await crud.deleteStudent(confirmDeleteState.id);
        toast.success(`Student ${confirmDeleteState.name} deleted successfully`);
      }
    } catch (error) {
      const message = parseErrorMessage(error);
      toast.error(message);
    } finally {
      setConfirmDeleteState(null);
    }
  }, [confirmDeleteState, crud, parseErrorMessage]);

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
  const allSelected =
    selectedStudents.size === search.filteredStudents.length &&
    search.filteredStudents.length > 0;

  return (
    <div className="relative mx-auto max-w-6xl p-4 md:p-6">
      <PageHeader onCreate={handleCreate} disabled={isAnyLoading} />

      <div className="mb-6">
        <SearchToolbar
          searchTerm={search.searchTerm}
          sortBy={search.sortBy}
          sortOrder={search.sortOrder}
          sortOptions={search.sortOptions}
          stats={search.searchStats}
          isLoading={isAnyLoading}
          onSearchChange={search.handleSearchChange}
          onSortChange={search.handleSortChange}
          onToggleSortOrder={search.toggleSortOrder}
        />
      </div>

      {/* Selection Controls & Bulk Actions */}
      {hasStudents && (
        <div
          className={cn(
            "mb-4 rounded-lg border transition-all duration-300",
            selectedStudents.size > 0
              ? "border-primary/30 bg-primary/5 shadow-sm"
              : "border-transparent bg-transparent"
          )}
        >
          <div className="flex items-center justify-between p-2 sm:p-3">
            {/* Left: Select All & Selection Count */}
            <div className="flex items-center gap-2">
              <div
                onClick={handleSelectAll}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-all duration-200",
                  "hover:bg-muted/50",
                  allSelected && "bg-primary/10"
                )}
              >
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  disabled={isAnyLoading}
                  aria-label="Select all students"
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm transition-colors",
                    allSelected
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {allSelected ? "All selected" : "Select all"}
                </span>
              </div>

              {/* Selection Count Badge with Clear */}
              {selectedStudents.size > 0 && (
                <Badge
                  variant="secondary"
                  onClick={handleClearSelection}
                  className="gap-1.5 bg-primary/10 text-primary border-primary/20 pl-2.5 pr-1.5 py-1 cursor-pointer hover:bg-primary/20 transition-colors animate-in fade-in slide-in-from-left-2 duration-200"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>{selectedStudents.size} selected</span>
                  <X className="h-3.5 w-3.5 ml-0.5 hover:text-destructive" />
                </Badge>
              )}
            </div>

            {/* Right: Delete Action */}
            {selectedStudents.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={requestBulkDelete}
                disabled={isAnyLoading}
                className="h-8 gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {hasStudents ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
