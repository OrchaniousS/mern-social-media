import React from "react";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";

import App from "../App";

const LOCAL_SERVER = false;

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createUploadLink({
  uri: LOCAL_SERVER
    ? "http://localhost:5000/graphql"
    : "https://stormy-savannah-39391.herokuapp.com/graphql",
});

const client = new ApolloClient({
  cors: {
    origin: "*",
    credentials: true,
  },
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
