export interface Movie {
  id: string;
  title: string;
  posterPath?: string;
  description?: string;
  voteAverage?: number;
  releaseDate?: Date;
  runtime?: number;
  tags: Tag[];
  user: User;
}

export interface Tag {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}
