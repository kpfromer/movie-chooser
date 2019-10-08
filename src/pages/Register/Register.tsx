import React, { useState, FormEvent } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import axios from "axios";
import { getUrl } from "../../helper/getUrl";
import { Redirect } from "react-router-dom";
import { Auth } from "../../helper/agent";
import { useGlobalState } from "../..";

export interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [_, dispatch] = useGlobalState();

  if (done) {
    return <Redirect to="/login" />;
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!!username && !!firstName && !!lastName && !!password) {
      Auth.register({
        username,
        password,
        firstName,
        lastName
      }).then(body => {
        dispatch.setSnackbar({ message: "Registered", type: "success" });
        setDone(true);
      });
      //   .post(getUrl("register"), {
      //     username,
      //     password,
      //     firstName,
      //     lastName
      //   })
      //   .then(() => {
      //     setDone(true);
      //   });
      // axios
    }
  };

  return (
    <>
      <form onSubmit={submit}>
        <Typography variant="h3">Register</Typography>
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
          value={firstName}
          label="First Name"
          onChange={event => setFirstName(event.target.value)}
          required
        />
        <br />
        <TextField
          value={lastName}
          label="Last Name"
          onChange={event => setLastName(event.target.value)}
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

export default Register;
