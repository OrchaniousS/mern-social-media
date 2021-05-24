import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Transition,
  Dimmer,
  Loader,
  Image,
  Segment,
} from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";
import Fade from "react-reveal/Fade";

import UserList from "../Components/UserList";
import PostCard from "../Components/PostCard";
import PostForm from "../Components/PostForm";
import { FETCH_POSTS_QUERY } from "../Util/graphql";
import { AuthContext } from "../Context/auth";

function Home() {
  const { user } = useContext(AuthContext);

  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY,
    {
      variables: {
        user,
      },
    }
  );

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // function handleResize() {
    if (window.innerWidth > 769) {
      setIsDesktop(true);
      setIsMobile(false);
    } else {
      setIsMobile(true);
      setIsDesktop(false);
    }
    // }
    // window.addEventListener("resize", handleResize);
  }, []);

  const LoadingSegment = (
    <Segment style={{ margin: "auto" }}>
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
      <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
    </Segment>
  );

  const postsStatus = loading ? (
    LoadingSegment
  ) : (
    <Transition.Group duration={500}>
      {posts &&
        posts.map((post) => (
          <Grid.Column key={post.id}>
            <PostCard post={post} />
          </Grid.Column>
        ))}
    </Transition.Group>
  );

  return (
    <Fade big={isDesktop} cascade={isMobile}>
      <Grid
        columns={isDesktop ? 3 : isMobile ? 1 : 0}
        style={
          {
            // margin: "-1rem -1rem 3rem 1rem",
          }
        }
        className="page-home"
      >
        <Grid.Row style={{ placeContent: "center" }}>
          <UserList />
        </Grid.Row>
        <Grid.Row
          className="page-home-title"
          style={{ placeContent: "center" }}
        >
          {user && <PostForm />}
          <h1>Recent Posts</h1>
        </Grid.Row>
        {posts && postsStatus}
      </Grid>
    </Fade>
  );
}

export default Home;
