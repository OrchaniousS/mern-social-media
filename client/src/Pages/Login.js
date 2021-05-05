import { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";

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
    <div className="form-container">
      <Form noValidate onSubmit={onSubmit} className={loading ? "loading" : ""}>
        Login
        <Form.Input
          type="text"
          value={values.username}
          label="Username"
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
          label="Password"
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
        <Button type="submit" primary>
          Login
        </Button>
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
    </div>
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
