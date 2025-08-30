import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
      message
    }
  }
`;

export interface LoginResponse {
  login: {
    success: boolean;
    token: string;
    message: string;
  };
}

export interface LoginVariables {
  username: string;
  password: string;
}
