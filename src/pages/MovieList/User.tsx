import React, { useState, useEffect } from "react";
import MovieList from "../Home/MovieList";
import { CircularProgress, Box, Typography } from "@material-ui/core";
import { User as UserType } from "../../type";
import { RouteComponentProps } from "react-router-dom";
import { User as UserAgent } from "../../helper/agent";

export interface UserProps {}

const getFirstUpperCase = (value: string): string =>
  `${value.charAt(0).toUpperCase()}${value.substring(1)}`;

const User: React.FC<UserProps & RouteComponentProps<{ user: string }>> = ({
  match
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  // TODO: use global state
  useEffect(() => {
    UserAgent.getAll().then(body => {
      if (Array.isArray(body.data)) {
        const found = (body.data as UserType[]).find(
          user => user.username === match.params.user
        );
        if (found !== undefined) {
          setUser(found);
        }
      }
    });
  }, [match.params.user]);
  if (user === null) {
    return <CircularProgress />;
  }
  return (
    <>
      <Typography variant="h1" gutterBottom>
        <Box fontWeight="fontWeightMedium">
          {getFirstUpperCase(user.firstName)} {getFirstUpperCase(user.lastName)}
        </Box>
      </Typography>
      {/* <MovieList user={user} onRemove={() => {}} /> */}
    </>
  );
};

export default User;
