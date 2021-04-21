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

import PostCard from "../Components/PostCard";
import PostForm from "../Components/PostForm";
import { FETCH_POSTS_QUERY } from "../Util/graphql";
import { AuthContext } from "../Context/auth";

function Home() {
  const { user } = useContext(AuthContext);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 769) {
        setIsDesktop(true);
        setIsMobile(false);
      } else {
        setIsMobile(true);
        setIsDesktop(false);
      }
    }
    window.addEventListener("resize", handleResize);
  }, []);

  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

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
    <Transition.Group duration={200}>
      {posts &&
        posts.map((post) => (
          <Grid.Column key={post.id} style={{}}>
            <PostCard post={post} />
          </Grid.Column>
        ))}
    </Transition.Group>
  );

  return (
    <Grid columns={3} rows={3} style={{ marginBottom: 25 }}>
      <Grid.Row className="page-home-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      {user && <PostForm />}
      {posts && postsStatus}
    </Grid>
  );
}

export default Home;
