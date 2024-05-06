const userTypeDef = `#graphql

type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    profilePicture: String!
    isAdmin: Boolean!
}

type Query {
    getUser(id: ID!): User
    loginUser(email: String!, password: String!): LoginResponse!
    logoutUser: LogoutResponse!
}

type LoginResponse {
    token: String!
    id: ID!
    username: String!
    profilePicture: String!
    isAdmin: Boolean!
}

type LogoutResponse {
    success: Boolean!
    message: String!
}

`;

export default userTypeDef;
