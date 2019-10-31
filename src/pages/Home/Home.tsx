import React, { useState, useEffect, FormEvent, Fragment } from "react";
import axios from "axios";
import { getUrl } from "../../helper/getUrl";
import {
  Container,
  Typography,
  Paper,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Slider,
  Link,
  Chip,
  CircularProgress
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { client } from "../..";
import DeleteIcon from "@material-ui/icons/Delete";
import { User } from "../../helper/agent";
import { Movie } from "../../type";
import CustomSnackbar from "../../components/Snackbar/Snackbar";
import MovieList from "./MovieList";
import Box from "@material-ui/core/Box";
import { useQuery } from "@apollo/react-hooks";
import {
  GET_MOVIES,
  ADD_MOVIE,
  DELETE_MOVIE,
  GET_MOVIES_TAGS
} from "../../resolvers/movies";
import { string } from "prop-types";
import {GET_AUTH, GET_USERS} from "../../resolvers/authorization";
import jwtDecode from "jwt-decode";
import { observer } from "mobx-react-lite";
import CommonStore from "../../store/CommonStore";

export interface HomeProps {}

const getFirstUpperCase = (value: string): string =>
  `${value.charAt(0).toUpperCase()}${value.substring(1)}`;

function removeDup<T>(
  a: T[],
  b: T[],
  areDifferent: (already: T, newVal: T) => boolean
): T[] {
  const vals: T[] = a;
  for (let bVal of b) {
    let alreadyIn = false;
    for (let inVal of vals) {
      if (!areDifferent(inVal, bVal)) {
        alreadyIn = true;
        break;
      }
    }
    if (!alreadyIn) {
      vals.push(bVal);
    }
  }
  return vals;
}

const getRuntime = (runtime: number): string => {
  const minutes = runtime % 60;
  const hours = (runtime - minutes) / 60;
  let hourStr = hours > 0 ? `${hours}h` : "";
  let minuteStr = minutes > 0 ? ` ${minutes}m` : "";
  return `${hourStr}${minuteStr}`;
};

const Home: React.FC<HomeProps> = observer(() => {
  const [movie, setMovie] = useState("");
  const [time, setTime] = useState<number[]>([0, 300]);
  const [tagsToShow, setTagsToShow] = useState<string[]>([]);
  const [randomMovie, setRandomMovie] = useState('');
  const { data: movieData, loading: loadingMovies } = useQuery(GET_MOVIES_TAGS);
  const { data: userData, loading: loadingUser } = useQuery(GET_USERS);

  const loading = loadingMovies && loadingUser;

  const addMovie = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (movie !== "") {
      client.mutate({
        mutation: ADD_MOVIE,
        variables: { title: movie },
        refetchQueries: [{ query: GET_MOVIES }, { query: GET_MOVIES_TAGS }]
      });
    }
  };

  const removeMovie = (id: string) => () => {
    // TODO: remove
    client
      .mutate({
        mutation: DELETE_MOVIE,
        variables: { id },
        refetchQueries: [{ query: GET_MOVIES }, { query: GET_MOVIES_TAGS }]
      })
      .then(res => {
        if (res.data === false) {
          CommonStore.notify({
            message: "Movie does not exist",
            type: "error"
          });
        }
      });
  };

  const filterTime = (event: any, newValue: number | number[]) => {
    setTime(newValue as number[]);
  };
  const filterTag = (tagId: string) => () => {
    if (tagsToShow.includes(tagId)) {
      setTagsToShow(tagsToShow.filter(tag => tag !== tagId));
    } else {
      setTagsToShow([...tagsToShow, tagId]);
    }
  };

  const [start, end] = time;
  const movies =
    !!movieData &&
    movieData.movies.filter(movie =>
        start <= movie.runtime &&
        movie.runtime <= end && // time
        ((tagsToShow.length > 0 && movie.tags.some(tag => tagsToShow.includes(tag.id))) ||
          tagsToShow.length === 0)// if tags include it (tags not empty)
    );

  const getRandom = () => {
    if (userData.users.length > 0) {
      const validUsers = userData.users.filter(user => user.movies.length > 0);
      if (validUsers.length > 0) {
        const randomUser = validUsers[Math.floor(Math.random() * validUsers.length)];
        const movie = randomUser.movies[Math.floor(Math.random() * randomUser.movies.length)].title;
        setRandomMovie(`${randomUser.firstName} ${randomUser.lastName}'s movie: "${movie}"`);
      }
    }
  };

  return (
    <>
      <Paper>
        <Typography variant="h4">Filter:</Typography>
        <Typography variant="h6">By length (minutes)</Typography>
        <Slider
          value={time}
          onChange={filterTime}
          valueLabelDisplay="auto"
          min={0}
          max={300} // TODO: max movie in list
        />
        {!loading &&
          movieData.tags.map(tag => (
            <Chip
              key={tag.id}
              label={tag.name}
              color={tagsToShow.includes(tag.id) ? "primary" : "secondary"}
              style={{ marginLeft: "3px" }}
              onClick={filterTag(tag.id)}
            />
          ))}
      </Paper>
      <h1>Movie List:</h1>
      {/* {filteredUsers === null ? (
        <li>None</li>
      ) : (
        filteredUsers.map(user => (
          <>
            <Link component={RouterLink} to={`/movies/${user.username}`}>
              <Typography variant="h2" gutterBottom>
                <Box fontWeight="fontWeightMedium">
                  {getFirstUpperCase(user.firstName)}{" "}
                  {getFirstUpperCase(user.lastName)}
                </Box>
              </Typography>
            </Link>
            <MovieList user={user} onRemove={remove} />
          </>
        ))
      )} */}

      {CommonStore.loggedIn && (
        <form onSubmit={addMovie}>
          <TextField
            value={movie}
            label="New Movie"
            onChange={event => setMovie(event.target.value)}
          />
          <br />
          <Button type="submit">Submit</Button>
        </form>
      )}
      <hr />
      {!loading && (
          <>
            <Button onClick={getRandom}>Get Random Movie</Button>
            <h1>{randomMovie}</h1>
          </>
      )}
      {loading || !movies ? (
        <CircularProgress variant="indeterminate" />
      ) : (
        movies.map(movie => (
          <Paper key={movie.id} style={{ marginBottom: "15px" }}>
            <Typography variant="h3" gutterBottom>
              {movie.title}
            </Typography>
            {!!movie.tags &&
              movie.tags.map(tag => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  color="primary"
                  style={{ marginLeft: "3px" }}
                />
              ))}
            <Typography variant="subtitle1">
              {!!movie.voteAverage && `Votes: ${movie.voteAverage}/10`}
              <br />
              {!!movie.runtime && getRuntime(movie.runtime)}
            </Typography>
            {!!movie.description && (
              <>
                <Typography variant="h6">Description:</Typography>
                <Typography variant="body2">{movie.description}</Typography>
              </>
            )}
            {!!movie.posterPath && (
              <img
                src={`http://image.tmdb.org/t/p/w185${movie.posterPath}`}
                alt={`${movie.title} movie poster`}
              />
            )}
            <br />
            {movie.user.username === CommonStore.username && (
              <IconButton edge="end" onClick={removeMovie(movie.id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Paper>
        ))
      )}
    </>
  );
});

export default Home;
