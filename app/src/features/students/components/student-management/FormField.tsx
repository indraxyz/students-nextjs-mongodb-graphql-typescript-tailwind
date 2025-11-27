import { useId } from "react";
import type { ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  render: (id: string) => ReactNode;
}

export function FormField({ label, required, error, render }: FormFieldProps) {
  const fieldId = useId();
  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-gray-900"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {render(fieldId)}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
