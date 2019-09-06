import React, { useState, useEffect, FormEvent } from "react";
import "./App.css";
import axios from "axios";

const api = "http://localhost:3003";

const App: React.FC = () => {
  const [movies, setMovies] = useState<null | string[]>(null);
  const [movie, setMovie] = useState("");
  const [randomMovie, setRandomMovie] = useState("");

  useEffect(() => {
    axios.get(api).then(res => setMovies(res.data.data));
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (movie !== "") {
      axios.post(api, { movie }).then(res => {
        if (res.data.success && movies !== null) {
          movies.push(movie);
          setMovie("");
        }
      });
    }
  };

  const remove = (movie: string) => () => {
    axios.delete(`${api}/${movie}`).then(res => {
      if (res.data.success && movies !== null) {
        setMovies(movies.filter(oldMovie => oldMovie !== movie));
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
            <li key={movie} onClick={remove(movie)}>
              {movie}
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
      <h1>Random Movie: "{randomMovie}"</h1>
    </div>
  );
};

export default App;
