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
  Icon,
  Confirm,
} from "semantic-ui-react";
import { useQuery, useMutation } from "@apollo/react-hooks";

import gql from "graphql-tag";
import { useForm } from "../Util/hooks";

import UserCard from "../Components/UserCard";
import { AuthContext } from "../Context/auth";
import { FETCH_USER_QUERY } from "../Util/graphql";

function User(props) {
  // const userName = props.match.params.user;
  const { user, Logout } = useContext(AuthContext);
  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  const initialState = {
    id: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    logo: "",
  };

  const [valuesEdited, setValuesEdited] = useState(initialState);

  useEffect(() => {
    if (getUserData) {
      try {
        return getUserData.filter(
          (item) =>
            user && item.username === user.username && setValuesEdited(item)
        );
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }
  });

  const [errors, setErrors] = useState({});
  const [viewImage, setViewImage] = useState(false);
  const [editUser, setEditUser] = useState(true);

  const { onChange, onSubmit, values } = useForm(
    EditUserCallBack,
    initialState
  );

  // EDIT USER
  const [editActiveUser] = useMutation(EDIT_USER, {
    update(_) {
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function EditUserCallBack() {
    editActiveUser();
  }

  const [confirm, setConfirm] = useState(false);

  // DELETE USER
  const [deleteUser] = useMutation(DELETE_USER, {
    update(_) {
      setConfirm(false);
      Logout();
    },
    variables: { username: valuesEdited.username },
  });

  const userContainer = user ? (
    <Container style={{ textAlign: "center", margin: "1rem" }}>
      <Grid style={{ textAlign: "center", margin: "1rem" }} centered>
        <Grid.Row>
          <Card
            onError={() => setViewImage((curr) => !curr)}
            image={
              values && UserCard.UserCardData(getUserData, user, viewImage)
            }
            header={
              values && (
                <Segment textAlign="center">
                  <Icon name="user" />
                  {valuesEdited.username}
                </Segment>
              )
            }
            meta={
              values && (
                <Segment textAlign="center">
                  <Icon name="mail" />
                  {valuesEdited.email}
                </Segment>
              )
            }
            // description="desc"
            extra={
              <Button
                fluid
                icon="user"
                color="red"
                content="Regular User"
                disabled
              />
            }
          />
        </Grid.Row>
        <Grid.Row>
          <Segment stacked>
            <Transition.Group animation="slide down" duration={200}>
              <Grid.Column>
                <Button
                  style={{ minWidth: 260 }}
                  fluid
                  onClick={() => setEditUser((curr) => !curr)}
                  content="Edit user"
                  icon="edit"
                  color="grey"
                />
              </Grid.Column>
              {!editUser && (
                <Form
                  noValidate
                  onSubmit={onSubmit}
                  style={{ maxWidth: 260, padding: "1rem" }}
                >
                  <Form.Field>
                    <Form.Input
                      readOnly
                      type="text"
                      value={(values.id = valuesEdited.id)}
                      // defaultValue={valuesEdited.id}
                      name="id"
                      onChange={onChange}
                      style={{ display: "none" }}
                    />
                    <Form.Input
                      // readOnly
                      icon="user"
                      type="text"
                      value={
                        (values.username = values.username
                          ? values.username
                          : valuesEdited.username)
                      }
                      // defaultValue={valuesEdited && valuesEdited.username}
                      label="New Username"
                      placeholder="Username"
                      name="username"
                      onChange={onChange}
                      error={errors.username ? true : false}
                    />
                    <Form.Input
                      // readOnly
                      icon="mail"
                      type="email"
                      value={
                        (values.email = values.email
                          ? values.email
                          : valuesEdited.email)
                      }
                      // defaultValue={valuesEdited && valuesEdited.email}
                      label="New Email"
                      placeholder="Email"
                      name="email"
                      onChange={onChange}
                      error={errors.email ? true : false}
                    />
                    <Form.Input
                      // disabled={editUser}
                      icon="key"
                      type="password"
                      value={values.password}
                      label="New Password"
                      placeholder="New Password"
                      name="password"
                      onChange={onChange}
                      error={errors.password ? true : false}
                    />
                    <Form.Input
                      // disabled={editUser}
                      icon="key"
                      type="password"
                      value={values.confirmPassword}
                      label="Confirm New Password"
                      placeholder="New Password"
                      name="confirmPassword"
                      onChange={onChange}
                      error={errors.confirmPassword ? true : false}
                    />
                    <Form.Input
                      type="file"
                      accept="image/*"
                      icon="image"
                      name="logo"
                      label="New Profile Image"
                      onChange={onChange}
                      error={errors.logo ? true : false}
                    />
                  </Form.Field>
                  <Button
                    fluid
                    type="submit"
                    content="Save changes"
                    icon="save"
                    primary
                  />
                </Form>
              )}
            </Transition.Group>
            {Object.keys(errors).length > 0 && (
              <div className="ui error message">
                <ul className="list">
                  {Object.values(errors).map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              </div>
            )}
          </Segment>
        </Grid.Row>
        <Grid.Row width={16}>
          <Segment stacked>
            <Button
              style={{ minWidth: 260 }}
              color="red"
              icon="trash"
              content="Delete User"
              onClick={() => setConfirm(true)}
            />
            <Confirm
              open={confirm}
              onCancel={() => setConfirm(false)}
              onConfirm={deleteUser}
            />
          </Segment>
        </Grid.Row>
      </Grid>
    </Container>
  ) : (
    <Redirect to="/" />
  );

  return userContainer;
}

const EDIT_USER = gql`
  mutation editUser(
    $id: ID
    $username: String
    $email: String
    $password: String
    $confirmPassword: String
    $logo: Upload
  ) {
    editUser(
      id: $id
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      logo: $logo
    ) {
      id
      username
      email
      password
      logo
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($username: String!) {
    deleteUser(username: $username) {
      username
    }
  }
`;

export default User;
