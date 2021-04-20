import React, { useContext } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import {
  Label,
  Icon,
  Grid,
  Dimmer,
  Loader,
  Image,
  Segment,
  Card,
  Button,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../Context/auth";
import LikeButton from "../Components/LikeButton";
import DeleteButton from "../Components/DeleteButton";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const boxShadow = {
    boxShadow: "0 0 0.2rem black",
    margin: "auto",
    display: "flex",
  };

  const { data: { getPost: posts } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  function deletePostCB() {
    props.history.push("/");
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
            <Image
              style={boxShadow}
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid style={boxShadow}>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("posted")}
                >
                  <Button basic color="grey">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="grey" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} cb={deletePostCB} />
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

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
