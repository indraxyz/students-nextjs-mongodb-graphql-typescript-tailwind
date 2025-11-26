import { Student } from "../../types/student";
import {
  formatDateTime,
  formatDate,
  getRelativeTime,
} from "@/app/src/shared/utils";
import { Mail, MapPin, Calendar, Edit, Trash2, User } from "lucide-react";

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
    <article className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500">
      {/* Photo Section - Full Width at Top */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {student.photo ? (
          <img
            src={student.photo}
            alt={student.name || "Student photo"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Hide image if it fails to load, show placeholder
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <User className="h-16 w-16 text-gray-400" />
          </div>
        )}
        {/* Age Badge */}
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-gray-700 backdrop-blur-sm shadow-md">
          {student.age || 0} years
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name and Email */}
        <div className="mb-4">
          <h3 className="mb-1 text-xl font-bold text-gray-900 line-clamp-1">
            {student.name || "Unknown Student"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="truncate">{student.email || "-"}</span>
          </div>
        </div>

        {/* Address */}
        {student.address && (
          <div className="mb-4 flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <p className="text-sm text-gray-600 line-clamp-2">
              {student.address}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="mb-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated: {formatDateTime(student.updatedAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && onEdit && onDeleteRequest && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(student)}
              disabled={disabled}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
              aria-label={`Edit ${student.name}`}
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => onDeleteRequest(student.id, student.name)}
              disabled={disabled}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-50"
              aria-label={`Delete ${student.name}`}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
