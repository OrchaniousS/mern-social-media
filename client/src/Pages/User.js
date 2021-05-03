import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Container, Form, Grid, Header, Image } from "semantic-ui-react";
import {
  useQuery,
  //  useMustation
} from "@apollo/react-hooks";

// import gql from "graphql-tag";
// import { useForm } from "../Util/hooks";

import { AuthContext } from "../Context/auth";
import { FETCH_USER_QUERY } from "../Util/graphql";

function User() {
  // const userName = props.match.params.user;
  const { user } = useContext(AuthContext);
  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  const [values, setValues] = useState();

  // Future edit user option
  // const initialState = {
  //   username: values.username,
  //   password: values.password,
  //   confirmPassword: values.confirmPassword,
  //   email: values.email,
  // };

  // const { onChange, onSubmit, values } = useForm(
  //   EditUserCallBack,
  //   initialState
  // );

  // const [editUser] = useMutation(EDIT_USER, { variables: values });

  // function EditUserCallBack() {
  //   editUser();
  // }

  useEffect(() => {
    if (getUserData) {
      getUserData.filter((item) => {
        try {
          return user && item.username === user.username && setValues(item);
        } catch (err) {
          console.log(err);
          throw new Error(err);
        }
      });
    }
  }, [getUserData, user]);

  return user ? (
    <Container style={{ textAlign: "center", margin: "1rem" }}>
      <Grid style={{ textAlign: "center", margin: "1rem" }} centered>
        <Grid.Row>
          <Header as="h2" style={{ alignItems: "center" }}>
            {values && values.username}
            <Image size="massive" src={values && values.logo} />
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Form>
            <Form.Field>
              <Form.Input
                icon="user"
                type="text"
                defaultValue={values && values.username}
                label="Username"
                placeholder="Username"
                name="username"
                // onChange={onChange}
                // error={errors.username ? true : false}
              />
              <Form.Input
                icon="email"
                type="email"
                defaultValue={values && values.email}
                label="Email"
                placeholder="Email"
                name="email"
                disabled
                // onChange={onChange}
                // error={errors.username ? true : false}
              />
              <Form.Input
                icon="password"
                type="password"
                // defaultValue={user.username}
                label="New Password"
                placeholder="New Password"
                name="newPassword"
                // onChange={onChange}
                // error={errors.username ? true : false}
              />
              <Form.Input
                icon="password"
                type="password"
                // defaultValue={user.username}
                label="New Password"
                placeholder="Confirm New Password"
                name="confirmNewPassword"
                // onChange={onChange}
                // error={errors.username ? true : false}
              />
            </Form.Field>
          </Form>
        </Grid.Row>
      </Grid>
    </Container>
  ) : (
    <Redirect to="/" />
  );
}

// const EDIT_USER = gql`
//   mutation editUser(
//     $username: String!
//     $email: String!
//     $password: String!
//     $confirmPassword: String!
//     $logo: Upload!
//   ) {
//     editUser(
//       username: $username
//       email: $email
//       password: $password
//       confirmPassword: $confirmPassword
//       logo: $logo
//     ) {
//       id
//       email
//       username
//       createdAt
//       token
//       logo
//     }
//   }
// `;

export default User;
