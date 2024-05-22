import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      username
      isAdmin
      profilePicture
      id
      name
    }
  }
`;

export const LOGOUT_USER = gql`
  query logoutUser {
    logoutUser {
      message
      success
    }
  }
`;

export const ONE_USER = gql`
  query oneUser($getUserId: ID!) {
    getUser(id: $getUserId) {
      username
      id
      isAdmin
      profilePicture
    }
  }
`;
