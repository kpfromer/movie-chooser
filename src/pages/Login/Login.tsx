import React, { useState, FormEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

import { useApolloClient } from '@apollo/react-hooks';
import { SIGN_IN } from '../../resolvers/authorization';
import { observer } from 'mobx-react-lite';
import CommonStore from '../../store/CommonStore';

const Login: React.FC = observer(() => {
  const client = useApolloClient();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return <Redirect to="/" />;
  }

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    client
      .mutate({ mutation: SIGN_IN, variables: { login: username, password } })
      .then(res => {
        console.log(res.data.signIn);
        CommonStore.login(
          username,
          res.data.signIn.token,
          res.data.signIn.user.role
        );
        CommonStore.notify({ message: 'Logged In.', type: 'success' });
        setDone(true);
      })
      .catch(error => {
        if (error.graphQLErrors) {
          setMessage(error.graphQLErrors.map(x => x.message));
          return;
        }
        throw error;
      });
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
          onChange={(event): void => setUsername(event.target.value)}
          required
        />
        <br />
        <TextField
          value={password}
          label="Password"
          type="password"
          onChange={(event): void => setPassword(event.target.value)}
          required
        />
        <br />
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
});

export default Login;
