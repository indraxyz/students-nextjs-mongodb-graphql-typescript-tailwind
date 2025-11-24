import { useMutation, useQuery } from "@apollo/client/react";
import { GET_STUDENTS } from "../graphql/queries";
import {
  CREATE_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT,
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

  const students = studentsData?.students || [];
  const isLoading = queryLoading || creating || updating || deleting;
  const error = queryError || createError || updateError || deleteError;

  const createStudentHandler = async (
    input: StudentFormData
  ): Promise<Student> => {
    try {
      const result = await createStudent({
        variables: { input },
      });

      if (result.data?.createStudent) {
        await refetch();
        return result.data.createStudent;
      }

      throw new Error("Failed to create student");
    } catch (error) {
      console.error("Error creating student:", error);
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

      if (result.data?.updateStudent) {
        await refetch();
        return result.data.updateStudent;
      }

      throw new Error("Failed to update student");
    } catch (error) {
      console.error("Error updating student:", error);
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
    createStudent: createStudentHandler,
    updateStudent: updateStudentHandler,
    deleteStudent: deleteStudentHandler,
    confirmDelete,
    refetch,
  };
}
