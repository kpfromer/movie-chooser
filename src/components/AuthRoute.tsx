import React from "react";
import { Route, RouteProps } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import { GET_AUTH } from "../resolvers/authorization";
import { Link } from "react-router-dom";

export interface AuthRouteProps {}

const AuthRoute: React.FC<RouteProps> = props => {
  const { data } = useQuery(GET_AUTH);
  if (data.authStatus.status === "loggedOut") {
    return <Link to="/login" />;
  }
  return <Route {...props} />;
};

export default AuthRoute;
