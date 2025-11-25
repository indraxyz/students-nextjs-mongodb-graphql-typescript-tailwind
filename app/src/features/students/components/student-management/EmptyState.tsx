export interface EmptyStateProps {
  hasSearch: boolean;
  searchTerm?: string;
  onCreate: () => void;
}

export function EmptyState({ hasSearch, searchTerm, onCreate }: EmptyStateProps) {
  return (
    <div className="mt-12 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
      <svg
        className="mx-auto mb-4 h-16 w-16 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900">
        {hasSearch ? "No search results" : "No data student"}
      </h3>
      <p className="mt-2 text-gray-600">
        {hasSearch
          ? `No student found matching the search "${
              searchTerm || ""
            }"`
          : "Start by adding your first student"}
      </p>
      {!hasSearch && (
        <button
          onClick={onCreate}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Add First Student
        </button>
      )}
    </div>
  );
}
