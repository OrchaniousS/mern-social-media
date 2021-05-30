import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import { AuthProvider } from "./Context/auth";
import AuthRoute from "./Util/AuthRoute";

import MenuBar from "./Components/MenuBar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import SinglePost from "./Pages/SinglePost";
import User from "./Pages/User";
import Users from "./Pages/Users";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact type="User" path="/users/:user" component={User} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
          <Route exact path="/:user" component={Users} />
          <Footer />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
