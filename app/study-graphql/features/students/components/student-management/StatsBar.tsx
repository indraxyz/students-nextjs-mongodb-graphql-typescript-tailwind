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
            Menampilkan {stats.filtered} dari {stats.total} hasil untuk "
            {stats.searchTerm}"
          </>
        ) : (
          <>Menampilkan {stats.total} students</>
        )}
      </span>
      {isLoading && (
        <span className="flex items-center gap-2 text-blue-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          Memuat...
        </span>
      )}
    </div>
  );
}
