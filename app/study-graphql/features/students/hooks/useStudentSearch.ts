import { useState, useMemo } from "react";
import { Student, UseStudentSearchProps } from "../types/student";
import { useDebounce } from "@/app/study-graphql/shared/hooks";

export function useStudentSearch({
  students,
  onSearchChange,
  onSortChange,
}: UseStudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Student>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  const handleSortChange = (field: keyof Student) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    onSortChange?.(field, newSortOrder);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    onSortChange?.(sortBy, newSortOrder);
  };

  const filteredStudents = useMemo(() => {
    if (!debouncedSearchTerm) return students;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.address?.toLowerCase().includes(searchLower) ||
        student.age?.toString().includes(searchLower)
    );
  }, [students, debouncedSearchTerm]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (
        (aValue as any) instanceof Date &&
        (bValue as any) instanceof Date
      ) {
        comparison = (aValue as any).getTime() - (bValue as any).getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredStudents, sortBy, sortOrder]);

  const searchStats = useMemo(() => {
    const total = students.length;
    const filtered = filteredStudents.length;
    const hasSearch = !!debouncedSearchTerm;

    return {
      total,
      filtered,
      hasSearch,
      searchTerm: debouncedSearchTerm,
    };
  }, [students.length, filteredStudents.length, debouncedSearchTerm]);

  const sortOptions = [
    { value: "name", label: "Nama" },
    { value: "email", label: "Email" },
    { value: "age", label: "Umur" },
    { value: "address", label: "Alamat" },
    { value: "createdAt", label: "Tanggal Dibuat" },
  ] as const;

  return {
    searchTerm,
    debouncedSearchTerm,
    sortBy,
    sortOrder,
    filteredStudents: sortedStudents,
    searchStats,
    sortOptions,
    handleSearchChange,
    handleSortChange,
    toggleSortOrder,
    setSearchTerm,
    setSortBy,
    setSortOrder,
  };
}
