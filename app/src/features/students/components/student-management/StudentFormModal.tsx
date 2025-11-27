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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-xl border-2 border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Student" : "Add Student"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Close form"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {formError && (
          <div
            role="alert"
            className="mx-6 mt-4 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
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
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300"
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
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300"
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
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300"
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
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300 resize-none"
                rows={3}
                placeholder="Enter full address"
              />
            )}
          />

          <FormField
            label="Photo"
            error={errors.photo}
            render={(inputId) => (
              <div className="space-y-3">
                {photoPreview && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
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
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 file:transition-colors hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-xs text-gray-500 font-medium">
                  Max file size: 1MB. Allowed formats: JPG, JPEG, PNG
                </p>
              </div>
            )}
          />

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl border-2 border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-blue-600 disabled:hover:bg-blue-600 active:scale-95"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Student"
                : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
