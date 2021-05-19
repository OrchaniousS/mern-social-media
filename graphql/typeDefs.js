const gql = require("graphql-tag");

module.exports = gql`
  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    password: String!
    createdAt: String!
    status: String!
    logo: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getUsers: [User]
    getUser(userId: ID!): User
  }

  type Mutation {
    register(
      username: String!
      password: String!
      confirmPassword: String!
      email: String!
      logo: Upload!
    ): User!
    login(username: String!, password: String!, status: String!): User!
    logoutUser(username: String!, status: String!): User!
    editUser(
      id: ID
      username: String
      email: String
      password: String
      logo: Upload
    ): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;
