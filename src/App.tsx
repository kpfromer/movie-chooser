import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link as RouterLink
} from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import CustomSnackbar from './components/Snackbar/Snackbar';
import { Button } from '@material-ui/core';
import MoviePage from './pages/Home/MoviePage';
import { observer } from 'mobx-react-lite';
import CommonStore from './store/CommonStore';
import Backup from './pages/Backup';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}));

const App: React.FC = observer(() => {
  const classes = useStyles();
  const logout = (): void => {
    CommonStore.notify({ message: 'Logged out.', type: 'success', time: 2000 });
    CommonStore.logout();
  };

  return (
    <Router>
      <div className="App">
        {CommonStore.snackbar !== null && (
          <CustomSnackbar
            open
            onClose={CommonStore.removeMessage}
            message={CommonStore.snackbar.message}
            variant={CommonStore.snackbar.type}
          />
        )}
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar className={classes.toolbar}>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              <Link component={RouterLink} color="inherit" to="/">
                Movie Chooser
              </Link>
            </Typography>

            {!CommonStore.loggedIn ? (
              <>
                <Button component={RouterLink} color="inherit" to="/register">
                  Register
                </Button>
                <Button component={RouterLink} color="inherit" to="/login">
                  Login
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              {/* <Route exact path="/movies/:user" component={UserPage} /> */}
              <Route exact path="/movie/:id" component={MoviePage} />
              <Route exact path="/backup" component={Backup} />
              <Route render={(): JSX.Element => <>Page Not Found!</>} />
              {/* <Route exact path="/movie/:user" render={Register} /> */}
            </Switch>
          </Container>
        </main>
      </div>
    </Router>
  );
});

export default App;
