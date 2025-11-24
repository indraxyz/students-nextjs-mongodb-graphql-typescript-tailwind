import { Student } from "../../../types/student";
import { formatDateTime, formatDate, getRelativeTime } from "@/app/study-graphql/shared/utils";

export interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDeleteRequest: (id: string, name?: string | null) => void;
  disabled: boolean;
}

export function StudentCard({
  student,
  onEdit,
  onDeleteRequest,
  disabled,
}: StudentCardProps) {
  return (
    <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {student.name || "-"}
          </h3>
          <p className="text-sm text-gray-500">{student.email || "-"}</p>
        </div>
        <span className="text-sm text-gray-500">{student.age || 0} tahun</span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-gray-600">
        <div>
          <dt className="font-medium">Alamat</dt>
          <dd>{student.address || "-"}</dd>
        </div>
        <div className="text-xs text-gray-500">
          <p>
            Dibuat: {formatDate(student.createdAt)} (
            {getRelativeTime(student.createdAt)})
          </p>
          <p>Diperbarui: {formatDateTime(student.updatedAt)}</p>
        </div>
      </dl>

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
          Hapus
        </button>
      </div>
    </article>
  );
}
