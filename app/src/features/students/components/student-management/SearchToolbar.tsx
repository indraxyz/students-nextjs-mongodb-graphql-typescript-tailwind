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
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300"
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
            className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300 cursor-pointer"
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
          className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 active:scale-95"
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
