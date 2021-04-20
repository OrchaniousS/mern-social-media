import React, { useContext } from "react";
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
  const { user, login } = useContext(AuthContext);

  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  const postsStatus = (x) =>
    loading ? (
      <Segment style={{ margin: "auto" }}>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>

        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
      </Segment>
    ) : (
      <Transition.Group>
        {x &&
          x.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))}
      </Transition.Group>
    );

  const userState = user && (
    <Grid.Column>
      <PostForm />
    </Grid.Column>
  );

  return (
    <div>
      <Grid columns={3}>
        <Grid.Row
          style={{
            display: "block",
            textAlign: "center",
            fontSize: "2rem",
            marginTop: "0.8rem",
          }}
        >
          <h1>Recent Posts</h1>
        </Grid.Row>
        {userState}
        <Grid.Row>{postsStatus(posts)}</Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
