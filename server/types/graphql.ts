import { StudentDocument } from "@/app/study-graphql/types/student";
import Students from "@/server/datasources/students";

export interface ApolloContext {
  dataSources: {
    students: Students;
  };
}

export interface StudentParent {
  _id?: string | { toString: () => string };
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  address?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface NewStudentInput {
  name?: string | null;
  email?: string | null;
  age?: number | null;
  address?: string | null;
}

export interface SearchStudentInput {
  searchTerm?: string | null;
  sortBy?: string | null;
  sortOrder?: string | null;
  limit?: number | null;
  offset?: number | null;
}

export interface QueryArgs {
  input?: SearchStudentInput | null;
}

export interface StudentQueryArgs {
  id: string;
}

export interface CreateStudentArgs {
  input: NewStudentInput;
}

export interface UpdateStudentArgs {
  id: string;
  input: NewStudentInput;
}

export interface DeleteStudentArgs {
  id: string;
}
