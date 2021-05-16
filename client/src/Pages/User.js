import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Form,
  Grid,
  Header,
  Image,
  Button,
  Transition,
} from "semantic-ui-react";
import {
  useQuery,
  //  useMustation
} from "@apollo/react-hooks";

// import gql from "graphql-tag";
// import { useForm } from "../Util/hooks";

import UserCard from "../Components/UserCard";
import { AuthContext } from "../Context/auth";
import { FETCH_USER_QUERY } from "../Util/graphql";

function User() {
  // const userName = props.match.params.user;
  const { user } = useContext(AuthContext);
  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  const initialState = {
    username: "",
    password: "",
    confirmNewPassword: "",
    email: "",
  };

  const [viewImage, setViewImage] = useState(false);
  const [values, setValues] = useState(initialState);
  const [editUser, setEditUser] = useState(true);

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
      return getUserData.filter((item) => {
        try {
          return user && item.username === user.username && setValues(item);
        } catch (err) {
          console.log(err);
          throw new Error(err);
        }
      });
    }
  });

  const userContainer = user ? (
    <Container style={{ textAlign: "center", margin: "1rem" }}>
      <Grid style={{ textAlign: "center", margin: "1rem" }} centered>
        <Grid.Row>
          <Button color="red" disabled="true">
            <Header as="h2" style={{ alignItems: "center" }}>
              {values && values.username}
              <Image
                size="massive"
                onError={() => setViewImage((curr) => !curr)}
                src={
                  values && UserCard.UserCardData(getUserData, user, viewImage)
                }
              />
            </Header>
          </Button>
        </Grid.Row>
        <Grid.Row>
          <Transition.Group animation="slide up" duration={500}>
            {!editUser && (
              <Form style={{ textAlign: "center", margin: "2rem" }}>
                <Form.Field>
                  <Form.Input
                    disabled={editUser}
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
                    icon="mail"
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
                    disabled={editUser}
                    icon="key"
                    type="password"
                    // defaultValue={user.username}
                    label="New Password"
                    placeholder="New Password"
                    name="newPassword"
                    // onChange={onChange}
                    // error={errors.username ? true : false}
                  />
                  <Form.Input
                    disabled={editUser}
                    icon="key"
                    type="password"
                    // defaultValue={user.username}
                    label="New Password"
                    placeholder="Confirm New Password"
                    name="confirmNewPassword"
                    // onChange={onChange}
                    // error={errors.username ? true : false}
                  />
                  <Form.Input
                    disabled={editUser}
                    icon="image"
                    type="file"
                    // defaultValue={user.username}
                    label="New Image"
                    placeholder="Confirm New Password"
                    name="logo"
                    // onChange={onChange}
                    // error={errors.username ? true : false}
                  />
                </Form.Field>
              </Form>
            )}
          </Transition.Group>
        </Grid.Row>
        <Grid>
          <Grid.Row>
            <Button
              onClick={() => setEditUser((curr) => !curr)}
              content={"Edit user"}
              color="red"
              icon="edit"
            />
            <Button
              type="submit"
              content={"Save changes"}
              color="red"
              icon="save"
              primary
            />
          </Grid.Row>
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Redirect to="/" />
  );

  return <>{userContainer}</>;
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
