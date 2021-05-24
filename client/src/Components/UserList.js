import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Button, Grid, Image, Transition, List } from "semantic-ui-react";

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
                  <h1>User List</h1>
                </div>
              </Button>
            </CustomPopup>
          </Grid.Row>
          <List
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxHeight: "250px",
              overflow: "auto",
              flex: "1 1 150px",
              justifyContent: "center",
            }}
          >
            <Transition.Group duration={400}>
              {userState &&
                data.map(({ id, status, username }) => (
                  <List.Item
                    key={id}
                    style={{
                      border: "1px solid grey",
                      padding: "0.5rem",
                      margin: "1rem",
                      borderRadius: "0.4rem",
                      width: "180px",
                      alignItems: "center",
                    }}
                  >
                    <List.Content>
                      <List.Content floated="right">
                        <Image
                          style={{
                            width: "25px",
                            height: "25px",
                            borderRadius: "1rem",
                          }}
                          onError={() => setViewImage(true)}
                          src={UserCard.UserCardData(
                            getUserData,
                            username,
                            viewImage
                          )}
                        />
                      </List.Content>
                      <div style={{ fontSize: "0.9rem" }}>
                        {UserCard.UserStatus(getUserData, username)}
                        {username}
                      </div>
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
