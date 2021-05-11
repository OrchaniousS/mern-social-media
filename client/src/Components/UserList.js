import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Button, Grid, Image, Container, Transition } from "semantic-ui-react";

import { FETCH_USER_QUERY } from "../Util/graphql";
import CustomPopup from "../Util/CustomPopup";

function UserList() {
  const [userState, setUserState] = useState(false);

  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  const userStateHandler = () => setUserState((current) => !current);

  function usersTaken(data) {
    return (
      data && (
        <Grid centered columns={9}>
          <Grid.Row columns={9}>
            <CustomPopup content="Get registerd users list">
              <Button color="red">
                <div className="user-list" onClick={userStateHandler}>
                  <h1>User List</h1>
                </div>
              </Button>
            </CustomPopup>
          </Grid.Row>
          <Transition.Group duration={400}>
            <Grid.Row columns={9}>
              {userState && (
                <>
                  {data.map(({ id, logo, status, username }) => {
                    return (
                      <Grid.Column
                        key={id}
                        style={{
                          border: "1px solid grey",
                          padding: "0.6rem",
                          margin: "0.3rem",
                          borderRadius: "0.2rem",
                          minWidth: "100px",
                        }}
                      >
                        <Grid.Row>
                          <Grid.Column>
                            <Image src={logo} />
                          </Grid.Column>
                          <Grid.Column>{status}</Grid.Column>
                          <Grid.Column>{username}</Grid.Column>
                        </Grid.Row>
                      </Grid.Column>
                    );
                  })}
                </>
              )}
            </Grid.Row>
          </Transition.Group>
        </Grid>
      )
    );
  }

  return <>{usersTaken(getUserData)}</>;
}

export default UserList;
