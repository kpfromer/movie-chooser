import gql from 'graphql-tag';

export const SIGN_IN = gql`
  mutation SignIn($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
      user {
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $username: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    signUp(
      username: $username
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      token
    }
  }
`;

export const GET_AUTH = gql`
  query authStatus {
    authStatus @client {
      status
    }
  }
`;

export const GET_USERS = gql`
  query GetUser {
    users {
      id
      firstName
      lastName
      username
      movies {
        id
        title
        description
        voteAverage
        runtime
        posterPath
        weight
        tags {
          id
          name
        }
      }
    }
  }
`;
