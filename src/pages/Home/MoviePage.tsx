import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_MOVIE } from "../../resolvers/movies";
import { CircularProgress, Paper, Typography, Chip } from "@material-ui/core";
import { RouteComponentProps } from "react-router";

export interface MoviePageProps {}

const MoviePage: React.FC<
  MoviePageProps & RouteComponentProps<{ id: string }>
> = ({ match }) => {
  const { data: movieData, loading } = useQuery(GET_MOVIE, {
    variables: { id: match.params.id }
  });
  console.log({ movieData, id: match.params.id });
  if (loading) {
    return <CircularProgress variant="indeterminate" />;
  }
  const { movie } = movieData;
  return (
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
        {/* {!!movie.runtime && getRuntime(movie.runtime)} */}
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
      {/* {state.commonStore.username === user.username && (
      <IconButton edge="end" onClick={() => onRemove(movie._id)}>
        <DeleteIcon />
      </IconButton>
    )} */}
    </Paper>
  );
};

export default MoviePage;
