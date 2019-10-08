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
  Chip
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useGlobalState } from "../..";
import DeleteIcon from "@material-ui/icons/Delete";
import { User } from "../../helper/agent";
import { Movie } from "../../type";
import CustomSnackbar from "../../components/Snackbar/Snackbar";
import MovieList from "./MovieList";
import Box from "@material-ui/core/Box";

export interface HomeProps {
  classes: any;
}

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

const Home: React.FC<HomeProps> = ({ classes }) => {
  const [state] = useGlobalState();
  const [users, setUsers] = useState<
    | null
    | {
        username: string;
        firstName: string;
        lastName: string;
        movies: Movie[];
      }[]
  >(null);

  const [movie, setMovie] = useState("");
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [value, setValue] = useState<number[]>([0, 300]);
  const [genresToShow, setGenresToShow] = useState<number[]>([]);
  const filteredUsers =
    users === null
      ? null
      : users.map(user => ({
          ...user,
          movies: user.movies.filter(movie => {
            if (movie.details !== undefined) {
              if (
                !!movie.details.genres &&
                genresToShow.length > 0 &&
                movie.details.genres
                  .map(genre => genre.id)
                  .every(id => !genresToShow.includes(id))
              ) {
                return false;
              }
              if (!!movie.details.runtime) {
                const [min, max] = value;
                if (
                  !(
                    min <= movie.details.runtime && movie.details.runtime <= max
                  )
                ) {
                  return false;
                }
              }
            }

            return true;
          })
        }));
  // const flattened = filteredUsers === null ? null : filteredUsers.flatMap(user => user.movies);
  const tags: null | { id: number; name: string }[] =
    users === null
      ? null
      : users.reduce((tags: { id: number; name: string }[], user) => {
          const newTags = user.movies.reduce(
            (userTags: { id: number; name: string }[], movie) => {
              if (!!movie.details && !!movie.details.genres) {
                return removeDup(
                  userTags,
                  movie.details.genres,
                  (a, b) => a.id !== b.id
                );
              }
              return userTags;
            },
            []
          );
          return removeDup(tags, newTags, (a, b) => a.id !== b.id);
          // return [...tags, ...newTags];
        }, []);

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  useEffect(() => {
    User.getAll().then(body => setUsers(body.data));
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (movie !== "") {
      if (users !== null) {
        setUsers(
          users.map(user => {
            if (state.commonStore.username === user.username) {
              return {
                ...user,
                movies: [...user.movies, { _id: movie, name: movie }]
              };
            }
            return user;
          })
        );

        setMovie("");
      }

      User.create(movie)
        .then(body => {
          if (users !== null) {
            setUsers(
              users.map(user => {
                if (state.commonStore.username === user.username) {
                  return {
                    ...user,
                    movies: [
                      ...user.movies.filter(oldMovie => oldMovie._id !== movie),
                      body.data
                    ]
                  };
                }
                return user;
              })
            );
          }
        })
        .catch(error => setMovie(movie));
    }
  };

  const remove = (id: string) => {
    // TODO: rename user to movie
    User.del(id).then(body => {
      if (body.success && users !== null) {
        setUsers(
          users.map(user => ({
            ...user,
            movies: user.movies.filter(oldMovie => oldMovie._id !== id)
          }))
        );
      }
    });
  };

  const toggleGenre = (id: number) => () => {
    if (genresToShow.some(genre => genre === id)) {
      setGenresToShow(genresToShow.filter(genre => genre !== id));
    } else {
      setGenresToShow([...genresToShow, id]);
    }
  };

  const getRandom = () => {
    const getUser = () => {
      if (filteredUsers) {
        let index: number;
        do {
          index = Math.floor(Math.random() * filteredUsers.length);
        } while (filteredUsers[index].movies.length === 0);
        return index;
      }
      return -1;
    };

    if (filteredUsers !== null) {
      const userIndex = getUser();
      const movies = filteredUsers[userIndex].movies;
      const movieIndex = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[movieIndex]);
    }
    // if (flattened !== null && flattened.length > 0) {
    //   const index = Math.floor(Math.random() * flattened.length);
    //   setRandomMovie(flattened[index]);
    // }
  };
  return (
    <>
      <Paper>
        <Typography variant="h4">Filter:</Typography>
        <Typography variant="h6">By length (minutes)</Typography>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={0}
          max={300} // TODO: max movie in list
        />
        {tags !== null &&
          tags.map(genre => (
            <Chip
              key={genre.id}
              label={genre.name}
              color={genresToShow.includes(genre.id) ? "primary" : "secondary"}
              style={{ marginLeft: "3px" }}
              onClick={toggleGenre(genre.id)}
            />
          ))}
      </Paper>

      <br/>

      <Paper>
        {state.commonStore.token !== "" && (
            <>
              <Typography variant="h5" style={{fontWeight: "bold"}}>Add Movie</Typography>
              <form onSubmit={submit}>
                <TextField
                    value={movie}
                    label="New Movie"
                    onChange={event => setMovie(event.target.value)}
                    fullWidth
                />
                <br />
                <Button type="submit">Submit</Button>
              </form>
            </>
        )}
        <hr/>
        {users !== null && users.length > 0 && (
            <>
              <Button onClick={getRandom}>Get Random Movie</Button>
              {randomMovie !== null && (
                  <>
                    <br />
                    <Typography variant="h5">
                      Random Movie: "
                      {randomMovie === null
                          ? "none"
                          : randomMovie.details !== undefined
                              ? randomMovie.details.title
                              : randomMovie.name}
                      "
                    </Typography>
                  </>
              )}
            </>
        )}
      </Paper>

      <h1>Movie List:</h1>
      {filteredUsers === null ? (
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
      )}
    </>
  );
};

export default Home;
