import { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";

import { AuthContext } from "../Context/auth";
import { useForm } from "../Util/hooks";

const { useMutation } = require("@apollo/react-hooks");

const gql = require("graphql-tag");

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
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
    <div className="form-container">
      <Form noValidate onSubmit={onSubmit} className={loading ? "loading" : ""}>
        Register
        <Form.Input
          icon="user"
          type="text"
          value={values.username}
          label="Username"
          placeholder="Username"
          name="username"
          onChange={onChange}
          error={errors.username ? true : false}
        />
        <Form.Input
          icon="mail"
          type="email"
          value={values.email}
          label="Email"
          placeholder="Email"
          name="email"
          onChange={onChange}
          error={errors.email ? true : false}
        />
        <Form.Input
          icon="key"
          type="password"
          value={values.password}
          label="Password"
          placeholder="Password"
          name="password"
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Form.Input
          icon="key"
          type="password"
          value={values.confirmPassword}
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
