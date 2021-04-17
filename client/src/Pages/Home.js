import React from "react";

import { Grid, Transition } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";

import PostCard from "../Components/PostCard";
import { FETCH_POSTS_QUERY } from "../Util/graphql";

function Home() {
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  const postsStatus = (x) =>
    loading ? (
      <h1>Loading posts...</h1>
    ) : (
      x &&
      x.map((post) => (
        <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
          <PostCard post={post} />
        </Grid.Column>
      ))
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
        <Grid.Row>{postsStatus(posts)}</Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
