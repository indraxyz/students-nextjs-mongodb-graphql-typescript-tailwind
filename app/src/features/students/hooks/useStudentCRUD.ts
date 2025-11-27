import { useMutation, useQuery } from "@apollo/client/react";
import { GET_STUDENTS } from "../graphql/queries";
import {
  CREATE_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT,
  DELETE_STUDENTS,
} from "../graphql/mutations";
import {
  Student,
  StudentFormData,
  CreateStudentResponse,
  UpdateStudentResponse,
  DeleteStudentResponse,
  UseStudentCRUDProps,
} from "../types/student";

export function useStudentCRUD({
  searchTerm = "",
  sortBy = "name",
  sortOrder = "asc",
  limit = 100,
  offset = 0,
}: UseStudentCRUDProps = {}) {
  const {
    data: studentsData,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery<{ students: Student[] }, { input: any }>(GET_STUDENTS, {
    variables: {
      input: {
        searchTerm: searchTerm || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        limit: limit,
        offset: offset,
      },
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  const [createStudent, { loading: creating, error: createError }] =
    useMutation<CreateStudentResponse, { input: StudentFormData }>(
      CREATE_STUDENT
    );
  const [updateStudent, { loading: updating, error: updateError }] =
    useMutation<UpdateStudentResponse, { id: string; input: StudentFormData }>(
      UPDATE_STUDENT
    );
  const [deleteStudent, { loading: deleting, error: deleteError }] =
    useMutation<DeleteStudentResponse, { id: string }>(DELETE_STUDENT);
  const [
    deleteStudents,
    { loading: deletingMultiple, error: deleteMultipleError },
  ] = useMutation<{ deleteStudents: number }, { ids: string[] }>(
    DELETE_STUDENTS
  );

  const students = studentsData?.students || [];
  const isLoading =
    queryLoading || creating || updating || deleting || deletingMultiple;
  const error =
    queryError ||
    createError ||
    updateError ||
    deleteError ||
    deleteMultipleError;

  const createStudentHandler = async (
    input: StudentFormData
  ): Promise<Student> => {
    try {
      const result = await createStudent({
        variables: { input },
      });

      // main error handling is through try/catch and `createError`.

      if (result.data?.createStudent) {
        await refetch();
        return result.data.createStudent;
      }

      // If no data and no errors, something unexpected happened
      console.error("No data returned from mutation:", result);
      throw new Error("Failed to create student: No data returned");
    } catch (error) {
      console.error("Error creating student:", error);

      // Extract error message from Apollo error
      if (error && typeof error === "object" && "graphQLErrors" in error) {
        const apolloError = error as any;
        if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
          const errorMessage =
            apolloError.graphQLErrors[0]?.message || "Failed to create student";
          throw new Error(errorMessage);
        }
        if (apolloError.networkError) {
          throw new Error(
            apolloError.networkError.message || "Network error occurred"
          );
        }
      }

      throw error;
    }
  };

  const updateStudentHandler = async (
    id: string,
    input: StudentFormData
  ): Promise<Student> => {
    try {
      const result = await updateStudent({
        variables: { id, input },
      });

      //  main error handling is through try/catch and `updateError`.

      if (result.data?.updateStudent) {
        await refetch();
        return result.data.updateStudent;
      }

      // If no data and no errors, something unexpected happened
      console.error("No data returned from mutation:", result);
      throw new Error("Failed to update student: No data returned");
    } catch (error) {
      console.error("Error updating student:", error);

      // Extract error message from Apollo error
      if (error && typeof error === "object" && "graphQLErrors" in error) {
        const apolloError = error as any;
        if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
          const errorMessage =
            apolloError.graphQLErrors[0]?.message || "Failed to update student";
          throw new Error(errorMessage);
        }
        if (apolloError.networkError) {
          throw new Error(
            apolloError.networkError.message || "Network error occurred"
          );
        }
      }

      throw error;
    }
  };

  const deleteStudentHandler = async (id: string): Promise<boolean> => {
    try {
      const result = await deleteStudent({
        variables: { id },
      });

      if (result.data?.deleteStudent) {
        await refetch();
        return true;
      }

      throw new Error("Failed to delete student");
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  };

  const deleteStudentsHandler = async (ids: string[]): Promise<number> => {
    try {
      const result = await deleteStudents({
        variables: { ids },
      });

      if (result.data?.deleteStudents !== undefined) {
        await refetch();
        return result.data.deleteStudents;
      }

      throw new Error("Failed to delete students");
    } catch (error) {
      console.error("Error deleting students:", error);
      throw error;
    }
  };

  const confirmDelete = async (id: string, name: string): Promise<boolean> => {
    if (confirm(`Yakin ingin menghapus ${name}?`)) {
      try {
        await deleteStudentHandler(id);
        return true;
      } catch (error) {
        alert("Terjadi kesalahan saat menghapus data");
        return false;
      }
    }
    return false;
  };

  return {
    students,
    isLoading,
    error,
    queryLoading,
    creating,
    updating,
    deleting,
    deletingMultiple,
    createStudent: createStudentHandler,
    updateStudent: updateStudentHandler,
    deleteStudent: deleteStudentHandler,
    deleteStudents: deleteStudentsHandler,
    confirmDelete,
    refetch,
  };
}
