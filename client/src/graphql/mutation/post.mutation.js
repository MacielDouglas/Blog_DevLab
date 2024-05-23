import { gql } from "@apollo/client";

export const NEW_POST = gql`
  mutation createPost($newPost: NewPostInput!) {
    createPost(newPost: $newPost) {
      id
      title
      category
      image
      slug
      userId
      content
      writer
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      message
      success
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost($updatePostId: ID!, $updatedPost: UpdatePostInput!) {
    updatePost(id: $updatePostId, updatedPost: $updatedPost) {
      title
      image
      content
      category
      message
      success
      slug
    }
  }
`;
