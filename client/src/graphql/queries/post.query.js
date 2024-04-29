import { gql } from "@apollo/client";

export const ALL_POSTS = gql`
  query allPost {
    getPosts {
      id
      title
      content
      category
      createdAt
      image
      slug
      title
      userId
    }
  }
`;

export const ONE_POST = gql`
  query onePost($slug: String!) {
    getPosts(slug: $slug) {
      id
      title
      content
      category
      createdAt
      image
      slug
      title
      userId
    }
  }
`;

export const FILTER_POST = gql`
  query FilterPost($input: PostsInput!) {
    filterPost(input: $input) {
      id
      title
      content
      category
      image
      slug
      userId
      createdAt
    }
  }
`;
