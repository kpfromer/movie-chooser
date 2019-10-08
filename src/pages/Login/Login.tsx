import React, { useState, FormEvent } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import axios from "axios";
import { getUrl } from "../../helper/getUrl";
import { useGlobalState } from "../..";
import { Redirect } from "react-router-dom";
import { Auth } from "../../helper/agent";

export interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [state, dispatch] = useGlobalState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return <Redirect to="/" />;
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Auth.login({ username, password }).then(body => {
      dispatch.setToken(body.data.token);
      dispatch.setUsername(username);
      dispatch.setSnackbar({ message: "Logged In.", type: "success" });
      setDone(true);
    });
    // axios
    //   .post(getUrl("login"), { username, password })
    //   .then(res => {
    //     // TODO: set token
    //     console.log(res.data.data.token);
    //     dispatch.setToken(res.data.data.token);
    //     dispatch.setUsername(username);
    //     setDone(true);
    //   })
    //   .catch(error => {
    //     if (error.response) {
    //       // The request was made and the server responded with a status code
    //       // that falls out of the range of 2xx
    //       // console.log(error.response.data);
    //       setMessage(error.response.data.message);
    //       // console.log(error.response.status);
    //       // console.log(error.response.headers);
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //       // http.ClientRequest in node.js
    //       console.log(error.request);
    //       setMessage("Error");
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.log("Error", error.message);
    //       setMessage("Error");
    //     }
    //   });
  };

  return (
    <>
      <form onSubmit={submit}>
        <Typography variant="h3">Login</Typography>
        <Typography variant="h5" color="error">
          {message}
        </Typography>
        <TextField
          value={username}
          label="Username"
          onChange={event => setUsername(event.target.value)}
          required
        />
        <br />
        <TextField
          value={password}
          label="Password"
          type="password"
          onChange={event => setPassword(event.target.value)}
          required
        />
        <br />
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

export default Login;
