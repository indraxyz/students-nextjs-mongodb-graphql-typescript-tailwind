import Students from "@/server/features/students/datasources/Students";

export interface ApolloContext {
  dataSources: {
    students: Students;
  };
}
