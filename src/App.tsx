import React, { useState, useEffect, FormEvent } from "react";
import "./App.css";
import axios from "axios";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";
import {
  ListItemText,
  ListItem,
  Input,
  Button,
  TextField,
  ListItemIcon,
  ListItemSecondaryAction,
  Card
} from "@material-ui/core";

const api = !!process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "http://localhost:3001";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  }
}));

interface MovieDetails {
  title: string;
  posterPath: string;
  overview: string;
  voteAverage: number; // out of 10
  releaseDate: string; // Ex: 2014-10-24
}

const App: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [movies, setMovies] = useState<
    | null
    | {
        _id: string;
        name: string;
        details?: MovieDetails;
      }[]
  >(null);
  const [movie, setMovie] = useState("");
  const [randomMovie, setRandomMovie] = useState<{
    _id: string;
    name: string;
    details?: MovieDetails;
  } | null>(null);

  useEffect(() => {
    axios.get(api).then(res => {
      console.log(res.data.data);
      setMovies(res.data.data);
    });
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
    if (movies !== null && movies.length > 0) {
      const index = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[index]);
    }
  };

  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Movie Chooser
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <h1>Movie List:</h1>
          {/* <List> */}
          {movies === null ? (
            <li>None</li>
          ) : (
            movies.map(movie => (
              <Paper key={movie._id} style={{ marginBottom: "15px" }}>
                {movie.details !== undefined ? (
                  <>
                    <Typography variant="h3">{movie.details.title}</Typography>
                    <Typography variant="subtitle1">
                      Votes: {movie.details.voteAverage}/10
                    </Typography>
                    <Typography variant="h6">Overview:</Typography>
                    <Typography variant="body2">
                      {movie.details.overview}
                    </Typography>
                    <img
                      src={`http://image.tmdb.org/t/p/w185${movie.details.posterPath}`}
                    />
                  </>
                ) : (
                  <ListItemText>{movie.name}</ListItemText>
                )}
                <br />
                <IconButton edge="end" onClick={remove(movie._id)}>
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))
          )}
          {/* </List> */}
          <form onSubmit={submit}>
            <TextField
              value={movie}
              label="New Movie"
              onChange={event => setMovie(event.target.value)}
            />
            <br />
            <Button type="submit">Submit</Button>
          </form>
          <hr />
          {movies !== null && movies.length > 0 && (
            <>
              <Button onClick={getRandom}>Get Random Movie</Button>
              {randomMovie !== null && (
                <>
                  <Button onClick={remove(randomMovie._id)}>
                    Remove Random
                  </Button>
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
        </Container>
      </main>
    </div>
  );
};

export default App;
