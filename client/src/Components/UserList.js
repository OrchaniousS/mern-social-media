import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Button, Grid, Image, Container, Transition } from "semantic-ui-react";

import { FETCH_USER_QUERY } from "../Util/graphql";
import CustomPopup from "../Util/CustomPopup";

function UserList() {
  const [userState, setUserState] = useState(false);

  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  //   const userList = getUserData && <div>{console.log(getUserData)}</div>;

  const userStateHandler = () => setUserState((current) => !current);

  function usersTaken(data) {
    if (data) {
      return (
        <Grid centered columns={3}>
          <CustomPopup content="Get registerd users list">
            <Button color="red">
              <div className="user-list" onClick={userStateHandler}>
                <h1>User List</h1>
              </div>
            </Button>
          </CustomPopup>
          <Transition.Group duration={400}>
            {userState && (
              <Container>
                {data.map(({ id, logo, status, username }) => {
                  return (
                    <Grid.Column
                      key={id}
                      style={{
                        border: "1px solid grey",
                        padding: "0.6rem",
                        margin: "0.3rem",
                        borderRadius: "0.2rem",
                      }}
                    >
                      <div>
                        <Image src={logo} />
                        {status}
                        {username}
                      </div>
                    </Grid.Column>
                  );
                })}
              </Container>
            )}
          </Transition.Group>
        </Grid>
      );
    }
  }

  return usersTaken(getUserData);
}

export default UserList;
