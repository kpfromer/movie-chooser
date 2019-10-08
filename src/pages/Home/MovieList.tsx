import React, { Fragment } from "react";
import { User, Movie } from "../../type";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { useGlobalState } from "../..";
import DeleteIcon from "@material-ui/icons/Delete";
import Chip from "@material-ui/core/Chip";

export interface MovieListProps {
  user: User;
  onRemove: (movieId: string) => void;
}

const getRuntime = (runtime: number): string => {
  const minutes = runtime % 60;
  const hours = (runtime - minutes) / 60;
  let hourStr = hours > 0 ? `${hours}h` : "";
  let minuteStr = minutes > 0 ? ` ${minutes}m` : "";
  return `${hourStr}${minuteStr}`;
};

const MovieList: React.FC<MovieListProps> = ({ user, onRemove }) => {
  const [state] = useGlobalState();
  return (
    <>
      {user.movies.map(movie => (
        <Paper key={movie._id} style={{ marginBottom: "15px" }}>
          {movie.details !== undefined ? (
            <>
              <Typography variant="h3" gutterBottom>
                {movie.details.title}
              </Typography>
              {movie.details.genres !== undefined &&
                movie.details.genres.map(genre => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    color="primary"
                    style={{ marginLeft: "3px" }}
                  />
                ))}
              <Typography variant="subtitle1">
                Votes: {movie.details.voteAverage}/10
                <br />
                {!!movie.details.runtime && getRuntime(movie.details.runtime)}
              </Typography>
              <Typography variant="h6">Overview:</Typography>
              <Typography variant="body2">{movie.details.overview}</Typography>
              <img
                src={`http://image.tmdb.org/t/p/w185${movie.details.posterPath}`}
              />
            </>
          ) : (
            <Typography variant="h3">{movie.name}</Typography>
          )}
          <br />
          {state.commonStore.username === user.username && (
            <IconButton edge="end" onClick={() => onRemove(movie._id)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Paper>
      ))}
    </>
  );
};

export default MovieList;
