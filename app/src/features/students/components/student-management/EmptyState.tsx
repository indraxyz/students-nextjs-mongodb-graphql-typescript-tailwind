import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, Plus } from "lucide-react";

export interface EmptyStateProps {
  hasSearch: boolean;
  searchTerm?: string;
  onCreate: () => void;
}

export function EmptyState({ hasSearch, searchTerm, onCreate }: EmptyStateProps) {
  return (
    <Card className="mt-8 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          {hasSearch ? (
            <Search className="h-8 w-8 text-muted-foreground" />
          ) : (
            <Users className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {hasSearch ? "No search results" : "No students yet"}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {hasSearch
            ? `No student found matching "${searchTerm || ""}". Try a different search term.`
            : "Get started by adding your first student to the system."}
        </p>
        {!hasSearch && (
          <Button onClick={onCreate} className="mt-6">
            <Plus className="h-4 w-4" />
            Add First Student
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
