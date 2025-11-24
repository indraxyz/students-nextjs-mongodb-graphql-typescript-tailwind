import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query GetStudents($input: SearchStudentInput) {
    students(input: $input) {
      id
      name
      email
      age
      address
      createdAt
      updatedAt
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    student(id: $id) {
      id
      name
      email
      age
      address
      createdAt
      updatedAt
    }
  }
`;
