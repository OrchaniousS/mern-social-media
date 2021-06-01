import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Button, Grid, Image, Transition, List, Icon } from "semantic-ui-react";

import UserCard from "./UserCard";
import { FETCH_USER_QUERY } from "../Util/graphql";
import CustomPopup from "../Util/CustomPopup";

function UserList() {
  const [userState, setUserState] = useState(false);
  const [viewImage, setViewImage] = useState(false);

  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  const userStateHandler = () => setUserState((current) => !current);

  function usersTaken(data) {
    return (
      data && (
        <Grid container centered style={{ margin: "auto" }}>
          <Grid.Row>
            <CustomPopup content="Get registerd users list">
              <Button color="red">
                <div className="user-list" onClick={userStateHandler}>
                  <h1>
                    <Icon name="users" /> Users List
                  </h1>
                </div>
              </Button>
            </CustomPopup>
          </Grid.Row>
          <List id="userList">
            <Transition.Group duration={400}>
              {userState &&
                data.map(({ id, username }) => (
                  <List.Item key={id}>
                    <List.Content>
                      <List.Content floated="right">
                        <Image
                          onError={() => setViewImage(true)}
                          src={UserCard.UserCardData(
                            getUserData,
                            username,
                            viewImage
                          )}
                        />
                      </List.Content>
                      {UserCard.UserStatus(getUserData, username)}
                      <Link to={`/${username}`}>{username}</Link>
                    </List.Content>
                  </List.Item>
                ))}
            </Transition.Group>
          </List>
        </Grid>
      )
    );
  }

  return <>{usersTaken(getUserData)}</>;
}

export default UserList;
