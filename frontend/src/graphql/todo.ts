import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      description
      completed
      createdAt
    }
  }
`;

export const GET_TODO = gql`
  query GetTodo($id: Int!) {
    todo(id: $id) {
      id
      title
      description
      completed
      createdAt
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String!) {
    createTodo(title: $title, description: $description) {
      todo {
        id
        title
        description
        completed
      }
      success
      message
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: Int!
    $title: String
    $description: String
    $completed: Boolean
  ) {
    updateTodo(
      id: $id
      title: $title
      description: $description
      completed: $completed
    ) {
      todo {
        id
        title
        description
        completed
      }
      success
      message
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      success
      message
    }
  }
`;
