import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Dimmer, Loader, Image, Segment } from "semantic-ui-react";

import { FETCH_USER_QUERY, FETCH_POSTS_QUERY } from "../Util/graphql";
import { AuthContext } from "../Context/auth";

export default function Users(props) {
  const singleUserName = props.match.url.split("/")[1];
  const { user } = useContext(AuthContext);
  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);
  const { data: { getPosts: getPostsData } = {} } = useQuery(FETCH_POSTS_QUERY);

  const LoadingSegment = (
    <Grid>
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
      <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
    </Grid>
  );

  let users;
  let posts;

  console.log(getPostsData);

  posts = getPostsData
    ? getPostsData
        .filter((item) => item.username === singleUserName)
        .map((userPost) => <Grid key={userPost.id}></Grid>)
    : LoadingSegment;

  users = (
    <Grid style={{ margin: "auto" }}>
      <Segment style={{ margin: "auto" }}>
        {getUserData
          ? getUserData
              .filter((item) => item.username === singleUserName)
              .map((user) => (
                <Grid.Column key={user.username}>
                  <Grid.Row>{user.username}</Grid.Row>
                  <Grid.Row>{user.email}</Grid.Row>
                </Grid.Column>
              ))
          : LoadingSegment}
      </Segment>
    </Grid>
  );

  return (
    <>
      {users}
      {posts}
    </>
  );
}
