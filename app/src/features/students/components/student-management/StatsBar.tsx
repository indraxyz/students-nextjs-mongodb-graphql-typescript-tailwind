import { SearchStats } from "./types";

export interface StatsBarProps {
  stats: SearchStats;
  isLoading: boolean;
}

export function StatsBar({ stats, isLoading }: StatsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
      <span>
        {stats.hasSearch ? (
          <>
            Showing {stats.filtered} from {stats.total} results for "
            {stats.searchTerm}"
          </>
        ) : (
          <>Showing {stats.total} students</>
        )}
      </span>
      {isLoading && (
        <span className="flex items-center gap-2 text-blue-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          Loading...
        </span>
      )}
    </div>
  );
}
