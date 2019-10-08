import axios from "axios";
import config from "./config";

export interface Movie {
  movieId: string;
  title: string;
  posterPath: string;
  overview: string;
  voteAverage: number; // out of 10
  releaseDate: string; // Ex: 2014-10-24
  runtime: null | number;
  genres: { id: number; name: string }[];
}

// f58dd40a9719f17d8885b20e1b1c28bd

// const example = {page: 1,
// total_results: 1429,
// total_pages: 72,
// results: [
// {
// popularity: 83.718,
// vote_count: 10711,
// video: false,
// poster_path: "/5vHssUeVe25bMrof1HyaPyWgaP.jpg",
// id: 245891,
// adult: false,
// backdrop_path: "/iJlGxN0p1suzloBGvvBu3QSSlhT.jpg",
// original_language: "en",
// original_title: "John Wick",
// genre_ids: [
// 28,
// 53
// ],
// title: "John Wick",
// vote_average: 7.2,
// overview: "Ex-hitman John Wick comes out of retirement to track down the gangsters that took everything from him.",
// release_date: "2014-10-24"
// },
// ]}

export const getMovie = async (
  id: string
): Promise<{
  runtime: null | number;
  genres: { id: number; name: string }[];
} | null> => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${config.get("apiKey")}`
    );

    return {
      runtime: res.data.runtime,
      genres: res.data.genres
    };
  } catch (error) {
    if (!(error.response && error.response.status === 401)) {
      throw error;
    }
    console.warn("Bad api key");
    return null;
  }
};

export const searchMovie = async (
  searchTitle: string
): Promise<Movie | null> => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${config.get(
        "apiKey"
      )}&query=${encodeURIComponent(searchTitle)}`
    );
    if (res.data.total_results === 0) {
      return null;
    }
    const {
      id: movieId,
      title,
      poster_path: posterPath,
      overview,
      vote_average: voteAverage,
      release_date: releaseDate
    } = res.data.results[0];

    const otherDetails = await getMovie(movieId);
    const other =
      otherDetails === null
        ? {
            genres: [],
            runtime: null
          }
        : otherDetails;

    return {
      movieId,
      title,
      posterPath,
      overview,
      voteAverage,
      releaseDate,
      ...other
    };
  } catch (error) {
    if (!(error.response && error.response.status === 401)) {
      throw error;
    }
    console.warn("Bad api key");
    return null;
  }
};
