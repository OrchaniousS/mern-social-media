import React from "react";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";

import App from "../App";

const client = new ApolloClient({
  cors: {
    origin: "*",
    credentials: true,
  },
  link: createHttpLink({ uri: "http://localhost:5000/" }),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
