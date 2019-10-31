import gql from "graphql-tag";

export const ADD_MOVIE = gql`
  mutation AddMovie($title: String!) {
    createMovie(title: $title) {
      id
      title
    }
  }
`;

export const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id)
  }
`;

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      title
      description
      voteAverage
      runtime
      posterPath
      tags {
        id
        name
      }
      user {
        username
      }
    }
  }
`;

export const GET_MOVIES_TAGS = gql`
  query GetMoviesTag {
    movies {
      id
      title
      description
      voteAverage
      runtime
      posterPath
      tags {
        id
        name
      }
      user {
        username
      }
    }
    tags {
      id
      name
    }
  }
`;

export const GET_MOVIE = gql`
  query GetMovie($id: ID!) {
    movie(id: $id) {
      id
      title
      description
      voteAverage
      runtime
      posterPath
      tags {
        id
        name
      }
    }
  }
`;
