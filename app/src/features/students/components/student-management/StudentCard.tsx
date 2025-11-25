import { Student } from "../../types/student";
import {
  formatDateTime,
  formatDate,
  getRelativeTime,
} from "@/app/src/shared/utils";

export interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDeleteRequest?: (id: string, name?: string | null) => void;
  disabled?: boolean;
  showActions?: boolean;
}

export function StudentCard({
  student,
  onEdit,
  onDeleteRequest,
  disabled = false,
  showActions = true,
}: StudentCardProps) {
  return (
    <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-lg font-semibold text-gray-900">
            {student.name || "-"}
          </span>
          <p className="text-sm text-gray-500">{student.email || "-"}</p>
        </div>
        <span className="text-sm text-gray-500">
          {student.age || 0} years old
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-gray-600">
        <div>
          <dt className="font-medium">Address</dt>
          <dd>{student.address || "-"}</dd>
        </div>
        <div className="text-xs text-gray-500">
          <p>Created: {formatDateTime(student.createdAt)}</p>
          <p>Updated: {formatDateTime(student.updatedAt)}</p>
        </div>
      </dl>

      {showActions && onEdit && onDeleteRequest && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit(student)}
            disabled={disabled}
            className="flex-1 rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteRequest(student.id, student.name)}
            disabled={disabled}
            className="flex-1 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
