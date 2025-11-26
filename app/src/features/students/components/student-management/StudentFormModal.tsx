import type { FormEvent } from "react";
import { StudentFormData, StudentFormErrors } from "../../types/student";
import { FormField } from "./FormField";

export interface StudentFormModalProps {
  isEditing: boolean;
  formData: StudentFormData;
  errors: StudentFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof StudentFormData, value: string | number) => void;
  onPhotoChange?: (file: File | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  formError: string | null;
  photoPreview?: string | null;
}

export function StudentFormModal({
  isEditing,
  formData,
  errors,
  isSubmitting,
  onInputChange,
  onPhotoChange,
  onSubmit,
  onClose,
  formError,
  photoPreview,
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

          <FormField
            label="Photo"
            error={errors.photo}
            render={(inputId) => (
              <div className="space-y-2">
                {photoPreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  id={inputId}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onPhotoChange?.(file);
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500">
                  Max file size: 1MB. Allowed formats: JPG, JPEG, PNG
                </p>
              </div>
            )}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
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
