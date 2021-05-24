import { useContext, useState } from "react";
import {
  Grid,
  Segment,
  Button,
  Form,
  Header,
  Image,
  Message,
} from "semantic-ui-react";

import { AuthContext } from "../Context/auth";
import { useForm } from "../Util/hooks";

const { useMutation } = require("@apollo/react-hooks");

const gql = require("graphql-tag");

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    password: "",
    status: "",
  };

  const { onChange, onSubmit, values } = useForm(
    RegisterUserCallback,
    initialState
  );

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err && err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function RegisterUserCallback() {
    loginUser();
  }

  return (
    <Grid textAlign="center" style={{ height: "60vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="red" textAlign="center">
          <Image
            size="medium"
            src="https://camo.githubusercontent.com/5f960857e97d73e1dfa406ce5d4bee1797e1ee000a6b29210f077ed8880daecf/68747470733a2f2f6432656970397366336f6f3663322e636c6f756466726f6e742e6e65742f7365726965732f7371756172655f636f766572732f3030302f3030302f3233312f66756c6c2f4547485f41706f6c6c6f2d4772617068514c2d52656163745f46696e616c2e706e67"
          />
          Login into your accont
        </Header>
        <Form
          noValidate
          onSubmit={onSubmit}
          className={loading ? "loading" : ""}
        >
          <Segment stacked>
            <Form.Input
              type="text"
              value={values.username}
              placeholder="Username"
              name="username"
              onChange={onChange}
              error={errors.username ? true : false}
              action={{
                color: "red",
                icon: "user",
              }}
            />
            <Form.Input
              type="password"
              value={values.password}
              placeholder="Password"
              name="password"
              onChange={onChange}
              error={errors.password ? true : false}
              action={{
                color: "red",
                icon: "key",
              }}
            />
            <Form.Input
              type="text"
              value={(values.status = "online")}
              name="status"
              style={{ display: "none" }}
              onChange={onChange}
            />
            <Button
              content="Login"
              fluid
              size="large"
              type="submit"
              color="red"
            />
          </Segment>
        </Form>
        {Object.keys(errors).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
        <Message>
          New to us? <a href="/register">Register</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!, $status: String!) {
    login(username: $username, password: $password, status: $status) {
      id
      email
      username
      createdAt
      token
      status
    }
  }
`;

export default Login;
