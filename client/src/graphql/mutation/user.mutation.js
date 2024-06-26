import { gql } from "@apollo/client";

export const NEW_USER = gql`
  mutation newUser($user: NewUserInput!) {
    createUser(user: $user) {
      email
      password
      profilePicture
      username
      name
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($updateUserId: ID!, $updatedUser: UpdateUserInput!) {
    updateUser(id: $updateUserId, updatedUser: $updatedUser) {
      username
      email
      profilePicture
      isAdmin
      success
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      message
      success
    }
  }
`;

export const LOGIN_GOOGLE = gql`
  mutation userGoogle($user: UserGoogle!) {
    loginGoogle(user: $user) {
      id
      isAdmin
      profilePicture
      username
      name
    }
  }
`;
