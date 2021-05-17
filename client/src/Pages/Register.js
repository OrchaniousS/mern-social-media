import { useContext, useState } from "react";
import {
  Button,
  Form,
  Segment,
  Grid,
  Header,
  Message,
} from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../Context/auth";
import { useForm } from "../Util/hooks";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    logo: "",
  };

  const { onChange, onSubmit, values } = useForm(
    RegisterUserCallback,
    initialState
  );

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function RegisterUserCallback() {
    addUser();
  }

  return (
    <Grid textAlign="center" style={{ height: "60vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="red" textAlign="center">
          Create a new account
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
              label="Username"
              placeholder="Username"
              name="username"
              onChange={onChange}
              error={errors.username ? true : false}
              required
              action={{
                color: "red",
                icon: "user",
                disabled: true,
              }}
            />
            <Form.Input
              type="email"
              value={values.email}
              label="Email"
              placeholder="Email"
              name="email"
              onChange={onChange}
              error={errors.email ? true : false}
              required
              action={{
                color: "red",
                icon: "mail",
                disabled: true,
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
              required
              action={{
                color: "red",
                icon: "key",
                disabled: true,
              }}
            />
            <Form.Input
              type="password"
              value={values.confirmPassword}
              label="Confirm Password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={onChange}
              error={errors.confirmPassword ? true : false}
              required
              action={{
                color: "red",
                icon: "key",
                disabled: true,
              }}
            />
            <Form.Input
              type="file"
              accept="image/*"
              label="Profile Image"
              name="logo"
              onChange={onChange}
              error={errors.logo ? true : false}
              required
              action={{
                color: "red",
                icon: "image",
                disabled: true,
              }}
            />
            <Button type="submit" fluid color="red">
              Register
            </Button>
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
          Already have an account? <a href="/login">Login</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $logo: Upload!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      logo: $logo
    ) {
      id
      email
      username
      createdAt
      token
      logo
    }
  }
`;

export default Register;
