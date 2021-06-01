import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  Container,
  Grid,
  Dimmer,
  Loader,
  Image,
  Segment,
  Header,
} from "semantic-ui-react";

import { FETCH_USER_QUERY, FETCH_POSTS_QUERY } from "../Util/graphql";
import PostCard from "../Components/PostCard";

export default function Users(props) {
  const singleUserName = props.match.url.split("/")[1];
  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);
  const { data: { getPosts: getPostsData } = {} } = useQuery(FETCH_POSTS_QUERY);

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 769) {
      setIsDesktop(true);
      setIsMobile(false);
    } else {
      setIsMobile(true);
      setIsDesktop(false);
    }
  }, []);

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

  users = (
    <Grid style={{ margin: "auto", marginTop: 30 }} centered>
      {getUserData
        ? getUserData
            .filter((item) => item.username === singleUserName)
            .map((user) => (
              <Header key={user.username} textAlign="center" as="h1">
                {user.username}
              </Header>
            ))
        : LoadingSegment}
    </Grid>
  );

  posts = getPostsData ? (
    getPostsData.filter((item) => item.username === singleUserName).length >
    1 ? (
      <Grid
        divided="vertically"
        style={{ marginTop: 40 }}
        columns={isDesktop ? 3 : isMobile ? 1 : 0}
      >
        {getPostsData
          .filter((item) => item.username === singleUserName)
          .map((post) => (
            <Grid.Column>
              <PostCard post={post} />
            </Grid.Column>
          ))}
      </Grid>
    ) : (
      <Segment style={{ margin: "auto", marginTop: 40 }}>
        <Header textAlign="center" as="h1">
          This user has no posts yet!
        </Header>
      </Segment>
    )
  ) : (
    LoadingSegment
  );

  return (
    <Container style={{ marginBottom: 30 }}>
      {users}
      {posts}
    </Container>
  );
}
