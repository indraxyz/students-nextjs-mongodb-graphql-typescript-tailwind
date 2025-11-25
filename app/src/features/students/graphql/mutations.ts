import { gql } from "@apollo/client";

export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: NewStudentInput!) {
    createStudent(input: $input) {
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

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $input: NewStudentInput!) {
    updateStudent(id: $id, input: $input) {
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

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;
