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
          <Grid.Row style={{ justifyContent: "center" }}>
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
              height: "auto",
              flex: "1 1 150px",
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
                      borderRadius: "0.2rem",
                      minWidth: "150px",
                      maxWidth: "200px",
                      justifyContent: "center",
                    }}
                  >
                    <List.Content>
                      <List.Content floated="right">
                        <Image
                          style={{ width: "35px", height: "35px" }}
                          onError={() => setViewImage(true)}
                          src={UserCard.UserCardData(
                            getUserData,
                            username,
                            viewImage
                          )}
                        />
                      </List.Content>
                      {UserCard.UserStatus(getUserData, username)}
                      {username}
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
