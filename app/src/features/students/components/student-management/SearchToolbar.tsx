import { useId } from "react";
import { Student } from "../../types/student";

export interface SearchToolbarProps {
  searchTerm: string;
  sortBy: keyof Student;
  sortOrder: "asc" | "desc";
  sortOptions: readonly { value: keyof Student | string; label: string }[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: keyof Student) => void;
  onToggleSortOrder: () => void;
}

export function SearchToolbar({
  searchTerm,
  sortBy,
  sortOrder,
  sortOptions,
  onSearchChange,
  onSortChange,
  onToggleSortOrder,
}: SearchToolbarProps) {
  const searchInputId = useId();
  const sortSelectId = useId();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <label htmlFor={searchInputId} className="sr-only">
          Search student
        </label>
        <input
          id={searchInputId}
          type="search"
          placeholder="Search name, email, address, or age..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <div>
          <label htmlFor={sortSelectId} className="sr-only">
            Sort by
          </label>
          <select
            id={sortSelectId}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as keyof Student)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onToggleSortOrder}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={`Sort by ${
            sortOrder === "asc" ? "ascending (A-Z)" : "descending (Z-A)"
          }`}
        >
          {sortOrder === "asc" ? "↑ A-Z" : "↓ Z-A"}
        </button>
      </div>
    </div>
  );
}
