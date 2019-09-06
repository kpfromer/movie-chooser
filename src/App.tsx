import React, { useState, useEffect, FormEvent } from "react";
import "./App.css";
import axios from "axios";

const api = !!process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "http://localhost:3000";

const App: React.FC = () => {
  const [movies, setMovies] = useState<null | { _id: string; name: string }[]>(
    null
  );
  const [movie, setMovie] = useState("");
  const [randomMovie, setRandomMovie] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    axios.get(api).then(res => setMovies(res.data.data));
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (movie !== "") {
      axios.post(api, { movie }).then(res => {
        if (res.data.success && movies !== null) {
          movies.push(res.data.data);
          setMovie("");
        }
      });
    }
  };

  const remove = (id: string) => () => {
    axios.delete(`${api}/${id}`).then(res => {
      if (res.data.success && movies !== null) {
        setMovies(movies.filter(oldMovie => oldMovie._id !== id));
      }
    });
  };

  const getRandom = () => {
    if (movies !== null) {
      const index = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[index]);
    }
  };

  return (
    <div className="App">
      <h1>Movies:</h1>
      <ul>
        {movies === null ? (
          <li>None</li>
        ) : (
          movies.map(movie => (
            <li key={movie._id} onClick={remove(movie._id)}>
              {movie.name}
            </li>
          ))
        )}
      </ul>
      <form onSubmit={submit}>
        New Movie:{" "}
        <input value={movie} onChange={event => setMovie(event.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <button onClick={getRandom}>Get Random Movie</button>
      <h1>
        Random Movie: "{randomMovie === null ? "none" : randomMovie.name}"
      </h1>
    </div>
  );
};

export default App;
