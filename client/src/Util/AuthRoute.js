import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../Context/auth";

export default function AuthRoute({ type, component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          type === "User" ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}
