import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import MenuBar from "./Components/MenuBar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Container>
    </Router>
  );
}

export default App;
