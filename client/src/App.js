import React, { useContext } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import { AuthProvider } from "./Context/auth";
import AuthRoute from "./Util/AuthRoute";

import MenuBar from "./Components/MenuBar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import User from "./Pages/User";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthContext } from "./Context/auth";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path={`/${user}`} component={User} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
