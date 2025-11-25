import { PageHeaderProps } from "./types";

export function PageHeader({ stats, onCreate, disabled }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Advanced Student Management
        </h1>
        {/* <p className="text-gray-600 mt-1">
          Total: {stats.total} students
          {stats.hasSearch && (
            <span className="ml-2 text-blue-600">
              • Filtered: {stats.filtered}
            </span>
          )}
        </p> */}
      </div>
      <button
        onClick={onCreate}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        + Add Student
      </button>
    </div>
  );
}
