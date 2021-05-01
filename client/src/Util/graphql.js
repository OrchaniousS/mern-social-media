import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export const FETCH_USER_QUERY = gql`
  {
    getUsers {
      id
      email
      username
      createdAt
      status
      logo
    }
  }
`;

export const FETCH_SINGLE_USER_QUERY = gql`
  {
    getUser {
      userId
    }
  }
`;
