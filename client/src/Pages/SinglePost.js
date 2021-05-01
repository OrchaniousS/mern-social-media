import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Form,
  Grid,
  Dimmer,
  Loader,
  Image,
  Segment,
  Card,
  Button,
  Transition,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../Context/auth";
import LikeButton from "../Components/LikeButton";
import DeleteButton from "../Components/DeleteButton";
import PostsButton from "../Components/PostsButton";
import { FETCH_USER_QUERY } from "../Util/graphql";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const boxShadow = {
    boxShadow: "0 0 0.1rem black",
    margin: "0",
    display: "flex",
  };

  const [comment, setComment] = useState("");

  const { data: { getPost: posts } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCB() {
    props.history.push("/");
  }

  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  function getUserLogo(data, commentUsername) {
    for (var userData of data) {
      if (
        (userData.username === posts.username && !commentUsername) ||
        commentUsername === userData.username
      ) {
        return userData.logo;
      }
      if (commentUsername === userData.username) {
        return userData.logo;
      }
    }
  }

  let postMarkup;
  if (!posts) {
    postMarkup = (
      <Segment style={{ margin: "auto" }}>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
      </Segment>
    );
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = posts;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Button icon="image" color="red" disabled fluid />
            <Image
              style={boxShadow}
              src={getUserLogo(getUserData)}
              size="medium"
              fluid
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid style={boxShadow}>
              <Button icon="user" fluid disabled color="red" />
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <PostsButton post={{ id, commentCount }} />
                {user && user.username === username && (
                  <DeleteButton postId={id} cb={deletePostCB} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Button icon="comment" color="brown" fluid disabled />
                <Card.Content>
                  <p> Post a comment:</p>
                  <Form>
                    <div className="ui action input">
                      <input
                        type="text"
                        placeholder="What`s on your mind...?"
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <Button
                        icon="send"
                        tpye="submit"
                        color="brown"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      />
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Transition.Group duration={200} key={comment.id}>
                <Card fluid>
                  <Button icon="comments" fluid disabled />
                  <Card.Content style={{ display: "flex", margin: "0.3rem" }}>
                    <div>
                      <Button color="red" disabled>
                        <Image
                          style={boxShadow}
                          src={getUserLogo(getUserData, comment.username)}
                          float="right"
                          size="mini"
                        />
                        <Card.Header>{comment.username}</Card.Header>
                      </Button>
                      <Card.Meta>
                        {moment(comment.createdAt).fromNow()}
                      </Card.Meta>
                    </div>
                    <div style={{ margin: "1rem" }}>
                      <Card.Description>{comment.body}</Card.Description>
                    </div>
                  </Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                </Card>
              </Transition.Group>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
