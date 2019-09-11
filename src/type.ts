export interface MovieDetails {
  title: string;
  posterPath: string;
  overview: string;
  voteAverage: number; // out of 10
  releaseDate: string; // Ex: 2014-10-24
  runtime?: null | number;
  genres?: { id: number; name: string }[];
}

export interface Movie {
  _id: string;
  name: string;
  details?: MovieDetails;
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  movies: Movie[];
}
