import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Grid,
  Button,
  Transition,
  Segment,
} from "semantic-ui-react";
import { useQuery, useMutation } from "@apollo/react-hooks";

import gql from "graphql-tag";
import { useForm } from "../Util/hooks";

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
    email: "",
    logo: "",
  };

  useEffect(() => {
    if (getUserData) {
      return getUserData.filter((item) => {
        try {
          return (
            user && item.username === user.username && setValuesEdited(item)
          );
        } catch (err) {
          console.log(err);
          throw new Error(err);
        }
      });
    }
  });

  // Future edit user option
  // const initialState = {
  //   username: valuesEdited.username,
  //   password: valuesEdited.password,
  //   confirmPassword: valuesEdited.confirmPassword,
  //   email: valuesEdited.email,
  // };

  const [errors, setErrors] = useState({});
  const [viewImage, setViewImage] = useState(false);
  const [valuesEdited, setValuesEdited] = useState(initialState);
  const [editUser, setEditUser] = useState(true);

  const { onChange, onSubmit, values } = useForm(
    EditUserCallBack,
    initialState
  );

  const [editActiveUser] = useMutation(EDIT_USER, {
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function EditUserCallBack() {
    editActiveUser();
  }

  const userContainer = user ? (
    <Container style={{ textAlign: "center", margin: "1rem" }}>
      <Grid style={{ textAlign: "center", margin: "1rem" }} centered>
        <Grid.Row>
          <Card
            onError={() => setViewImage((curr) => !curr)}
            image={
              values && UserCard.UserCardData(getUserData, user, viewImage)
            }
            header={values && valuesEdited.username}
            meta={values && valuesEdited.email}
            // description="desc"
            extra={
              <Button
                fluid
                icon="user"
                color="red"
                content="Regular User"
                disabled="true"
              />
            }
          />
        </Grid.Row>
        <Grid.Row>
          <Segment stacked>
            <Transition.Group animation="slide down" duration={200}>
              <Grid.Column>
                <Button
                  style={{ minWidth: 260, maxWidth: 450 }}
                  fluid
                  onClick={() => setEditUser((curr) => !curr)}
                  content={"Edit user"}
                  color="red"
                  icon="edit"
                  centered
                />
              </Grid.Column>
              {!editUser && (
                <Form
                  noValidate
                  textAlign="center"
                  onSubmit={onSubmit}
                  style={{ maxWidth: 260, padding: "1rem" }}
                >
                  <Form.Field>
                    <Form.Input
                      disabled={editUser}
                      icon="user"
                      type="text"
                      defaultValue={values && valuesEdited.username}
                      label="Username"
                      placeholder="Username"
                      name="username"
                      onChange={onChange}
                      error={errors.username ? true : false}
                    />
                    <Form.Input
                      icon="mail"
                      type="email"
                      defaultValue={values && valuesEdited.email}
                      label="Email"
                      placeholder="Email"
                      name="email"
                      disabled
                      onChange={onChange}
                      error={errors.username ? true : false}
                    />
                    <Form.Input
                      disabled={editUser}
                      icon="key"
                      type="password"
                      label="New Password"
                      placeholder="New Password"
                      name="password"
                      onChange={onChange}
                      error={errors.username ? true : false}
                    />
                    {/* <Form.Input
                    disabled={editUser}
                    icon="key"
                    type="password"
                    // defaultValue={user.username}
                    label="New Password"
                    placeholder="Confirm New Password"
                    name="confirmNewPassword"
                    // onChange={onChange}
                    // error={errors.username ? true : false}
                  /> */}
                    <Form.Input
                      disabled={editUser}
                      type="file"
                      accept="image/*"
                      icon="image"
                      name="logo"
                      label="New Profile Image"
                      onChange={onChange}
                      error={errors.username ? true : false}
                    />
                  </Form.Field>
                  <Button
                    fluid
                    type="submit"
                    content="Save changes"
                    color="red"
                    icon="save"
                    primary
                  />
                </Form>
              )}
            </Transition.Group>
          </Segment>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  ) : (
    <Redirect to="/" />
  );

  return <>{userContainer}</>;
}

const EDIT_USER = gql`
  mutation editUser($username: String!, $password: String!, $logo: Upload!) {
    editUser(username: $username, password: $password, logo: $logo) {
      username
      password
      logo
    }
  }
`;

export default User;
