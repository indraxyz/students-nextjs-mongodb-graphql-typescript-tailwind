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
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {render(fieldId)}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
