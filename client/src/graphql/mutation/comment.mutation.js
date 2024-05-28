import { gql } from "@apollo/client";

export const NEW_COMMENT = gql`
  mutation newComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      id
      content
      postId
      message
      success
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation updateComment($commentId: ID!, $updatedContent: String!) {
    updateComment(commentId: $commentId, updatedContent: $updatedContent) {
      id
      content
      message
      success
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($deleteCommentId: ID!) {
    deleteComment(id: $deleteCommentId) {
      message
      success
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation likeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      id
      liked
      numberOfLikes
      message
      success
    }
  }
`;
