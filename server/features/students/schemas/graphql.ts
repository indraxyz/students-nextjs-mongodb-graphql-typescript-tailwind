import { gql } from "graphql-tag";

export const studentTypeDefs = gql`
  type Student {
    id: ID!
    name: String
    email: String
    age: Int
    address: String
    createdAt: String!
    updatedAt: String!
  }

  input NewStudentInput {
    name: String
    email: String
    age: Int
    address: String
  }
  input SearchStudentInput {
    searchTerm: String
    sortBy: String
    sortOrder: String
    limit: Int
    offset: Int
  }

  extend type Query {
    students(input: SearchStudentInput): [Student]
    student(id: ID!): Student
  }
  extend type Mutation {
    createStudent(input: NewStudentInput!): Student
    updateStudent(id: ID!, input: NewStudentInput!): Student
    deleteStudent(id: ID!): String
  }
`;
