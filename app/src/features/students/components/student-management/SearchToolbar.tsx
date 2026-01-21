"use client";

import { useId } from "react";
import { Student } from "../../types/student";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Search,
  X,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchStats } from "./types";

export interface SearchToolbarProps {
  searchTerm: string;
  sortBy: keyof Student;
  sortOrder: "asc" | "desc";
  sortOptions: readonly { value: keyof Student | string; label: string }[];
  stats: SearchStats;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: keyof Student) => void;
  onToggleSortOrder: () => void;
}

export function SearchToolbar({
  searchTerm,
  sortBy,
  sortOrder,
  sortOptions,
  stats,
  isLoading = false,
  onSearchChange,
  onSortChange,
  onToggleSortOrder,
}: SearchToolbarProps) {
  const searchInputId = useId();

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
              searchTerm ? "text-primary" : "text-muted-foreground",
              "group-focus-within:text-primary"
            )}
          />
          <label htmlFor={searchInputId} className="sr-only">
            Search student
          </label>
          <Input
            id={searchInputId}
            type="search"
            placeholder="Search name, email, address, or age..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pl-10 h-11 transition-all duration-200",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              searchTerm && "border-primary/50 bg-primary/5"
            )}
          />
          {/* {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onSearchChange("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )} */}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as keyof Student)}
          >
            <SelectTrigger
              className={cn(
                "w-[140px] h-10 transition-all duration-200",
                sortBy !== "name" && "border-primary/50 bg-primary/5"
              )}
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant={sortOrder === "desc" ? "default" : "outline"}
            size="icon"
            onClick={onToggleSortOrder}
            title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
            className={cn(
              "h-10 w-10 transition-all duration-200",
              sortOrder === "desc" && "shadow-md"
            )}
          >
            {sortOrder === "asc" ? (
              <ArrowUpAZ className="h-4 w-4" />
            ) : (
              <ArrowDownAZ className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {isLoading ? (
          <Badge variant="secondary" className="gap-1.5 font-normal">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading...
          </Badge>
        ) : (
          <>
            <Users className="h-4 w-4" />
            {stats.hasSearch ? (
              <span>
                <span className="font-medium text-foreground">
                  {stats.filtered}
                </span>{" "}
                of {stats.total} students
              </span>
            ) : (
              <span>
                <span className="font-medium text-foreground">
                  {stats.total}
                </span>{" "}
                student{stats.total !== 1 ? "s" : ""}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
