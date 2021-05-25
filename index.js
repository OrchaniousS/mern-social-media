require("dotenv").config({ path: ".env" });
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const PORT = process.env.PORT || 5000;
const LOCAL_SERVER = true;

const server = new ApolloServer({
  cors: {
    origin: "*",
    credentials: true,
  },
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const app = express();
server.applyMiddleware({ app });

var corsOptions = {
  origin: LOCAL_SERVER
    ? "http://localhost:3000"
    : "https://merng-social-orchan.netlify.app/",
  credentials: true,
};

app.use(express.static("public"));
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.listen({ port: PORT }, () => {
  console.log("connected to database :)");
  // console.log(`server running at http://localhost:${PORT}`);
});
