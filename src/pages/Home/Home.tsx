import React, { useState, FormEvent } from 'react';
import {
  Typography,
  Paper,
  IconButton,
  TextField,
  Button,
  Slider,
  Chip,
  CircularProgress
} from '@material-ui/core';
import { client } from '../..';
import DeleteIcon from '@material-ui/icons/Delete';
import { useQuery } from '@apollo/react-hooks';
import {
  GET_MOVIES,
  ADD_MOVIE,
  DELETE_MOVIE,
  GET_MOVIES_TAGS
} from '../../resolvers/movies';
import { GET_USERS } from '../../resolvers/authorization';
import { observer } from 'mobx-react-lite';
import CommonStore from '../../store/CommonStore';
import { Movie, Tag } from '../../type';

const getRuntime = (runtime: number): string => {
  const minutes = runtime % 60;
  const hours = (runtime - minutes) / 60;
  const hourStr = hours > 0 ? `${hours}h` : '';
  const minuteStr = minutes > 0 ? ` ${minutes}m` : '';
  return `${hourStr}${minuteStr}`;
};

const Home: React.FC = observer(() => {
  const [movie, setMovie] = useState('');
  const [time, setTime] = useState<number[]>([0, 300]);
  const [tagsToShow, setTagsToShow] = useState<string[]>([]);
  const [randomMovie, setRandomMovie] = useState('');
  const { data: movieData, loading: loadingMovies } = useQuery<{
    movies: Movie[];
    tags: Tag[];
  }>(GET_MOVIES_TAGS);
  const { data: userData, loading: loadingUser } = useQuery(GET_USERS);

  const loading = loadingMovies && loadingUser;

  const addMovie = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (movie !== '') {
      client.mutate({
        mutation: ADD_MOVIE,
        variables: { title: movie },
        refetchQueries: [{ query: GET_MOVIES }, { query: GET_MOVIES_TAGS }]
      });
    }
  };

  const removeMovie = (id: string) => (): void => {
    client
      .mutate({
        mutation: DELETE_MOVIE,
        variables: { id },
        refetchQueries: [{ query: GET_MOVIES }, { query: GET_MOVIES_TAGS }]
      })
      .then(res => {
        if (res.data === false) {
          CommonStore.notify({
            message: 'Movie does not exist',
            type: 'error'
          });
        }
      });
  };

  const filterTime = (
    event: React.ChangeEvent<{}>,
    newValue: number | number[]
  ): void => {
    setTime(newValue as number[]);
  };
  const filterTag = (tagId: string) => (): void => {
    if (tagsToShow.includes(tagId)) {
      setTagsToShow(tagsToShow.filter(tag => tag !== tagId));
    } else {
      setTagsToShow([...tagsToShow, tagId]);
    }
  };

  const [start, end] = time;
  const movies =
    !!movieData &&
    movieData.movies.filter(
      movie =>
        (movie.runtime === undefined ||
          (movie.runtime !== undefined &&
            (start <= movie.runtime && movie.runtime <= end))) && // time
        ((tagsToShow.length > 0 &&
          movie.tags.some(tag => tagsToShow.includes(tag.id))) ||
          tagsToShow.length === 0) // if tags include it (tags not empty)
    );

  const getRandom = (): void => {
    if (userData.users.length > 0) {
      const validUsers = userData.users.filter(user => user.movies.length > 0);
      if (validUsers.length > 0) {
        const randomUser =
          validUsers[Math.floor(Math.random() * validUsers.length)];
        const movie =
          randomUser.movies[
            Math.floor(Math.random() * randomUser.movies.length)
          ].title;
        setRandomMovie(
          `${randomUser.firstName} ${randomUser.lastName}'s movie: "${movie}"`
        );
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
          !!movieData &&
          movieData.tags.map(tag => (
            <Chip
              key={tag.id}
              label={tag.name}
              color={tagsToShow.includes(tag.id) ? 'primary' : 'secondary'}
              style={{ marginLeft: '3px' }}
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
            onChange={(event): void => setMovie(event.target.value)}
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
          <Paper key={movie.id} style={{ marginBottom: '15px' }}>
            <Typography variant="h3" gutterBottom>
              {movie.title}
            </Typography>
            {!!movie.tags &&
              movie.tags.map(tag => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  color="primary"
                  style={{ marginLeft: '3px' }}
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
