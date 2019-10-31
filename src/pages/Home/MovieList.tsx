import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Chip from "@material-ui/core/Chip";

export interface MovieListProps {
  movies: any[];
  onRemove: (id: string) => void;
}

const getRuntime = (runtime: number): string => {
  const minutes = runtime % 60;
  const hours = (runtime - minutes) / 60;
  let hourStr = hours > 0 ? `${hours}h` : "";
  let minuteStr = minutes > 0 ? ` ${minutes}m` : "";
  return `${hourStr}${minuteStr}`;
};

const MovieList: React.FC<MovieListProps> = ({ movies, onRemove }) => {
  console.log(movies);
  return (
    <>
      {movies.map(movie => (
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
          {/* {movie.isOwner && (
            <IconButton edge="end" onClick={() => onRemove(movie.id)}>
              <DeleteIcon />
            </IconButton>
          )} */}
        </Paper>
      ))}
    </>
  );
};

export default MovieList;
