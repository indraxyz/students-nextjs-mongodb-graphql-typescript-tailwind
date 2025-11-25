import type { FormEvent } from "react";
import { StudentFormData, StudentFormErrors } from "../../types/student";
import { FormField } from "./FormField";

export interface StudentFormModalProps {
  isEditing: boolean;
  formData: StudentFormData;
  errors: StudentFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof StudentFormData, value: string | number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  formError: string | null;
}

export function StudentFormModal({
  isEditing,
  formData,
  errors,
  isSubmitting,
  onInputChange,
  onSubmit,
  onClose,
  formError,
}: StudentFormModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Student" : "Add Student"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        {formError && (
          <div
            role="alert"
            className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <FormField
            label="Name"
            required
            error={errors.name}
            render={(inputId) => (
              <input
                id={inputId}
                type="text"
                value={formData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
              />
            )}
          />

          <FormField
            label="Email Address"
            required
            error={errors.email}
            render={(inputId) => (
              <input
                id={inputId}
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
              />
            )}
          />

          <FormField
            label="Age"
            required
            error={errors.age}
            render={(inputId) => (
              <input
                id={inputId}
                type="number"
                min={1}
                max={120}
                value={formData.age}
                onChange={(e) => onInputChange("age", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter age"
              />
            )}
          />

          <FormField
            label="Address"
            required
            error={errors.address}
            render={(inputId) => (
              <textarea
                id={inputId}
                value={formData.address}
                onChange={(e) => onInputChange("address", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter full address"
              />
            )}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Student"
                : "Add Student"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
