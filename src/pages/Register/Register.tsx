import React, { useState, FormEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import CommonStore from '../../store/CommonStore';
import { observer } from 'mobx-react-lite';
import { client } from '../..';
import { REGISTER } from '../../resolvers/authorization';

const Register: React.FC = observer(() => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return <Redirect to="/" />;
  }

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!!username && !!firstName && !!lastName && !!password) {
      client
        .mutate({
          mutation: REGISTER,
          variables: {
            username,
            password,
            firstName,
            lastName
          }
        })
        .then(res => {
          CommonStore.notify({ message: 'Registered User.', type: 'success' });
          CommonStore.login(username, res.data.signUp.token);
          setDone(true);
        })
        .catch(error => {
          setMessage(error);
        });
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
          onChange={(event): void => setUsername(event.target.value)}
          required
        />
        <br />
        <TextField
          value={firstName}
          label="First Name"
          onChange={(event): void => setFirstName(event.target.value)}
          required
        />
        <br />
        <TextField
          value={lastName}
          label="Last Name"
          onChange={(event): void => setLastName(event.target.value)}
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

export default Register;
