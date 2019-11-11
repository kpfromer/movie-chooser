import React, { useState, FormEvent, Fragment } from 'react';
import {
  Typography,
  Paper,
  IconButton,
  TextField,
  Button,
  Slider,
  Chip,
  CircularProgress,
  Tooltip
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { client } from '../..';
import DeleteIcon from '@material-ui/icons/Delete';
import MinusCircle from '@material-ui/icons/RemoveCircle';
import { useQuery } from '@apollo/react-hooks';
import {
  ADD_MOVIE,
  DELETE_MOVIE,
  GET_USER_AND_MOVIES_AND_TAGS,
  WATCH_MOVIE
} from '../../resolvers/movies';
import { observer } from 'mobx-react-lite';
import CommonStore from '../../store/CommonStore';
import { Movie, Tag, User } from '../../type';
import moment from 'moment';

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
  const { data, loading } = useQuery<{
    movies: Movie[];
    tags: Tag[];
    users: (User & { movies: Movie[] })[];
  }>(GET_USER_AND_MOVIES_AND_TAGS);

  if (loading) {
    return <CircularProgress variant="indeterminate" />;
  }

  if (!data) {
    return <>Failed to load movie data!</>;
  }

  const addMovie = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (movie !== '') {
      setMovie('');
      client
        .mutate({
          mutation: ADD_MOVIE,
          variables: { title: movie },
          refetchQueries: [{ query: GET_USER_AND_MOVIES_AND_TAGS }]
        })
        .then(res => {
          CommonStore.notify({
            message: `Added "${res.data.createMovie.title}"`
          });
        })
        .catch(() => {
          setMovie(movie);
        });
    }
  };

  const removeMovie = (id: string) => (): void => {
    client
      .mutate({
        mutation: DELETE_MOVIE,
        variables: { id },
        refetchQueries: [{ query: GET_USER_AND_MOVIES_AND_TAGS }]
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

  const watchMovie = (id: string) => (): void => {
    client
      .mutate({
        mutation: WATCH_MOVIE,
        variables: { id },
        refetchQueries: [{ query: GET_USER_AND_MOVIES_AND_TAGS }]
      })
      .then(res => {
        if (res.data === false) {
          CommonStore.notify({
            message: 'Can not remove movie that does not exist!',
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
  const filterMovie = (movie: Movie): boolean =>
    (movie.runtime === undefined ||
      (start <= movie.runtime && movie.runtime <= end)) && // time
    ((tagsToShow.length > 0 &&
      movie.tags.some(tag => tagsToShow.includes(tag.id))) ||
      tagsToShow.length === 0); // if tags include it (tags not empty)

  const getRandom = (): void => {
    const validUsers = data.users.filter(
      user =>
        user.movies.map(movie => movie.weight).reduce((sum, i) => sum + i) > 0
    );
    if (validUsers.length <= 0) {
      return;
    }
    const randomUser =
      validUsers[Math.floor(Math.random() * validUsers.length)];
    const cumulativeMovieWeightSums = randomUser.movies.map(
      movie => movie.weight
    );
    for (let i = 1; i < cumulativeMovieWeightSums.length; i++) {
      cumulativeMovieWeightSums[i] += cumulativeMovieWeightSums[i - 1];
    }
    const chosenWeightValue = Math.floor(
      Math.random() *
        cumulativeMovieWeightSums[cumulativeMovieWeightSums.length - 1]
    );
    const movie =
      randomUser.movies[
        cumulativeMovieWeightSums.findIndex(
          weight => weight - chosenWeightValue > 0
        )
      ];
    setRandomMovie(
      `${randomUser.firstName} ${randomUser.lastName}'s movie: "${movie.title}"`
    );
  };

  const maxMovieLength: number = data.movies.reduce(
    (max, movie) =>
      !!movie.runtime && movie.runtime > max ? movie.runtime : max,
    0
  );

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
          max={maxMovieLength}
        />
        {data.tags.map(tag => (
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
      <Button onClick={getRandom}>Get Random Movie</Button>
      <h1>{randomMovie}</h1>
      {data.users.map(user => (
        <Fragment key={user.id}>
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          {user.movies.filter(filterMovie).map(movie => (
            <Paper
              key={movie.id}
              style={{
                marginBottom: '15px',
                paddingLeft: '.75rem',
                paddingRight: '.75rem'
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={2}>
                  {!!movie.posterPath && (
                    <img
                      src={`http://image.tmdb.org/t/p/w185${movie.posterPath}`}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%'
                      }}
                      alt={`${movie.title} movie poster`}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={10} container direction="column">
                  <Grid item container justify="space-between">
                    <Grid item>
                      <Typography variant="h3" gutterBottom>
                        {movie.title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      {CommonStore.role === 'ADMIN' && (
                        <Tooltip title="Watched" aria-label="watched">
                          <IconButton edge="end" onClick={watchMovie(movie.id)}>
                            <MinusCircle />
                          </IconButton>
                        </Tooltip>
                      )}
                      {user.username === CommonStore.username && (
                        <Tooltip title="Remove" aria-label="remove">
                          <IconButton
                            edge="end"
                            onClick={removeMovie(movie.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item>
                    {!!movie.tags &&
                      movie.tags.map(tag => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          color="primary"
                          style={{ marginLeft: '3px' }}
                        />
                      ))}
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">
                      {!!movie.releaseDate && (
                        <>
                          {moment(movie.releaseDate).format('MM/DD/YYYY')}
                          <br />
                        </>
                      )}

                      {!!movie.voteAverage && (
                        <>
                          {`Votes: ${movie.voteAverage}/10`}
                          <br />
                        </>
                      )}
                      {!!movie.runtime && getRuntime(movie.runtime)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {!!movie.description && (
                      <Typography variant="body2">
                        {movie.description}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Fragment>
      ))}
    </>
  );
});

export default Home;
