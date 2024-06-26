const postTypeDef = `#graphql

type Post {
    id: ID!
    userId: ID!
    title: String!
    content: String!
    image: String!
    category: String!
    slug: String
    createdAt: String
    writer: String!
}

type Query {
    getPosts(slug: String, input: PostFilters): [Post!]!
}

type Mutation {
    createPost(newPost: NewPostInput!): Post
    deletePost(postId: ID!): DeletePostResponse
    updatePost(id: ID!,  updatedPost: UpdatePostInput!): UpdatePostResponse
}

input NewPostInput {
    userId: String!
    title: String!
    content: String!
    image: String!
    category: String!
    writer: String!
}

type DeletePostResponse {
  success: Boolean!
  message: String
}

input UpdatePostInput {
    title: String
    content: String
    image: String
    category: String
    slug: String
}

type UpdatePostResponse {
    success: Boolean!
    message: String
    title: String
    content: String
    image: String
    category: String
    slug: String
}

input PostFilters {
  title: String
  category: String
}

# input PostsInput {
#   filter: PostFilters
# }


`;

export default postTypeDef;
