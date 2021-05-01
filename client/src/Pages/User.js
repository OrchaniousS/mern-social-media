import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Form,
  Grid,
  Header,
  Image,
  // Segment,
  // Dimmer,
  // Loader,
} from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";

import { AuthContext } from "../Context/auth";
import { FETCH_USER_QUERY } from "../Util/graphql";

function User(props) {
  // const userName = props.match.params.user;
  const { user } = useContext(AuthContext);
  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  const { username, logo, email } = getUserData.filter(
    (item) => item.username === user.username && item
  )[0];

  console.log(
    getUserData.filter((item) => item.username === user.username && item)
  );

  return user ? (
    <Container style={{ textAlign: "center", margin: "1rem" }}>
      <Grid style={{ textAlign: "center", margin: "1rem" }} centered>
        <Grid.Row>
          <Header as="h2" style={{ alignItems: "center" }}>
            {username}
            <Image size="massive" src={logo} />
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Form>
            <Form.Field>
              <Form.Input
                icon="user"
                type="text"
                defaultValue={username}
                label="Username"
                placeholder="Username"
                name="username"
                // onChange={onChange}
                // error={errors.username ? true : false}
              />
              <Form.Input
                icon="user"
                type="email"
                defaultValue={email}
                label="Email"
                placeholder="Email"
                name="email"
                disabled
                // onChange={onChange}
                // error={errors.username ? true : false}
              />
              <Form.Input
                icon="user"
                type="password"
                // defaultValue={user.username}
                label="New Password"
                placeholder="New Password"
                name="newPassword"
                // onChange={onChange}
                // error={errors.username ? true : false}
              />
              <Form.Input
                icon="user"
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
    // <Segment style={{ margin: "auto" }}>
    //   <Dimmer active inverted>
    //     <Loader inverted>Loading</Loader>
    //   </Dimmer>
    //   <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
    // </Segment>
  );
}

export default User;
