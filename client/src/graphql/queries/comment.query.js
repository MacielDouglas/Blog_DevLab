import { gql } from "@apollo/client";

export const ALL_COMMENTS = gql`
  query allComments($postId: String!) {
    allComments(postId: $postId) {
      content
      id
      likes
      numberOfLikes
      userId
      createdAt
    }
  }
`;
